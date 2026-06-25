from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class ChallengeBase(BaseModel):
    name: str
    difficulty: str
    category: str
    os: str
    platform: str
    date_completed: datetime
    time_spent_minutes: int
    skills: List[str]
    tools: List[str]
    commands: List[str]
    tags: List[str]
    enumeration: Optional[str] = None
    notes: Optional[str] = None
    mistakes_made: Optional[str] = None
    lessons_learned: Optional[str] = None
    alternative_approaches: Optional[str] = None
    is_favorite: bool = False
    external_url: Optional[str] = None
    review_status: str = "Not Started"

class ChallengeCreate(ChallengeBase):
    id: str

class ChallengeResponse(ChallengeBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class LearningBase(BaseModel):
    title: str
    category: str
    difficulty: str
    summary: str
    detailed_notes: Optional[str] = None
    concept_explanation: Optional[str] = None
    examples: Optional[str] = None
    real_world_applications: Optional[str] = None
    commands: List[str]
    tags: List[str]
    mitre_attack_techniques: List[str] = []
    owasp_category: Optional[str] = None
    confidence_level: int = 1
    needs_revision: bool = False

class LearningCreate(LearningBase):
    id: str

class LearningResponse(LearningBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class NoteBase(BaseModel):
    title: str
    content: str
    folder: str = "General"
    tags: List[str]
    is_pinned: bool = False

class NoteCreate(NoteBase):
    id: str

class NoteResponse(NoteBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class CommandBase(BaseModel):
    name: str
    description: str
    examples: Optional[str] = None
    options: Optional[str] = None
    tags: List[str]
    frequency_used: int = 0

class CommandCreate(CommandBase):
    id: str

class CommandResponse(CommandBase):
    id: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class PayloadBase(BaseModel):
    name: str
    category: str
    content: str
    explanation: Optional[str] = None
    when_to_use: Optional[str] = None
    risks: Optional[str] = None
    references: Optional[str] = None
    tags: List[str]

class PayloadCreate(PayloadBase):
    id: str

class PayloadResponse(PayloadBase):
    id: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
