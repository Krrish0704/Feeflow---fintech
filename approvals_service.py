import uuid
from sqlalchemy.orm import Session
import models
import ledger_service

def request_waiver(db: Session, student_id: uuid.UUID, amount: float, requested_by: str):
    # Hackathon standard threshold (can be mapped from SchoolSetting table in V2)
    AUTO_APPROVE_THRESHOLD = 500.0

    if amount <= AUTO_APPROVE_THRESHOLD:
        new_waiver = models.WaiverApproval(
            student_id=student_id,
            requested_amount=amount,
            status="approved",
            requested_by=requested_by,
            approved_by="System_Auto_Threshold"
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
            metadata_payload={"requested_by": requested_by, "approved_by": "System_Auto_Threshold"}
        )
        
        db.commit()
        return {
            "status": "success", 
            "message": f"Waiver of ₹{amount} auto-approved (Under limit).", 
            "waiver": new_waiver
        }

    else:
        new_waiver = models.WaiverApproval(
            student_id=student_id,
            requested_amount=amount,
            status="pending",
            requested_by=requested_by
        )
        db.add(new_waiver)
        db.commit()
        db.refresh(new_waiver)
        
        return {
            "status": "pending", 
            "message": f"Waiver of ₹{amount} requires Governor approval (Over limit).", 
            "waiver": new_waiver
        }

def approve_waiver(db: Session, waiver_id: uuid.UUID, approved_by: str):
    waiver = db.query(models.WaiverApproval).filter(models.WaiverApproval.id == waiver_id).first()
    
    if not waiver:
        return {"status": "error", "message": "Waiver not found"}
    if waiver.status != "pending":
        return {"status": "error", "message": f"Waiver is already {waiver.status}"}

    # GOVERNANCE RULE: Prevent self-approval (Maker cannot be the Checker)
    if waiver.requested_by and waiver.requested_by == approved_by:
        return {"status": "error", "message": "Segregation of Duties Violation: You cannot approve a waiver you requested yourself."}

    waiver.status = "approved"
    waiver.approved_by = approved_by
    
    ref_id = f"WAIVER-{waiver.id}"
    ledger_res = ledger_service.record_ledger_entry(
        db=db,
        student_id=waiver.student_id,
        entry_type="waiver",
        amount=waiver.requested_amount,
        direction="credit", 
        reference_id=ref_id,
        source="governance_dashboard",
        metadata_payload={"requested_by": waiver.requested_by, "approved_by": approved_by}
    )
    
    if ledger_res["status"] == "success":
        db.commit()
        return {"status": "success", "message": "Waiver approved by governor and ledger updated.", "waiver": waiver}
    else:
        db.rollback()
        return {"status": "error", "message": "Failed to update ledger during approval."}