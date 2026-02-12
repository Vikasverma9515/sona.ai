from fastapi import FastAPI
from app.webhooks import router as webhook_router
from app.scheduler import start_scheduler
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="LifeOps AI")

app.include_router(webhook_router)


@app.on_event("startup")
async def startup_event():
    start_scheduler()
    print("LifeOps AI started.")


@app.get("/")
async def root():
    return {"message": "LifeOps AI is running."}
