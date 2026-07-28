import uuid
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
import database
import schemas
import models
import reconciliation_service
import csv
import io

router = APIRouter(prefix="/reconciliation", tags=["Reconciliation & Bulk Import"])

@router.post("/sync-offline")
def sync_offline_payments(payment: schemas.OfflinePaymentCreate, db: Session = Depends(database.get_db)):
    """Receives delayed cash payments when the frontend regains internet."""
    return reconciliation_service.ingest_offline_payment(
        db=db, 
        student_id=payment.student_id, 
        amount=payment.amount, 
        ref_id=payment.reference_id, 
        raw_data=payment.raw_data
    )

@router.get("/pending", response_model=list[schemas.StagingEntryOut])
def get_pending_staging_entries(db: Session = Depends(database.get_db)):
    """Admin dashboard route to view all un-reconciled offline payments."""
    return db.query(models.StagingEntry).filter(models.StagingEntry.status == "pending").all()

@router.post("/{staging_id}/promote")
def promote_entry_to_ledger(staging_id: uuid.UUID, db: Session = Depends(database.get_db)):
    """Admin approves an offline payment, officially moving it into the financial ledger."""
    return reconciliation_service.promote_staging_entry(db=db, staging_id=staging_id)
