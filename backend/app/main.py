from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import challenges, learning, notes, commands, payloads

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CenWo API", version="1.0.0")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(challenges.router, prefix="/api/challenges", tags=["challenges"])
app.include_router(learning.router, prefix="/api/learning", tags=["learning"])
app.include_router(notes.router, prefix="/api/notes", tags=["notes"])
app.include_router(commands.router, prefix="/api/commands", tags=["commands"])
app.include_router(payloads.router, prefix="/api/payloads", tags=["payloads"])

@app.get("/")
def read_root():
    return {"message": "Welcome to CenWo API"}
