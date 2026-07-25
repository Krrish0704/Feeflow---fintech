from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import database
import schemas
import wallet_service

router = APIRouter(prefix="/wallet", tags=["Student Stored-Value Wallet"])

@router.post("/refund")
def refund_to_wallet(refund: schemas.WalletRefundCreate, db: Session = Depends(database.get_db)):
    """Admin: Issue an emergency refund into a student's closed-loop wallet."""
    return wallet_service.issue_refund_to_wallet(
        db=db, student_id=refund.student_id, amount=refund.amount, reason=refund.reason
    )

@router.post("/pay")
def pay_with_wallet(payment: schemas.WalletPaymentCreate, db: Session = Depends(database.get_db)):
    """Student: Pay outstanding fees atomically using their wallet balance."""
    return wallet_service.pay_fee_from_wallet(db=db, student_id=payment.student_id, amount=payment.amount)