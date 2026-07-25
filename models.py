from sqlalchemy import Column, String, Numeric, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid
from datetime import datetime
from database import Base

class Student(Base):
    __tablename__ = "students"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    grade = Column(String, nullable=False) # e.g., "10-A"

class LedgerEntry(Base):
    __tablename__ = "ledger_entries"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    entry_type = Column(String, nullable=False) # 'charge', 'payment', 'waiver'
    amount = Column(Numeric(10, 2), nullable=False) # Always positive
    direction = Column(String, nullable=False) # 'debit' or 'credit'
    
    # THE IDEMPOTENCY LOCK: Prevents double-charging
    reference_id = Column(String, unique=True, nullable=False, index=True) 
    
    source = Column(String, nullable=False) # 'upi', 'cash', 'system'
    metadata_payload = Column(JSONB, nullable=True) 
    created_at = Column(DateTime, default=datetime.utcnow)

class FeeStructure(Base):
    __tablename__ = "fee_structures"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    due_date = Column(DateTime, nullable=False)
    conditions = Column(JSONB, nullable=True) # The dynamic rule engine payload
    is_active = Column(Boolean, default=True)

class WaiverApproval(Base):
    __tablename__ = "waiver_approvals"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"))
    requested_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String, default="pending") # Maker-checker lock