from fastapi import FastAPI
import models
import database
# 1. ADD reconciliation to your imports
from routers import fees, waivers, payments, students, reconciliation 

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="FeeFlow FinTech Engine",
    description="An enterprise-grade, append-only school financial ledger.",
    version="1.0.0"
)

app.include_router(fees.router)
app.include_router(waivers.router)
app.include_router(payments.router)
app.include_router(students.router)
# 2. MOUNT the new router
app.include_router(reconciliation.router) 

@app.get("/")
def health_check():
    return {"status": "System Online", "database": "Connected", "version": "1.0.0"}