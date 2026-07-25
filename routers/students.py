import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import database
import schemas
import models
import balance_service
import wallet_service

router = APIRouter(prefix="/students", tags=["Student Accounts & Wallets"])

@router.get("/{student_id}/balance", response_model=schemas.StudentBalanceOut)
def get_student_balance(student_id: uuid.UUID, db: Session = Depends(database.get_db)):
    """Calculates real-time fee and wallet balances from the append-only ledger."""
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        return {"error": "Student not found"}
    return balance_service.calculate_student_balance(db=db, student_id=student_id)

@router.post("/wallet/refund")
def refund_to_wallet(refund: schemas.WalletRefundCreate, db: Session = Depends(database.get_db)):
    """Admin: Issue an emergency refund into a student's closed-loop wallet."""
    return wallet_service.issue_refund_to_wallet(
        db=db, student_id=refund.student_id, amount=refund.amount, reason=refund.reason
    )

@router.post("/wallet/pay")
def pay_with_wallet(payment: schemas.WalletPaymentCreate, db: Session = Depends(database.get_db)):
    """Student: Pay outstanding fees using their wallet balance."""
    return wallet_service.pay_fee_from_wallet(db=db, student_id=payment.student_id, amount=payment.amount)
