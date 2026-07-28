import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database
import schemas
import models
import fee_rule_engine
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/fees", tags=["Fee Management"])

@router.post("/structures", response_model=schemas.FeeStructureOut)
def create_fee_structure(schema: schemas.FeeStructureCreate, db: Session = Depends(database.get_db)):
    """Admin: Create a new dynamic fee structure (e.g., Late Fee, Bus Fee)."""
    
    new_structure = models.FeeStructure(
        name=schema.name,
        amount=schema.amount,
        due_date=schema.due_date,
        conditions=schema.conditions,
        applicable_to=schema.applicable_to
    )
    db.add(new_structure)
    
    # --- THE PATCH: Graceful Error Handling ---
    try:
        db.commit()
        db.refresh(new_structure)
        return new_structure
    except IntegrityError:
        db.rollback() # Undo the broken transaction safely
        raise HTTPException(
            status_code=400, 
            detail="Database constraint violated. This fee structure might already exist or contains invalid data."
        )

@router.post("/structures/{fee_id}/assign")
def assign_fee_to_students(fee_id: uuid.UUID, db: Session = Depends(database.get_db)):
    """Automatically parses JSONB rules and assigns fees to eligible students."""
    return fee_rule_engine.generate_fee_assignments(db=db, fee_structure_id=fee_id)