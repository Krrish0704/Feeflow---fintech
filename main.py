from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
import database
import models
import schemas
from uuid import UUID
from datetime import datetime

# 1. Initialize DB and FastAPI
models.Base.metadata.create_all(bind=database.engine)
app = FastAPI(title="FeeFlow API")

# 2. Student Routes
@app.post("/students", response_model=dict)
def create_student(student: schemas.StudentCreate, db: Session = Depends(database.get_db)):
    db_student = models.Student(name=student.name, grade=student.grade)
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return {"status": "success", "student_id": db_student.id}

@app.get("/students")
def get_students(db: Session = Depends(database.get_db)):
    return db.query(models.Student).all()

# 3. Dynamic Rule Engine (Creates the Fee)
@app.post("/fees/structures")
def create_fee_structure(fee: schemas.FeeStructureCreate, db: Session = Depends(database.get_db)):
    db_fee = models.FeeStructure(**fee.model_dump())
    db.add(db_fee)
    db.commit()
    db.refresh(db_fee)
    return db_fee

# 4. The Ledger: Dynamic Balance Calculation
@app.get("/students/{student_id}/balance")
def get_balance(student_id: UUID, db: Session = Depends(database.get_db)):
    # Calculate sum of debits (charges)
    debits = db.query(func.sum(models.LedgerEntry.amount)).filter(
        models.LedgerEntry.student_id == student_id,
        models.LedgerEntry.direction == "debit"
    ).scalar() or 0

    # Calculate sum of credits (payments/waivers)
    credits = db.query(func.sum(models.LedgerEntry.amount)).filter(
        models.LedgerEntry.student_id == student_id,
        models.LedgerEntry.direction == "credit"
    ).scalar() or 0

    return {
        "student_id": student_id,
        "total_debited": debits,
        "total_credited": credits,
        "current_balance_due": debits - credits
    }

# 5. The Payment Webhook (Idempotent Write Path)
@app.post("/payments/webhook")
def process_payment(payment: schemas.PaymentWebhook, db: Session = Depends(database.get_db)):
    # Check the Idempotency Lock
    existing = db.query(models.LedgerEntry).filter(
        models.LedgerEntry.reference_id == payment.reference_id
    ).first()
    
    if existing:
        return {"status": "ignored", "message": "Duplicate webhook received. Ledger untouched."}

    # Record the Payment (Credit)
    entry = models.LedgerEntry(
        student_id=payment.student_id,
        entry_type="payment",
        amount=payment.amount,
        direction="credit",
        reference_id=payment.reference_id,
        source=payment.source
    )
    db.add(entry)
    db.commit()
    
    return {"status": "success", "message": "Payment recorded to ledger."}