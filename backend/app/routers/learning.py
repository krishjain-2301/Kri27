from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.LearningResponse])
def read_learning_entries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    entries = db.query(models.LearningEntry).offset(skip).limit(limit).all()
    for e in entries:
        e.commands = e.commands.split(',') if e.commands else []
        e.tags = e.tags.split(',') if e.tags else []
        e.mitre_attack_techniques = e.mitre_attack_techniques.split(',') if e.mitre_attack_techniques else []
    return entries

@router.post("/", response_model=schemas.LearningResponse)
def create_learning_entry(entry: schemas.LearningCreate, db: Session = Depends(get_db)):
    db_entry = models.LearningEntry(
        id=entry.id,
        title=entry.title,
        category=entry.category,
        difficulty=entry.difficulty,
        summary=entry.summary,
        detailed_notes=entry.detailed_notes,
        concept_explanation=entry.concept_explanation,
        examples=entry.examples,
        real_world_applications=entry.real_world_applications,
        commands=",".join(entry.commands),
        tags=",".join(entry.tags),
        mitre_attack_techniques=",".join(entry.mitre_attack_techniques),
        owasp_category=entry.owasp_category,
        confidence_level=entry.confidence_level,
        needs_revision=entry.needs_revision,
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    
    db_entry.commands = entry.commands
    db_entry.tags = entry.tags
    db_entry.mitre_attack_techniques = entry.mitre_attack_techniques
    return db_entry
