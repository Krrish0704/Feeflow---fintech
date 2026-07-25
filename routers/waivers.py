import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import database
import schemas
import models
import approvals_service

router = APIRouter(prefix="/waivers", tags=["Maker-Checker Waivers"])

@router.post("/request", response_model=dict)
def request_fee_waiver(waiver: schemas.WaiverCreate, db: Session = Depends(database.get_db)):
    """Maker: Request a waiver (auto-approves if under threshold)."""
    return approvals_service.request_waiver(
        db=db, 
        student_id=waiver.student_id, 
        amount=waiver.requested_amount, 
        requested_by=waiver.requested_by,
        reason=waiver.reason
    )

@router.get("/pending", response_model=list[schemas.WaiverOut])
def get_pending_waivers(db: Session = Depends(database.get_db)):
    """Checker: View all pending high-value waivers."""
    return db.query(models.WaiverApproval).filter(models.WaiverApproval.status == "pending").all()

@router.post("/{waiver_id}/approve")
def approve_fee_waiver(waiver_id: uuid.UUID, db: Session = Depends(database.get_db)):
    """Checker: Approve a pending waiver and update the ledger."""
    return approvals_service.approve_waiver(db=db, waiver_id=waiver_id)