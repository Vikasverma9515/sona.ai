from dotenv import load_dotenv
import os

# Load environment variables BEFORE importing app modules
load_dotenv()

from fastapi import FastAPI
from app.webhooks import router as webhook_router
from app.oauth import router as oauth_router
from app.scheduler import start_scheduler

app = FastAPI(title="Sona")

app.include_router(webhook_router)
app.include_router(oauth_router)


@app.on_event("startup")
async def startup_event():
    start_scheduler()
    print("Sona started. 💜")


@app.get("/")
async def root():
    return {"message": "Sona is running. 💜"}
