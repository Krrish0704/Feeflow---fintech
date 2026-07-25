import uuid
from sqlalchemy.orm import Session
from sqlalchemy import func
import models
import ledger_service

def get_wallet_balance(db: Session, student_id: uuid.UUID):
    # 1. Sum up money entering the wallet (Refunds / Overpayments)
    deposits = db.query(func.sum(models.LedgerEntry.amount)).filter(
        models.LedgerEntry.student_id == student_id,
        models.LedgerEntry.entry_type == "wallet_deposit"
    ).scalar() or 0.0

    # 2. Sum up money leaving the wallet (Paying for fees)
    utilizations = db.query(func.sum(models.LedgerEntry.amount)).filter(
        models.LedgerEntry.student_id == student_id,
        models.LedgerEntry.entry_type == "wallet_utilization"
    ).scalar() or 0.0

    return deposits - utilizations

def issue_refund_to_wallet(db: Session, student_id: uuid.UUID, amount: float, reason: str):
    ref_id = f"REFUND-{uuid.uuid4().hex[:8]}"
    
    # Write a credit to the ledger, specifically tagged as a wallet_deposit
    return ledger_service.record_ledger_entry(
        db=db,
        student_id=student_id,
        entry_type="wallet_deposit",
        amount=amount,
        direction="credit", 
        reference_id=ref_id,
        source="system_refund_admin",
        metadata_payload={"reason": reason}
    )

def pay_fee_from_wallet(db: Session, student_id: uuid.UUID, amount: float):
    # 1. Check if they actually have enough money in the wallet
    current_wallet_balance = get_wallet_balance(db, student_id)
    if current_wallet_balance < amount:
        return {"status": "error", "message": f"Insufficient wallet balance. You only have ₹{current_wallet_balance}"}

    # Generate a unique transaction group ID so auditors can link the two entries
    ref_group = f"W-PAY-{uuid.uuid4().hex[:8]}"
    
    # 2. DEBIT the wallet (Take the money out of the Stored Value facility)
    ledger_service.record_ledger_entry(
        db=db,
        student_id=student_id,
        entry_type="wallet_utilization",
        amount=amount,
        direction="debit",
        reference_id=f"{ref_group}-OUT",
        source="student_wallet",
        metadata_payload={"linked_txn": ref_group, "note": "Wallet Deduction"}
    )

    # 3. CREDIT the fee account (Pay the actual school fee)
    res = ledger_service.record_ledger_entry(
        db=db,
        student_id=student_id,
        entry_type="payment",
        amount=amount,
        direction="credit",
        reference_id=f"{ref_group}-IN",
        source="student_wallet",
        metadata_payload={"linked_txn": ref_group, "note": "Fee Payment via Wallet"}
    )
    
    return {"status": "success", "message": f"₹{amount} successfully paid from wallet.", "new_wallet_balance": current_wallet_balance - amount}