import uuid
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import models

def record_ledger_entry(
    db: Session,
    student_id: uuid.UUID,
    entry_type: str,  # 'charge', 'payment', or 'waiver'
    amount: float,
    direction: str,   # 'credit' (reduces debt) or 'debit' (increases debt)
    reference_id: str,
    source: str,
    metadata_payload: dict = None
):
    # 1. The Initial Check (Catches sequential duplicates)
    existing = db.query(models.LedgerEntry).filter(
        models.LedgerEntry.reference_id == reference_id
    ).first()
    
    if existing:
        return {"status": "ignored", "message": "Duplicate entry. Ledger untouched.", "entry": existing}

    # 2. Record the Entry
    entry = models.LedgerEntry(
        student_id=student_id,
        entry_type=entry_type,
        amount=amount,
        direction=direction,
        reference_id=reference_id,
        source=source,
        metadata_payload=metadata_payload or {}
    )
    db.add(entry)
    
    # 3. The Race Condition Lock (Catches simultaneous duplicate webhooks)
    try:
        db.commit()
        db.refresh(entry)
        return {"status": "success", "message": "Entry recorded successfully.", "entry": entry}
    except IntegrityError:
        db.rollback()
        # Fetch the existing one to return it just in case
        existing_locked = db.query(models.LedgerEntry).filter(
            models.LedgerEntry.reference_id == reference_id
        ).first()
        return {"status": "ignored", "message": "Duplicate caught by DB lock.", "entry": existing_locked}