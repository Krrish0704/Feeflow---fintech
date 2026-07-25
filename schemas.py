from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID

class StudentCreate(BaseModel):
    name: str
    grade: str

class FeeStructureCreate(BaseModel):
    name: str
    amount: float = Field(gt=0)
    due_date: datetime
    conditions: Optional[Dict[str, Any]] = None

class PaymentWebhook(BaseModel):
    student_id: UUID
    amount: float = Field(gt=0)
    reference_id: str
    source: str