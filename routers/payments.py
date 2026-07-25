from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import database
import schemas
import ledger_service

router = APIRouter(prefix="/payments", tags=["Payment Gateway & Ledger"])

@router.post("/webhook")
def process_payment_webhook(payment: schemas.PaymentWebhook, db: Session = Depends(database.get_db)):
    """Idempotent webhook listener for external payment gateways (UPI, Bank)."""
    return ledger_service.record_ledger_entry(
        db=db,
        student_id=payment.student_id,
        entry_type="payment",
        amount=payment.amount,
        direction="credit",
        reference_id=payment.reference_id,
        source=payment.source
    )