from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.CommandResponse])
def read_commands(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    commands = db.query(models.Command).offset(skip).limit(limit).all()
    for c in commands:
        c.tags = c.tags.split(',') if c.tags else []
    return commands

@router.post("/", response_model=schemas.CommandResponse)
def create_command(command: schemas.CommandCreate, db: Session = Depends(get_db)):
    db_command = models.Command(
        id=command.id,
        name=command.name,
        description=command.description,
        examples=command.examples,
        options=command.options,
        tags=",".join(command.tags),
        frequency_used=command.frequency_used,
    )
    db.add(db_command)
    db.commit()
    db.refresh(db_command)
    
    db_command.tags = command.tags
    return db_command

@router.delete("/{command_id}")
def delete_command(command_id: str, db: Session = Depends(get_db)):
    db_command = db.query(models.Command).filter(models.Command.id == command_id).first()
    if not db_command:
        raise HTTPException(status_code=404, detail="Command not found")
    
    db.delete(db_command)
    db.commit()
    return {"ok": True}
