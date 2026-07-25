import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import models
import ledger_service

def resolve_amount(base_amount: float, conditions: dict | None, due_date: datetime, as_of: datetime = None) -> float:
    """Evaluates JSONB conditions for late penalties or sibling discounts dynamically."""
    as_of = as_of or datetime.utcnow()
    base_amount = float(base_amount)
    
    if not conditions:
        return base_amount
    
    amount = base_amount
    
    if "penalty_pct" in conditions:
        grace = conditions.get("grace_period_days", 0)
        if as_of > due_date + timedelta(days=grace):
            amount += base_amount * (conditions["penalty_pct"] / 100.0)
            
    if "sibling_discount_pct" in conditions:
        amount -= base_amount * (conditions["sibling_discount_pct"] / 100.0)
        
    return round(max(0.0, amount), 2)
    

def generate_fee_assignments(db: Session, fee_structure_id: uuid.UUID):
    fee_rule = db.query(models.FeeStructure).filter(models.FeeStructure.id == fee_structure_id).first()
    if not fee_rule:
        return {"status": "error", "message": "Fee structure not found"}

    target_grade = None
    if fee_rule.applicable_to and "grade" in fee_rule.applicable_to:
        target_grade = fee_rule.applicable_to["grade"]

    student_query = db.query(models.Student)
    if target_grade:
        student_query = student_query.filter(models.Student.grade == target_grade)
    
    target_students = student_query.all()
    assignments_created = 0

    # Calculate final dynamic amount using conditions JSONB
    final_amount = resolve_amount(fee_rule.amount, fee_rule.conditions, fee_rule.due_date)

    for student in target_students:
        ref_id = f"CHARGE-{student.id}-{fee_rule.id}"
        
        # Write debt to ledger
        ledger_res = ledger_service.record_ledger_entry(
            db=db,
            student_id=student.id,
            entry_type="charge",
            amount=final_amount,
            direction="debit",
            reference_id=ref_id,
            source="system_rule_engine",
            metadata_payload={"fee_name": fee_rule.name, "due_date": fee_rule.due_date.isoformat()}
        )

        # SELF-HEALING FIX: Handle both 'success' and 'ignored' (idempotent recovery)
        if ledger_res["status"] in ("success", "ignored"):
            entry_id = ledger_res["entry"].id
            
            # Check if FeeAssignment exists; if orphaned, backfill it safely
            existing_assignment = db.query(models.FeeAssignment).filter_by(
                student_id=student.id, fee_structure_id=fee_rule.id
            ).first()
            
            if not existing_assignment:
                new_assignment = models.FeeAssignment(
                    student_id=student.id,
                    fee_structure_id=fee_rule.id,
                    charge_ledger_entry_id=entry_id
                )
                db.add(new_assignment)
                assignments_created += 1

    db.commit()
    
    return {
        "status": "success", 
        "message": f"Successfully processed rule for {assignments_created} students (Calculated Amount: ₹{final_amount}).",
        "students_charged": assignments_created
    }