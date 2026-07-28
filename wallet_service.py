import uuid
from sqlalchemy.orm import Session
from sqlalchemy import func
import models
import ledger_service

def get_wallet_balance(db: Session, student_id: uuid.UUID):
    deposits = float(db.query(func.sum(models.LedgerEntry.amount)).filter(
        models.LedgerEntry.student_id == student_id,
        models.LedgerEntry.entry_type == "wallet_deposit"
    ).scalar() or 0.0)

    utilizations = float(db.query(func.sum(models.LedgerEntry.amount)).filter(
        models.LedgerEntry.student_id == student_id,
        models.LedgerEntry.entry_type == "wallet_utilization"
    ).scalar() or 0.0)

    return deposits - utilizations

def issue_refund_to_wallet(db: Session, student_id: uuid.UUID, amount: float, reason: str):
    ref_id = f"REFUND-{uuid.uuid4().hex[:8]}"
    return ledger_service.record_ledger_entry(
        db=db,
        student_id=student_id,
        entry_type="wallet_deposit",
        amount=amount,
        direction="credit", 
        reference_id=ref_id,
        source="system_refund_admin",
        metadata_payload={"reason": reason},
        auto_commit=True
    )
def pay_fee_from_wallet(db: Session, student_id: uuid.UUID, amount: float):
    # 1. ACQUIRE ROW LOCK: Force concurrent requests for this student to wait in line
    student_lock = db.query(models.Student).filter(
        models.Student.id == student_id
    ).with_for_update().first()
    
    if not student_lock:
        return {"status": "error", "message": "Student not found."}

    # 2. Safely read balance ONLY AFTER the lock is acquired
    current_wallet_balance = get_wallet_balance(db, student_id)
    if current_wallet_balance < amount:
        return {"status": "error", "message": f"Insufficient wallet balance. You only have ₹{current_wallet_balance}"}

    ref_group = f"W-PAY-{uuid.uuid4().hex[:8]}"
    
    try:
        # 3. DEBIT the wallet (auto_commit=False)
        res1 = ledger_service.record_ledger_entry(
            db=db, student_id=student_id, entry_type="wallet_utilization",
            amount=amount, direction="debit", reference_id=f"{ref_group}-OUT",
            source="student_wallet", metadata_payload={"linked_txn": ref_group},
            auto_commit=False
        )
        if res1["status"] == "ignored":
            db.rollback()
            return {"status": "error", "message": "Duplicate transaction reference."}

        # 4. CREDIT the fee account (auto_commit=False)
        res2 = ledger_service.record_ledger_entry(
            db=db, student_id=student_id, entry_type="payment",
            amount=amount, direction="credit", reference_id=f"{ref_group}-IN",
            source="student_wallet", metadata_payload={"linked_txn": ref_group},
            auto_commit=False
        )
        if res2["status"] == "ignored":
            db.rollback()
            return {"status": "error", "message": "Duplicate transaction reference."}

        # 5. ATOMIC COMMIT: Both entries land together, and the row lock is released!
        db.commit()
        return {
            "status": "success", 
            "message": f"₹{amount} successfully paid from wallet atomically.", 
            "new_wallet_balance": current_wallet_balance - amount
        }
    except Exception as e:
        db.rollback() # Rolls back changes AND releases the row lock safely
        return {"status": "error", "message": f"Atomic transaction failed: {str(e)}"}