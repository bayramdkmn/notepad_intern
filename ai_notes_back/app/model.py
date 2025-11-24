from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey,Table,LargeBinary,UniqueConstraint
from datetime import datetime,timezone
from sqlalchemy import Enum as SqlEnum

from sqlalchemy.orm import relationship
from .database import Base
from .schemes import PriorityEnum

note_tags = Table(
    "note_tags",
    Base.metadata,
    Column("note_id", Integer, ForeignKey("notes.id",ondelete="CASCADE"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id",ondelete="CASCADE"), primary_key=True)
)

class Notes(Base):
    __tablename__ = 'notes'

    id = Column(Integer,primary_key=True,autoincrement=True,index=True)
    user_id = Column(Integer,ForeignKey("users.id"),nullable=False)
    title = Column(String,nullable=False)
    content = Column(String,nullable=False)
    embedding = Column(LargeBinary)
    created_at = Column(DateTime(timezone=True),default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True),onupdate=lambda: datetime.now(timezone.utc),default=lambda: datetime.now(timezone.utc))
    is_active = Column(Boolean,default=True)
    favorite = Column(Boolean,default=False)
    deleted_at = Column(DateTime(timezone=True),nullable=True)
    is_archived = Column(Boolean, default=False)
    is_pinned = Column(Boolean,default=False)
    is_feature_note = Column(Boolean,default=False)
    feature_date = Column(DateTime(timezone=True),nullable=True)
    priority = Column(SqlEnum(PriorityEnum), nullable=False, default=PriorityEnum.LOW)
    tags = relationship("Tag", secondary="note_tags", back_populates="notes")
    versions = relationship("NoteVersions", back_populates="note", cascade="all, delete-orphan")


class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer,primary_key=True,index=True,autoincrement=True)
    name = Column(String,nullable=False)
    surname = Column(String,nullable=False)
    username = Column(String,unique=True,nullable=False)
    email = Column(String,unique=True,nullable=False)
    password_hash = Column(String,nullable=False)
    role = Column(String)
    phone_number = Column(String)
    created_at = Column(DateTime(timezone=True),default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(timezone.utc),default=lambda: datetime.now(timezone.utc))
    notes = relationship("Notes", backref="user")

class Tag(Base):
    __tablename__ = 'tags'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer,ForeignKey('users.id',ondelete="CASCADE"),nullable=True)
    name = Column(String, nullable=False)  
    is_global = Column(Boolean,default=False)
    notes = relationship("Notes", secondary="note_tags", back_populates="tags")
    user = relationship("Users", backref="tags")
    created_at = Column(DateTime(timezone=True),default=lambda:datetime.now(timezone.utc),nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(timezone.utc),default=lambda: datetime.now(timezone.utc))
    __table_args__ = (
        UniqueConstraint("user_id", "name", name="uq_user_tag_name"),
    )

class TokenBlacklist(Base):
    __tablename__ = 'token_blacklist'

    id = Column(Integer,autoincrement=True,index=True,primary_key=True)
    token = Column(String,unique=True,index=True)
    jti = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True),default=lambda :datetime.now(timezone.utc))

class Token(Base):
    __tablename__ = "tokens"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    token = Column(String, nullable=False, unique=True)
    token_type = Column(String,nullable=False)
    created_at = Column(DateTime(timezone=True),default=lambda :datetime.now(timezone.utc))
    expires_at = Column(DateTime(timezone=True))
    jti = Column(String, unique=True, index=True)

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String, unique=True, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True),default=lambda :datetime.now(timezone.utc))
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used = Column(Boolean, default=False, nullable=False)

class NoteVersions(Base):
    __tablename__ = "note_versions"
    id = Column(Integer,autoincrement=True,index=True,primary_key=True)
    note_id = Column(Integer,ForeignKey("notes.id",ondelete="CASCADE"),nullable=False)
    version = Column(Integer,index=True,nullable=False)
    title = Column(String,nullable=False)
    content = Column(String,nullable=False)
    updated_by = Column(Integer,ForeignKey("users.id"),nullable=True)
    created_at = Column(DateTime(timezone=True),default=lambda:datetime.now(timezone.utc))
    note = relationship("Notes", back_populates="versions")
    __table_args__ = (
        UniqueConstraint('note_id', 'version', name='uix_note_version'),
    )