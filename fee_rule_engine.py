import uuid
from sqlalchemy.orm import Session
import models
import ledger_service

def generate_fee_assignments(db: Session, fee_structure_id: uuid.UUID):
    # 1. Fetch the Rule
    fee_rule = db.query(models.FeeStructure).filter(models.FeeStructure.id == fee_structure_id).first()
    if not fee_rule:
        return {"status": "error", "message": "Fee structure not found"}

    # 2. Determine who it applies to (e.g., {"grade": "10"})
    target_grade = None
    if fee_rule.applicable_to and "grade" in fee_rule.applicable_to:
        target_grade = fee_rule.applicable_to["grade"]

    # 3. Fetch matching students
    student_query = db.query(models.Student)
    if target_grade:
        student_query = student_query.filter(models.Student.grade == target_grade)
    
    target_students = student_query.all()
    assignments_created = 0

    # 4. Process each student idempotently
    for student in target_students:
        # Check if already assigned to prevent double-charging
        existing_assignment = db.query(models.FeeAssignment).filter(
            models.FeeAssignment.student_id == student.id,
            models.FeeAssignment.fee_structure_id == fee_rule.id
        ).first()
        
        if existing_assignment:
            continue

        # Create a unique reference ID for this specific charge
        ref_id = f"CHARGE-{student.id}-{fee_rule.id}"
        
        # Write the debt to the ledger using our secure service
        ledger_res = ledger_service.record_ledger_entry(
            db=db,
            student_id=student.id,
            entry_type="charge",
            amount=fee_rule.amount,
            direction="debit",  # Debit increases what the student owes
            reference_id=ref_id,
            source="system_rule_engine",
            metadata_payload={"fee_name": fee_rule.name, "due_date": fee_rule.due_date.isoformat()}
        )

        if ledger_res["status"] == "success":
            # Link the ledger entry to a formal Fee Assignment
            new_assignment = models.FeeAssignment(
                student_id=student.id,
                fee_structure_id=fee_rule.id,
                charge_ledger_entry_id=ledger_res["entry"].id
            )
            db.add(new_assignment)
            assignments_created += 1

    # Commit all assignments to the database
    db.commit()
    
    return {
        "status": "success", 
        "message": f"Successfully charged {assignments_created} students.",
        "students_charged": assignments_created
    }