import uuid
from sqlalchemy.orm import Session
import models
import ledger_service

def request_waiver(db: Session, student_id: uuid.UUID, amount: float):
    # The Threshold Rule (Under ₹500 is auto-approved)
    AUTO_APPROVE_THRESHOLD = 500.0

    if amount <= AUTO_APPROVE_THRESHOLD:
        # 1. It's under the limit! Auto-approve it instantly.
        new_waiver = models.WaiverApproval(
            student_id=student_id,
            requested_amount=amount,
            status="approved" 
        )
        db.add(new_waiver)
        db.flush() # Generates the UUID so we can use it below without committing yet

        # 2. Write straight to the ledger
        ref_id = f"WAIVER-AUTO-{new_waiver.id}"
        ledger_service.record_ledger_entry(
            db=db,
            student_id=student_id,
            entry_type="waiver",
            amount=amount,
            direction="credit",
            reference_id=ref_id,
            source="system_auto_approval",
            metadata_payload={"approved_by": "System_Auto_Threshold"}
        )
        
        db.commit()
        return {
            "status": "success", 
            "message": f"Waiver of ₹{amount} auto-approved (Under ₹{AUTO_APPROVE_THRESHOLD} limit).", 
            "waiver": new_waiver
        }

    else:
        # 3. It's over the limit. Send it to the Governor queue.
        new_waiver = models.WaiverApproval(
            student_id=student_id,
            requested_amount=amount,
            status="pending"
        )
        db.add(new_waiver)
        db.commit()
        db.refresh(new_waiver)
        
        return {
            "status": "pending", 
            "message": f"Waiver of ₹{amount} requires Governor approval (Over ₹{AUTO_APPROVE_THRESHOLD} limit).", 
            "waiver": new_waiver
        }

def approve_waiver(db: Session, waiver_id: uuid.UUID):
    # The Checker approves it
    waiver = db.query(models.WaiverApproval).filter(models.WaiverApproval.id == waiver_id).first()
    
    if not waiver:
        return {"status": "error", "message": "Waiver not found"}
    if waiver.status != "pending":
        return {"status": "error", "message": f"Waiver is already {waiver.status}"}

    # 1. Update the waiver status
    waiver.status = "approved"
    
    # 2. Write the credit to the ledger to reduce the student's debt
    ref_id = f"WAIVER-{waiver.id}"
    
    ledger_res = ledger_service.record_ledger_entry(
        db=db,
        student_id=waiver.student_id,
        entry_type="waiver",
        amount=waiver.requested_amount,
        direction="credit", 
        reference_id=ref_id,
        source="governance_dashboard",
        metadata_payload={"approved_by": "System_Governor"}
    )
    
    if ledger_res["status"] == "success":
        db.commit()
        return {"status": "success", "message": "Waiver approved and ledger updated.", "waiver": waiver}
    else:
        db.rollback()
        return {"status": "error", "message": "Failed to update ledger during approval."}