from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
import database
from routers import fees, waivers, payments, students, reconciliation, wallet

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="FeeFlow FinTech Engine",
    description="An enterprise-grade, append-only school financial ledger.",
    version="1.0.0"
)

# Enable CORS for Frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for hackathon development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fees.router)
app.include_router(waivers.router)
app.include_router(payments.router)
app.include_router(students.router)
app.include_router(reconciliation.router)
app.include_router(wallet.router) # Newly mounted wallet router

@app.get("/")
def health_check():
    return {"status": "System Online", "database": "Connected", "version": "1.0.0"}