from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import models
import database
from routers import fees, waivers, payments, students, reconciliation, wallet
from seed_service import auto_seed_students

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Create tables on startup
    models.Base.metadata.create_all(bind=database.engine)
    
    # 2. Automatically seed 10,000 students on initialization if empty
    db = database.SessionLocal()
    try:
        auto_seed_students(db)
    finally:
        db.close()
        
    yield
    # Shutdown logic (if any)

app = FastAPI(
    title="FeeFlow FinTech Engine",
    description="An enterprise-grade, append-only school financial ledger with auto-seeding.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


app.include_router(fees.router)
app.include_router(waivers.router)
app.include_router(payments.router)
app.include_router(students.router)
app.include_router(reconciliation.router)
app.include_router(wallet.router)

@app.get("/")
def health_check():
    return {"status": "System Online", "database": "Connected & Auto-Seeded", "version": "1.0.0"}