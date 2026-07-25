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
    applicable_to: Optional[Dict[str, Any]] = None

class PaymentWebhook(BaseModel):
    student_id: UUID
    amount: float = Field(gt=0)
    reference_id: str
    source: str

# schemas.py additions
class StudentOut(BaseModel):
    id: UUID
    name: str
    grade: str
    
    # This is the magic line that allows reading from SQLAlchemy models
    model_config = {"from_attributes": True}

class FeeStructureOut(BaseModel):
    id: UUID
    name: str
    amount: float
    due_date: datetime
    conditions: Optional[Dict[str, Any]]
    is_active: bool
    
    model_config = {"from_attributes": True}
    applicable_to: Optional[Dict[str, Any]] = None

class FeeAssignmentCreate(BaseModel):
    student_id: UUID
    fee_structure_id: UUID

class FeeAssignmentOut(BaseModel):
    id: UUID
    student_id: UUID
    fee_structure_id: UUID
    charge_ledger_entry_id: Optional[UUID]
    
    model_config = {"from_attributes": True}

class StudentBalanceOut(BaseModel):
    student_id: UUID
    total_fee_charges: float
    total_fee_credits: float
    outstanding_fee_balance: float
    available_wallet_balance: float
    
class WalletRefundCreate(BaseModel):
    student_id: UUID
    amount: float
    reason: str

class WalletPaymentCreate(BaseModel):
    student_id: UUID
    amount: float
    
class OfflinePaymentCreate(BaseModel):
    student_id: UUID
    amount: float
    reference_id: str
    raw_data: dict

class StagingEntryOut(BaseModel):
    id: UUID
    status: str
    suggested_student_id: Optional[UUID]
    amount: float
    reference_id: str
    source: str
    
    model_config = {"from_attributes": True}

class WaiverCreate(BaseModel):
    student_id: UUID
    requested_amount: float

class WaiverOut(BaseModel):
    id: UUID
    student_id: UUID
    requested_amount: float
    status: str
    
    model_config = {"from_attributes": True}