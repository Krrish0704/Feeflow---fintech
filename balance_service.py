import uuid
from sqlalchemy.orm import Session
from sqlalchemy import func
import models
import wallet_service

def calculate_student_balance(db: Session, student_id: uuid.UUID):
    # Wrap in float(...) to prevent Decimal - float TypeError
    total_charges = float(db.query(func.sum(models.LedgerEntry.amount)).filter(
        models.LedgerEntry.student_id == student_id,
        models.LedgerEntry.direction == "debit",
        models.LedgerEntry.entry_type != "wallet_utilization"
    ).scalar() or 0.0)

    total_credits = float(db.query(func.sum(models.LedgerEntry.amount)).filter(
        models.LedgerEntry.student_id == student_id,
        models.LedgerEntry.direction == "credit",
        models.LedgerEntry.entry_type != "wallet_deposit"
    ).scalar() or 0.0)

    fee_balance = total_charges - total_credits
    wallet_balance = wallet_service.get_wallet_balance(db, student_id)

    return {
        "student_id": student_id,
        "total_fee_charges": total_charges,
        "total_fee_credits": total_credits,
        "outstanding_fee_balance": fee_balance,
        "available_wallet_balance": float(wallet_balance)
    }