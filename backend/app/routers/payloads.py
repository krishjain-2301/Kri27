from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.PayloadResponse])
def read_payloads(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    payloads = db.query(models.Payload).offset(skip).limit(limit).all()
    for p in payloads:
        p.tags = p.tags.split(',') if p.tags else []
    return payloads

@router.post("/", response_model=schemas.PayloadResponse)
def create_payload(payload: schemas.PayloadCreate, db: Session = Depends(get_db)):
    db_payload = models.Payload(
        id=payload.id,
        name=payload.name,
        category=payload.category,
        content=payload.content,
        explanation=payload.explanation,
        when_to_use=payload.when_to_use,
        risks=payload.risks,
        references=payload.references,
        tags=",".join(payload.tags),
    )
    db.add(db_payload)
    db.commit()
    db.refresh(db_payload)
    
    db_payload.tags = payload.tags
    return db_payload

@router.delete("/{payload_id}")
def delete_payload(payload_id: str, db: Session = Depends(get_db)):
    db_payload = db.query(models.Payload).filter(models.Payload.id == payload_id).first()
    if not db_payload:
        raise HTTPException(status_code=404, detail="Payload not found")
    
    db.delete(db_payload)
    db.commit()
    return {"ok": True}
