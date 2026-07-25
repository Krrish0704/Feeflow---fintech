import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import database
import fee_rule_engine

router = APIRouter(prefix="/fees", tags=["Fee Management"])

@router.post("/structures/{fee_id}/assign")
def assign_fee_to_students(fee_id: uuid.UUID, db: Session = Depends(database.get_db)):
    """Automatically parses JSONB rules and assigns fees to eligible students."""
    return fee_rule_engine.generate_fee_assignments(db=db, fee_structure_id=fee_id)
