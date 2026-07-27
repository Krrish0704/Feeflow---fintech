import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import database
import schemas
import models
import fee_rule_engine

router = APIRouter(prefix="/fees", tags=["Fee Management"])

@router.post("/structures", response_model=dict)
def create_fee_structure(fee: schemas.FeeStructureCreate, db: Session = Depends(database.get_db)):
    """Admin: Define a new flexible fee rule with JSONB conditions."""
    new_fee = models.FeeStructure(
        name=fee.name,
        amount=fee.amount,
        due_date=fee.due_date,
        applicable_to=fee.applicable_to,
        conditions=fee.conditions
    )
    db.add(new_fee)
    db.commit()
    db.refresh(new_fee)
    return {"status": "success", "fee_structure_id": new_fee.id}

@router.post("/structures/{fee_id}/assign")
def assign_fee_to_students(fee_id: uuid.UUID, db: Session = Depends(database.get_db)):
    """Automatically parses JSONB rules and assigns fees to eligible students."""
    return fee_rule_engine.generate_fee_assignments(db=db, fee_structure_id=fee_id)