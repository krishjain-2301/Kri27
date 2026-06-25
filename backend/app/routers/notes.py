from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.NoteResponse])
def read_notes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    notes = db.query(models.Note).offset(skip).limit(limit).all()
    for n in notes:
        n.tags = n.tags.split(',') if n.tags else []
    return notes

@router.post("/", response_model=schemas.NoteResponse)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    db_note = models.Note(
        id=note.id,
        title=note.title,
        content=note.content,
        folder=note.folder,
        tags=",".join(note.tags),
        is_pinned=note.is_pinned,
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    
    db_note.tags = note.tags
    return db_note

@router.put("/{note_id}", response_model=schemas.NoteResponse)
def update_note(note_id: str, note_update: schemas.NoteBase, db: Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
        
    for key, value in note_update.model_dump().items():
        if key == "tags":
            setattr(db_note, key, ",".join(value))
        else:
            setattr(db_note, key, value)
            
    db.commit()
    db.refresh(db_note)
    db_note.tags = note_update.tags
    return db_note

@router.delete("/{note_id}")
def delete_note(note_id: str, db: Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db.delete(db_note)
    db.commit()
    return {"ok": True}
