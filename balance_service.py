import uuid
from sqlalchemy.orm import Session
from sqlalchemy import func
import models
import wallet_service # Import our new wallet service

def calculate_student_balance(db: Session, student_id: uuid.UUID):
    # 1. Sum up Fee Charges (Ignore wallet deductions)
    total_charges = db.query(func.sum(models.LedgerEntry.amount)).filter(
        models.LedgerEntry.student_id == student_id,
        models.LedgerEntry.direction == "debit",
        models.LedgerEntry.entry_type != "wallet_utilization" # KEEP WALLET MATH SEPARATE
    ).scalar() or 0.0

    # 2. Sum up Fee Payments & Waivers (Ignore wallet deposits)
    total_credits = db.query(func.sum(models.LedgerEntry.amount)).filter(
        models.LedgerEntry.student_id == student_id,
        models.LedgerEntry.direction == "credit",
        models.LedgerEntry.entry_type != "wallet_deposit" # KEEP WALLET MATH SEPARATE
    ).scalar() or 0.0

    # 3. Calculate Fee Balance
    fee_balance = total_charges - total_credits
    
    # 4. Fetch the Wallet Balance using our new service
    wallet_balance = wallet_service.get_wallet_balance(db, student_id)

    return {
        "student_id": student_id,
        "total_fee_charges": float(total_charges),
        "total_fee_credits": float(total_credits),
        "outstanding_fee_balance": float(fee_balance),
        "available_wallet_balance": float(wallet_balance) # Frontend can now show BOTH numbers!
    }