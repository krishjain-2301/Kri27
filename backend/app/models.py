from sqlalchemy import Column, String, Integer, Text, Boolean, DateTime
from sqlalchemy.sql import func
from .database import Base

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    difficulty = Column(String)
    category = Column(String)
    os = Column(String)
    platform = Column(String)
    date_completed = Column(DateTime)
    time_spent_minutes = Column(Integer)
    skills = Column(String) # Stored as comma-separated
    tools = Column(String) # Stored as comma-separated
    commands = Column(String) # JSON or comma-separated
    tags = Column(String) # Stored as comma-separated
    enumeration = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    mistakes_made = Column(Text, nullable=True)
    lessons_learned = Column(Text, nullable=True)
    alternative_approaches = Column(Text, nullable=True)
    is_favorite = Column(Boolean, default=False)
    external_url = Column(String, nullable=True)
    review_status = Column(String, default="Not Started")
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class LearningEntry(Base):
    __tablename__ = "learning_entries"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String)
    difficulty = Column(String)
    summary = Column(Text)
    detailed_notes = Column(Text, nullable=True)
    concept_explanation = Column(Text, nullable=True)
    examples = Column(Text, nullable=True)
    real_world_applications = Column(Text, nullable=True)
    commands = Column(String) # Stored as comma-separated
    tags = Column(String) # Stored as comma-separated
    mitre_attack_techniques = Column(String, nullable=True)
    owasp_category = Column(String, nullable=True)
    confidence_level = Column(Integer, default=1)
    needs_revision = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class Note(Base):
    __tablename__ = "notes"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    folder = Column(String, default="General")
    tags = Column(String)
    is_pinned = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class Command(Base):
    __tablename__ = "commands"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    examples = Column(Text, nullable=True)
    options = Column(String, nullable=True)
    tags = Column(String)
    frequency_used = Column(Integer, default=0)
    created_at = Column(DateTime, default=func.now())

class Payload(Base):
    __tablename__ = "payloads"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    content = Column(Text)
    explanation = Column(Text, nullable=True)
    when_to_use = Column(Text, nullable=True)
    risks = Column(Text, nullable=True)
    references = Column(Text, nullable=True)
    tags = Column(String)
    created_at = Column(DateTime, default=func.now())
