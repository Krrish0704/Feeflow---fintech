import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database
import schemas
import models
import balance_service

router = APIRouter(prefix="/students", tags=["Student Accounts & Balances"])

@router.post("/", response_model=dict)
def create_student(student: schemas.StudentCreate, db: Session = Depends(database.get_db)):
    """Admin: Register a new student into the system."""
    new_student = models.Student(
        name=student.name,
        email=student.email,
        grade=student.grade,
        section=student.section
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return {"status": "success", "student_id": new_student.id}

@router.get("/", response_model=list[dict])
def list_students(db: Session = Depends(database.get_db)):
    """Admin: List all students."""
    students = db.query(models.Student).all()
    return [{"id": s.id, "name": s.name, "grade": s.grade, "section": s.section} for s in students]

@router.get("/{student_id}/balance", response_model=schemas.StudentBalanceOut)
def get_student_balance(student_id: uuid.UUID, db: Session = Depends(database.get_db)):
    """Calculates real-time fee and wallet balances from the append-only ledger."""
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return balance_service.calculate_student_balance(db=db, student_id=student_id)

@router.get("/{student_id}/ledger/history", response_model=list[dict])
def get_student_ledger_history(student_id: uuid.UUID, db: Session = Depends(database.get_db)):
    """Auditor: View the immutable, append-only financial ledger history for a student."""
    entries = db.query(models.LedgerEntry).filter(models.LedgerEntry.student_id == student_id).order_by(models.LedgerEntry.timestamp.desc()).all()
    return [
        {
            "id": e.id,
            "entry_type": e.entry_type,
            "amount": float(e.amount),
            "direction": e.direction,
            "reference_id": e.reference_id,
            "source": e.source,
            "timestamp": e.timestamp.isoformat(),
            "metadata": e.metadata_payload
        }
        for e in entries
    ]