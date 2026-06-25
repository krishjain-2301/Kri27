from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.ChallengeResponse])
def read_challenges(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    challenges = db.query(models.Challenge).offset(skip).limit(limit).all()
    # Need to convert comma-separated strings back to lists for response
    for c in challenges:
        c.skills = c.skills.split(',') if c.skills else []
        c.tools = c.tools.split(',') if c.tools else []
        c.commands = c.commands.split(',') if c.commands else []
        c.tags = c.tags.split(',') if c.tags else []
    return challenges

@router.post("/", response_model=schemas.ChallengeResponse)
def create_challenge(challenge: schemas.ChallengeCreate, db: Session = Depends(get_db)):
    db_challenge = models.Challenge(
        id=challenge.id,
        name=challenge.name,
        difficulty=challenge.difficulty,
        category=challenge.category,
        os=challenge.os,
        platform=challenge.platform,
        date_completed=challenge.date_completed,
        time_spent_minutes=challenge.time_spent_minutes,
        skills=",".join(challenge.skills),
        tools=",".join(challenge.tools),
        commands=",".join(challenge.commands),
        tags=",".join(challenge.tags),
        enumeration=challenge.enumeration,
        notes=challenge.notes,
        mistakes_made=challenge.mistakes_made,
        lessons_learned=challenge.lessons_learned,
        alternative_approaches=challenge.alternative_approaches,
        is_favorite=challenge.is_favorite,
        external_url=challenge.external_url,
        review_status=challenge.review_status,
    )
    db.add(db_challenge)
    db.commit()
    db.refresh(db_challenge)
    
    # Format lists for response
    db_challenge.skills = challenge.skills
    db_challenge.tools = challenge.tools
    db_challenge.commands = challenge.commands
    db_challenge.tags = challenge.tags
    return db_challenge

@router.get("/{challenge_id}", response_model=schemas.ChallengeResponse)
def read_challenge(challenge_id: str, db: Session = Depends(get_db)):
    db_challenge = db.query(models.Challenge).filter(models.Challenge.id == challenge_id).first()
    if db_challenge is None:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    db_challenge.skills = db_challenge.skills.split(',') if db_challenge.skills else []
    db_challenge.tools = db_challenge.tools.split(',') if db_challenge.tools else []
    db_challenge.commands = db_challenge.commands.split(',') if db_challenge.commands else []
    db_challenge.tags = db_challenge.tags.split(',') if db_challenge.tags else []
    return db_challenge

@router.delete("/{challenge_id}")
def delete_challenge(challenge_id: str, db: Session = Depends(get_db)):
    db_challenge = db.query(models.Challenge).filter(models.Challenge.id == challenge_id).first()
    if db_challenge is None:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    db.delete(db_challenge)
    db.commit()
    return {"ok": True}
