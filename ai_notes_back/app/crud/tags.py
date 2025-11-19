from typing import Annotated

from fastapi import APIRouter,Depends,HTTPException

from sqlalchemy.orm import Session
from.users import get_current_user

from app.api.ai_tags import generate_tags

from ..schemes import TagCreateRequest
from ..database import get_db
from ..model import Tag,Notes


router = APIRouter(
    prefix="/tags",
    tags=["tags"]
)

user_dependency = Annotated[dict,Depends(get_current_user)]

@router.post("/tag/create")
async def create_tag_for_notes_by_user(tag:TagCreateRequest,dependency:user_dependency,db:Session=Depends(get_db)):
    existing_tag = db.query(Tag).filter(Tag.name.__eq__(tag.name),Tag.user_id.__eq__(dependency.get("id"))).first()
    if existing_tag:
        raise HTTPException(status_code=400,detail="This tag already exists!")
    tag = Tag(
        name=tag.name,
        user_id=dependency.get("id")
    )
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return {
        "message" : "Tag addition create successfully!",
        "id" : tag.id,
        "name" : tag.name,
        "created_at":tag.created_at
    }

@router.delete("/tag/delete/{tag_id}")
async def delete_tag_by_user_request(tag_id: int, dependency: user_dependency, db: Session = Depends(get_db)):
    tag = db.query(Tag).filter(
        Tag.id.__eq__(tag_id),
        Tag.user_id.__eq__(dependency.get("id"))
    ).first()

    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found!")
    notes_with_tag = tag.notes[:]
    notes_to_delete = []

    for note in notes_with_tag:
        remaining_tags = [t for t in note.tags if t.id != tag.id]
        if not remaining_tags:
            notes_to_delete.append(note)

    for note in notes_with_tag:
        if tag in note.tags:
            note.tags.remove(tag)

    for note in notes_to_delete:
        db.delete(note)

    db.delete(tag)

    db.commit()

    return {
        "message": "Tag and related notes deleted successfully!",
        "deleted_tag": {
            "id": tag.id,
            "name": tag.name
        },
        "deleted_notes": [
            {"id": note.id, "title": note.title} for note in notes_to_delete
        ]
    }

@router.get("/tag/get-all-tags")
async def get_all_tags_by_user(dependency:user_dependency,db:Session=Depends(get_db)):
    db_tags = db.query(Tag).filter(Tag.user_id.__eq__(dependency.get("id"))).all()
    if not db_tags:
        return {
            "tags": []
        }
    return db_tags

@router.get("/tag/get-tag-by-id/{tag_id}")
async def get_tag_by_id(tag_id:int,dependency:user_dependency,db:Session=Depends(get_db)):
    db_tag = db.query(Tag).filter(Tag.id.__eq__(tag_id),Tag.user_id.__eq__(dependency.get("id"))).first()
    if not db_tag:
        raise HTTPException(status_code=404,detail="Tag not found into database.")
    return db_tag

@router.put("/tag/update-tag/{tag_id}")
async def update_tag_by_id(tag_id:int,request:TagCreateRequest,dependency:user_dependency,db:Session=Depends(get_db)):
    db_tag = db.query(Tag).filter(Tag.id.__eq__(tag_id),Tag.user_id.__eq__(dependency.get("id"))).first()
    if not db_tag:
        raise HTTPException(status_code=404,detail="Tag not found from database.")
    db_tag.name = request.name
    db.add(db_tag)
    db.commit()
    return {
        "message" : "Updated successfully!",
        "id" : db_tag.id,
        "name" : db_tag.name,
        "updated_at":db_tag.updated_at
    }

@router.post("/tag/add-global-tag")
async def add_global_tag_into_table(request:TagCreateRequest,db:Session=Depends(get_db)):
    tag = Tag(
        name=request.name,
        is_global = True
    )
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return {
        "name":tag.name,
        "is_global":tag.is_global,
        "created_at":tag.created_at
    }

@router.post("/tags/generate-ai-tag/{note_id}")
async def get_ai_tags(note_id:int,dependency:user_dependency,db:Session=Depends(get_db)):
    try:
        request = db.query(Notes).filter(Notes.id.__eq__(note_id),Tag.user_id.__eq__(dependency.get("id"))).first()
        if not request:
            raise HTTPException(status_code=404,detail="Note not found.")
        tags = [t.name for t in request.tags]

        generate_ai_tags = generate_tags(
            title=request.title,
            content=request.content,
            tags=tags
        )
        return generate_ai_tags
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))

@router.get("/tag/search")
async def search_tags(query: str,dependency:user_dependency,db: Session = Depends(get_db)):
    return db.query(Tag).filter(Tag.name.ilike(f"%{query}%"),Tag.user_id.__eq__(dependency.get("id"))).all()

