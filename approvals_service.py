from datetime import datetime
import uuid
from sqlalchemy.orm import Session
import models
import ledger_service

def _waiver_to_dict(w):
    """Helper to serialize SQLAlchemy WaiverApproval model safely, avoiding ORM recursion."""
    if not w:
        return None
    return {
        "id": str(w.id),
        "student_id": str(w.student_id),
        "requested_amount": float(w.requested_amount),
        "status": w.status,
        "requested_by": w.requested_by,
        "approved_by": w.approved_by,
        "reason": w.reason,
        "resolved_at": w.resolved_at.isoformat() if w.resolved_at else None,
    }

def request_waiver(db: Session, student_id: uuid.UUID, amount: float, requested_by: str, reason: str = None):
    # 1. Verify student exists to prevent foreign key crashes
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        return {"status": "error", "message": "Student not found in the database."}

    AUTO_APPROVE_THRESHOLD = 500.0

    if amount <= AUTO_APPROVE_THRESHOLD:
        new_waiver = models.WaiverApproval(
            student_id=student_id,
            requested_amount=amount,
            status="approved",
            requested_by=requested_by,
            approved_by="System_Auto_Threshold",
            reason=reason,
            resolved_at=datetime.utcnow()
        )
        db.add(new_waiver)
        db.flush() 

        ref_id = f"WAIVER-AUTO-{new_waiver.id}"
        ledger_service.record_ledger_entry(
            db=db,
            student_id=student_id,
            entry_type="waiver",
            amount=amount,
            direction="credit",
            reference_id=ref_id,
            source="system_auto_approval",
            metadata_payload={"requested_by": requested_by, "approved_by": "System_Auto_Threshold", "reason": reason}
        )
        
        db.commit()
        db.refresh(new_waiver)
        return {
            "status": "success",
            "message": f"Waiver of ₹{amount} auto-approved (under ₹500 threshold) and committed to ledger.",
            "waiver": _waiver_to_dict(new_waiver)
        }
    else:
        # Route to principal approval queue for amounts > 500
        new_waiver = models.WaiverApproval(
            student_id=student_id,
            requested_amount=amount,
            status="pending",
            requested_by=requested_by,
            reason=reason
        )
        db.add(new_waiver)
        db.commit()
        db.refresh(new_waiver)
        return {
            "status": "pending",
            "message": f"Waiver of ₹{amount} exceeds ₹500 threshold. Routed to Principal governance queue.",
            "waiver": _waiver_to_dict(new_waiver)
        }

def approve_waiver(db: Session, waiver_id: uuid.UUID, approved_by: str):
    waiver = db.query(models.WaiverApproval.WaiverApproval if hasattr(models.WaiverApproval, 'WaiverApproval') else models.WaiverApproval).filter(
        models.WaiverApproval.id == waiver_id
    ).first()
    
    if not waiver:
        return {"status": "error", "message": "Waiver request not found."}
        
    if waiver.status == "approved":
        return {"status": "error", "message": "Waiver is already approved."}

    # Segregation of duties check (Maker cannot be Checker)
    if waiver.requested_by == approved_by:
        return {"status": "error", "message": "Segregation of Duties Violation: You cannot approve a waiver you requested yourself."}

    waiver.status = "approved"
    waiver.approved_by = approved_by
    waiver.resolved_at = datetime.utcnow()

    ref_id = f"WAIVER-PRIN-{waiver.id}"
    ledger_service.record_ledger_entry(
        db=db,
        student_id=waiver.student_id,
        entry_type="waiver",
        amount=waiver.requested_amount,
        direction="credit",
        reference_id=ref_id,
        source="principal_governance_queue",
        metadata_payload={"requested_by": waiver.requested_by, "approved_by": approved_by, "reason": waiver.reason}
    )

    db.commit()
    db.refresh(waiver)
    return {
        "status": "success",
        "message": f"Waiver of ₹{waiver.requested_amount} authorized by Principal and committed to ledger.",
        "waiver": _waiver_to_dict(waiver)
    }