import uuid
from sqlalchemy.orm import Session
import models
import ledger_service

def ingest_offline_payment(db: Session, student_id: uuid.UUID, amount: float, ref_id: str, raw_data: dict):
    # Safely land the data in the staging area first
    entry = models.StagingEntry(
        raw_data=raw_data,
        status="pending",
        suggested_student_id=student_id,
        amount=amount,
        reference_id=ref_id,
        source="offline_cash_queue"
    )
    db.add(entry)
    
    try:
        db.commit()
        db.refresh(entry)
        return {"status": "staged", "message": "Offline payment caught in staging.", "entry": entry}
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": "Duplicate offline sync detected."}

def promote_staging_entry(db: Session, staging_id: uuid.UUID):
    # Admin clicks 'Approve' to move money from staging to the actual ledger
    staging = db.query(models.StagingEntry).filter(models.StagingEntry.id == staging_id).first()
    
    if not staging:
        return {"status": "error", "message": "Entry not found"}
    if staging.status != "pending":
        return {"status": "error", "message": f"Entry is already {staging.status}"}

    # Use our bulletproof ledger service to move the money!
    ledger_res = ledger_service.record_ledger_entry(
        db=db,
        student_id=staging.suggested_student_id,
        entry_type="payment",
        amount=staging.amount,
        direction="credit",  # It's a payment, so it reduces debt
        reference_id=staging.reference_id,
        source=staging.source,
        metadata_payload={"promoted_from_staging": str(staging.id), "original_data": staging.raw_data}
    )
    
    if ledger_res["status"] == "success":
        staging.status = "matched"
        db.commit()
        return {"status": "success", "message": "Payment officially promoted to ledger."}
    else:
        staging.status = "failed"
        db.commit()
        return {"status": "failed", "message": ledger_res["message"]}