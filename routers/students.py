import uuid
import csv
import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import database
import schemas
import models
import balance_service

router = APIRouter(prefix="/students", tags=["Student Accounts & Balances"])

@router.post("/", response_model=dict)
def create_student(student: schemas.StudentCreate, db: Session = Depends(database.get_db)):
    """Admin: Register a new student into the system with financial status tracking."""
    new_student = models.Student(
        admission_number=getattr(student, "admission_number", f"ADM-{uuid.uuid4().hex[:6].upper()}"),
        name=student.name,
        grade=student.grade,
        section=getattr(student, "section", None),
        total_fee=getattr(student, "total_fee", 0.0),
        paid_amount=getattr(student, "paid_amount", 0.0),
        due_amount=getattr(student, "due_amount", 0.0),
        late_fee=getattr(student, "late_fee", 0.0),
        status=getattr(student, "status", "PENDING")
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return {"status": "success", "student_id": str(new_student.id)}

@router.post("/upload-csv", response_model=dict)
async def upload_students_csv(file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    contents = await file.read()
    reader = csv.DictReader(io.StringIO(contents.decode('utf-8')))
    
    # Safe float parser
    def safe_float(val):
        if not val or str(val).strip() == "": return 0.0
        try: return float(val)
        except ValueError: return 0.0

    count = 0
    for row in reader:
        try:
            student_obj = models.Student(
                admission_number=row.get("admission_number") or row.get("admission"),
                name=row.get("student_name") or row.get("name"),
                grade=row.get("grade"),
                section=row.get("section"),
                total_fee=safe_float(row.get("total_fee")),
                paid_amount=safe_float(row.get("paid_amount")),
                due_amount=safe_float(row.get("due_amount")),
                late_fee=safe_float(row.get("late_fee")),
                status=row.get("status", "PENDING")
            )
            db.add(student_obj)
            db.flush() # Flush per row to catch duplicates instantly
            count += 1
        except Exception:
            db.rollback() # If this row is a duplicate or broken, skip it and continue
            continue
            
    db.commit()
    return {"status": "success", "rows_imported": count}

@router.get("/", response_model=list[dict])
def list_students(db: Session = Depends(database.get_db)):
    """Admin: List all students."""
    students = db.query(models.Student).all()
    return [
        {
            "id": str(s.id), 
            "admission_number": getattr(s, "admission_number", ""),
            "name": s.name, 
            "grade": s.grade, 
            "section": getattr(s, "section", ""),
            "due_amount": getattr(s, "due_amount", 0.0),
            "status": getattr(s, "status", "PENDING")
        } 
        for s in students
    ]

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
            "id": str(e.id),
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