from typing import Annotated

from fastapi import APIRouter,Depends,HTTPException,Query,status,Response
from ..api.embedding import get_embedding

from ..model import Notes,Tag
from ..database import get_db, SessionLocal
from sqlalchemy.orm import Session

from ..schemes import NoteRequest,UpdateNotesRequest,IdsSchema

from .users import get_current_user
from datetime import datetime, timezone ,timedelta

import numpy as np


router = APIRouter(
    prefix="/notes",
    tags=["notes"]
)

user_dependency = Annotated[dict,Depends(get_current_user)]

@router.get("/notes/get-all-notes/")
async def get_all_notes(dependency:user_dependency,db:Session=Depends(get_db)):
    db_notes = db.query(Notes).filter(Notes.user_id.__eq__(dependency.get("id"))).all()
    if not db_notes:
        return {
            "notes" : []
        }
    notes_list = []
    for note in db_notes:
        notes_list.append({
            "id": note.id,
            "title": note.title,
            "content": note.content,
            "tags": [{"id": tag.id, "name": tag.name} for tag in note.tags],
            "created_at": note.created_at,
            "updated_at": note.updated_at,
            "is_active": note.is_active,
            "is_archived":note.is_archived,
            "is_pinned":note.is_pinned,
            "favorite":note.favorite,
            "is_feature_note":note.is_feature_note,
            "feature_date":note.feature_date,
            "priority":note.priority
        })

    return notes_list

@router.get("/notes/get-note-by-id/{note_id}")
async def get_note_by_id(note_id:int,dependency:user_dependency,db:Session=Depends(get_db)):
    db_note = db.query(Notes).filter(Notes.id.__eq__(note_id) and Notes.user_id.__eq__(dependency.get("id"))).first()
    if not db_note:
        raise HTTPException(404,detail="Note not found!")

    return{
        "id": db_note.id,
        "title": db_note.title,
        "content": db_note.content,
        "tags": [{"id": tag.id, "name": tag.name} for tag in db_note.tags],
        "created_at": db_note.created_at,
        "updated_at": db_note.updated_at,
        "is_active": db_note.is_active,
        "priority":db_note.priority
    }

@router.delete("/notes/delete/{note_id}")
async def delete_note(note_id:int,dependency:user_dependency,db:Session=Depends(get_db)):
    db_note = db.query(Notes).filter(Notes.id.__eq__(note_id) and Notes.user_id.__eq__(dependency.get("id"))).first()
    if not db_note:
        raise HTTPException(404,detail="Note not found!")

    db.delete(db_note)
    db.commit()
    return{
        "id": db_note.id,
        "title": db_note.title,
        "content": db_note.content,
        "tags": [{"id": tag.id, "name": tag.name} for tag in db_note.tags],
        "created_at": db_note.created_at,
        "updated_at": db_note.updated_at,
        "is_active": db_note.is_active
    }

@router.post("/notes/create-note/")
async def create_note(dependency: user_dependency, note_request: NoteRequest, db: Session = Depends(get_db)):
    if dependency is None:
        raise HTTPException(401, detail="Not Authenticated!")

    embedding_byte = get_embedding(note_request.content)

    note_tags = []
    for tag_name in note_request.tags:
        tag = db.query(Tag).filter(Tag.name.__eq__(tag_name), Tag.user_id.__eq__(dependency.get("id"))).first()
        if not tag:
            tag = Tag(name=tag_name, user_id=dependency.get("id"))
            db.add(tag)
            db.commit()
            db.refresh(tag)
        note_tags.append(tag)

    feature_date = note_request.feature_date if note_request.is_feature_note else None

    db_notes = Notes(
        title=note_request.title,
        content=note_request.content,
        tags=note_tags,
        embedding=embedding_byte,
        user_id=dependency.get("id"),
        is_feature_note=note_request.is_feature_note,
        priority = note_request.priority,
        feature_date=feature_date
    )

    db.add(db_notes)
    db.commit()
    db.refresh(db_notes)


    return {
            "id": db_notes.id,
            "title": db_notes.title,
            "content": db_notes.content,
            "tags": [{"id": tag.id, "name": tag.name} for tag in db_notes.tags],
            "created_at": db_notes.created_at,
            "updated_at": db_notes.updated_at,
            "is_active": db_notes.is_active,
            "is_archived":db_notes.is_archived,
            "is_pinned":db_notes.is_pinned,
            "favorite":db_notes.favorite,
            "is_feature_note":db_notes.is_feature_note,
            "feature_date":db_notes.feature_date,
            "priority":db_notes.priority
        }


@router.patch("/notes/update-note/{note_id}")
async def update_notes_with_id_by_creator(note_id:int,dependency:user_dependency,update_body:UpdateNotesRequest,db:Session=Depends(get_db)):
    db_note = db.query(Notes).filter(Notes.id.__eq__(note_id),Notes.user_id.__eq__(dependency.get("id"))).first()
    if not db_note:
        raise HTTPException(status_code=404,detail="Note not found")

    db_note.title = update_body.title
    db_note.content = update_body.content
    db_note.priority = update_body.priority
    if update_body.tags:
        existing_tags = db.query(Tag).filter(Tag.name.in_(update_body.tags)).all()
        existing_tag_names = {tag.name for tag in existing_tags}

        new_tags = [
            Tag(name=tag_name,user_id=dependency.get("id")) for tag_name in update_body.tags
            if tag_name not in existing_tag_names
        ]

        db.add_all(new_tags)
        db.commit()
        db.refresh(db_note)

        db_note.tags.extend(existing_tags + new_tags)

    db.add(db_note)
    db.commit()

    return {
        "id": db_note.id,
        "title": db_note.title,
        "content": db_note.content,
        "tags": [{"id": tag.id, "name": tag.name} for tag in db_note.tags],
        "created_at": db_note.created_at,
        "updated_at": db_note.updated_at,
        "is_active": db_note.is_active
    }


@router.get("/notes/search/")
async def semantic_search(
        query: str = Query(..., description="The note content you want to search"),
        dependency=Depends(get_current_user),
        db: Session = Depends(get_db)
):
    if dependency is None:
        raise HTTPException(401, detail="Not Authenticated!")

    query_embedding = get_embedding(query)
    query_array = np.frombuffer(query_embedding, dtype=np.float32)

    db_notes = db.query(Notes).filter(Notes.user_id.__eq__(dependency.get("id"))).all()
    if not db_notes:
        raise HTTPException(status_code=404, detail="No notes found!")

    results = []
    for note in db_notes:
        if note.embedding:
            note_array = np.frombuffer(note.embedding, dtype=np.float32)
            # Cosine similarity
            sim = float(np.dot(query_array, note_array) / (np.linalg.norm(query_array) * np.linalg.norm(note_array)))
            results.append((sim, note))

    results.sort(reverse=True, key=lambda x: x[0])

    response = []
    for sim, note in results:
        response.append({
            "id": note.id,
            "title": note.title,
            "content": note.content,
            "tags": [{"id": tag.id, "name": tag.name} for tag in note.tags],
            "created_at": note.created_at,
            "updated_at": note.updated_at,
            "is_active": note.is_active,
            "similarity": sim
        })

    return response

@router.put("/notes/status-active-passive/{note_id}")
async def note_status_change_to_favorite_wih_is_active_field(is_active:bool,note_id:int,dependency:user_dependency,db:Session=Depends(get_db)):
    db_note = db.query(Notes).filter(Notes.id.__eq__(note_id),Notes.user_id.__eq__(dependency.get("id"))).first()
    if not db_note:
        raise HTTPException(status_code=404,detail="Note not found")
    db_note.is_active = is_active
    db.add(db_note)
    db.commit()
    return {
        "id": db_note.id,
        "title": db_note.title,
        "content": db_note.content,
        "tags": [{"id": tag.id, "name": tag.name} for tag in db_note.tags],
        "created_at": db_note.created_at,
        "updated_at": db_note.updated_at,
        "is_active": db_note.is_active
    }

@router.put("/notes/add-to-favorite/{note_id}")
async def note_adding_into_favorite_by_user(favorite:bool,dependency:user_dependency,note_id:int,db:Session=Depends(get_db)):
    db_note = db.query(Notes).filter(Notes.id.__eq__(note_id),Notes.user_id.__eq__(dependency.get("id"))).first()
    if not db_note:
        raise HTTPException(404,detail="Note not found!")
    db_note.favorite = favorite
    db.add(db_note)
    db.commit()
    return {
        "id": db_note.id,
        "title": db_note.title,
        "content": db_note.content,
        "tags": [{"id": tag.id, "name": tag.name} for tag in db_note.tags],
        "created_at": db_note.created_at,
        "updated_at": db_note.updated_at,
        "is_active": db_note.is_active,
        "favorite":db_note.favorite
    }

@router.delete("/notes/delete-selected-notes")
async def delete_selected_notes_by_notes_id_dependency(dependency: user_dependency,ids: IdsSchema,db: Session = Depends(get_db)):
    if not ids:
        raise HTTPException(status_code=404,detail="Ids not found here.")
    for note_id in ids:
        note = db.query(Notes).filter(Notes.id.__eq__(note_id), Notes.user_id.__eq__(dependency.get("id"))).delete(synchronize_session=False)
        if note:
            db.delete(note)
    db.commit()
    return {
        "message":"Selected notes deleted by user."
    }


@router.delete("/notes/soft-delete/{note_id}")
def soft_delete_note(note_id: int,dependency:user_dependency, db: Session = Depends(get_db)):
    note = db.query(Notes).filter(Notes.id.__eq__(note_id),Notes.user_id.__eq__(dependency.get("id"))).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    note.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return {
        "message":"Soft delete started."
    }

def delete_old_soft_deleted_notes():
    db: Session = SessionLocal()
    try:
        ten_days_ago = datetime.now(timezone.utc) - timedelta(days=10)
        old_notes = db.query(Notes).filter(
            Notes.deleted_at.__ne__(None),
            Notes.deleted_at <= ten_days_ago
        ).all()
        for note in old_notes:
            db.delete(note)
        db.commit()
        print(f"{len(old_notes)} old soft deleted notes removed.")
    finally:
        db.close()

@router.put("/notes/soft-delete-multiple", status_code=status.HTTP_200_OK)
def soft_delete_multiple_notes(dependency: user_dependency, payload: IdsSchema, db: Session = Depends(get_db)):
    if not payload.ids:
        raise HTTPException(status_code=404, detail="Ids not found.")

    notes = db.query(Notes).filter(
        Notes.id.in_(payload.ids),
        Notes.user_id.__eq__(dependency.get("id"))
    ).all()

    for note in notes:
        note.deleted_at = datetime.now(timezone.utc)
    db.commit()

    not_found = set(payload.ids) - set([n.id for n in notes])
    return {
        "soft_deleted_ids": [n.id for n in notes],
        "not_found": list(not_found),
        "message": f"{len(notes)} note(s) soft deleted, {len(not_found)} not found."
    }

@router.get("/notes/get-favorites")
async def get_favorite_notes_usr_(dependency:user_dependency,db:Session=Depends(get_db)):
    favorite_notes = db.query(Notes).filter(Notes.favorite.__eq__(True),Notes.user_id.__eq__(dependency.get("id"))).all()
    if not favorite_notes:
        raise HTTPException(status_code=404,detail="There is no any favorite notes here.")
    return favorite_notes

@router.put("/notes/archive/{note_id}")
async def change_status_to_archived(note_id:int,dependency:user_dependency,db:Session=Depends(get_db)):
    db_note = db.query(Notes).filter(Notes.id.__eq__(note_id),Notes.user_id.__eq__(dependency.get("id"))).first()
    if not db_note:
        raise HTTPException(status_code=404,detail="Note not found into database.")
    db_note.is_archived = not db_note.is_archived
    db.add(db_note)
    db.commit()
    return {
        "id": db_note.id,
        "title": db_note.title,
        "content": db_note.content,
        "tags": [{"id": tag.id, "name": tag.name} for tag in db_note.tags],
        "created_at": db_note.created_at,
        "updated_at": db_note.updated_at,
        "is_active": db_note.is_active,
        "favorite":db_note.favorite,
        "is_archived" :db_note.is_archived
    }

@router.get("/notes/all-archived-notes")
async def get_all_archived_notes(dependency:user_dependency,db:Session=Depends(get_db)):
    archived_notes = db.query(Notes).filter(Notes.user_id.__eq__(dependency.get("id"))).all()
    if not archived_notes:
        raise HTTPException(status_code=404,detail="Archived notes not found!")
    return archived_notes

@router.delete("/notes/{note_id}/tags/{tag_id}")
async def remove_tag_into_note(note_id:int,tag_id:int,dependency:user_dependency,db:Session=Depends(get_db)):
    note = db.query(Notes).filter(Notes.id.__eq__(note_id),Notes.user_id.__eq__(dependency.get("id"))).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found or not authanticated!")
    tag_to_remove = next(
        (tag for tag in note.tags if tag.id == tag_id), None
    )
    if not tag_to_remove:
        raise HTTPException(
            status_code=404,
            detail="The tag is not into this note."
        )

    note.tags.remove(tag_to_remove)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.post("/notes/{note_id}/tags/{tag_id}", status_code=status.HTTP_201_CREATED)
async def add_tag_into_note(note_id: int, tag_id: int, dependency: user_dependency, db: Session = Depends(get_db)):
    note_model = (db.query(Notes).filter(Notes.id.__eq__(note_id), Notes.user_id.__eq__(dependency.get("id"))).first())
    if not note_model:
        raise HTTPException(status_code=404, detail="Not bulunamadı veya yetkiniz yok.")

    tag_model = db.query(Tag).filter(Tag.id.__eq__(tag_id)).first()
    if not tag_model:
        raise HTTPException(status_code=404, detail="Etiket bulunamadı.")

    if tag_model in note_model.tags:
        raise HTTPException(
            status_code=409,
            detail="Bu etiket zaten nota atanmış."
        )

    note_model.tags.append(tag_model)
    db.commit()

    return {"message": f"'{tag_model.name}' etiketi nota başarıyla eklendi."}

@router.patch("/notes/toggle-pin/{note_id}")
async def add_pin_to_selected_note(note_id:int,dependency:user_dependency,db:Session=Depends(get_db)):
    note = db.query(Notes).filter(Notes.id.__eq__(note_id),Notes.user_id.__eq__(dependency.get("id"))).first()
    if not note:
        raise HTTPException(status_code=404,detail="Note not found!")
    note.is_pinned = not note.is_pinned
    db.add(note)
    db.commit()
    return {
        "title":note.title,
        "content":note.content,
        "created_at":note.created_at,
        "updated_at":note.updated_at,
        "favorite":note.favorite,
        "is_archived":note.is_archived,
        "is_pinned":note.is_pinned,
        "tags": [{"id": tag.id, "name": tag.name} for tag in note.tags]
    }

@router.get("/notes/get-pinned-notes")
async def get_pinned_notes_from_database(dependency:user_dependency,db:Session=Depends(get_db)):
    pinned_notes = db.query(Notes).filter(Notes.is_pinned.__eq__(True),Notes.user_id.__eq__(dependency.get("id"))).all()
    if not pinned_notes:
        raise HTTPException(status_code=404,detail="No pinned note here!")
    notes_list = []
    for pinned_note in pinned_notes:
        notes_list.append({
        "title":pinned_note.title,
        "content":pinned_note.content,
        "created_at":pinned_note.created_at,
        "updated_at":pinned_note.updated_at,
        "favorite":pinned_note.favorite,
        "is_archived":pinned_note.is_archived,
        "is_pinned":pinned_note.is_pinned,
        "tags": [{"id": tag.id, "name": tag.name} for tag in pinned_note.tags]
    })
    return notes_list

@router.get("/notes/stats")
async def get_not_stats_from_database(dependency:user_dependency,db:Session=Depends(get_db)):
    all_notes = db.query(Notes).filter(Notes.user_id.__eq__(dependency.get("id"))).all()
    pinned_notes = db.query(Notes).filter(Notes.is_pinned.__eq__(True),Notes.user_id.__eq__(dependency.get("id"))).all()
    archived_notes = db.query(Notes).filter(Notes.is_archived.__eq__(True),Notes.user_id.__eq__(dependency.get("id"))).all()
    active_notes = db.query(Notes).filter(Notes.is_active.__eq__(True),Notes.user_id.__eq__(dependency.get("id"))).all()
    if not all_notes:
        raise HTTPException(status_code=404,detail="Note not found")

    return {
        "Stats":"Note Stats",
        "all_notes":len(all_notes),
        "pinned_notes":len(pinned_notes),
        "archived_notes":len(archived_notes),
        "active_notes":len(active_notes),
        "email":dependency.get("email")
    }

@router.get("/notes/get-note-by-tag-name/{tag_name}")
async def get_note_by_tag_name_from_database(tag_name:str,dependency:user_dependency,db:Session=Depends(get_db)):
    note_by_tag_name = db.query(Notes).join(Notes.tags).filter(Tag.name.__eq__(tag_name),Notes.user_id.__eq__(dependency.get("id"))).all()
    if not note_by_tag_name:
        raise HTTPException(status_code=404,detail="Notes not found here.")
    note_list = []
    for note in note_by_tag_name:
        note_list.append({
        "title":note.title,
        "content":note.content,
        "created_at":note.created_at,
        "updated_at":note.updated_at,
        "favorite":note.favorite,
        "is_archived":note.is_archived,
        "is_pinned":note.is_pinned,
        "tags": [{"id": tag.id, "name": tag.name} for tag in note.tags]
    })
    return note_list

@router.get("/notes/get-all-feature-notes/")
async def get_all_feature_notes(dependency:user_dependency,db:Session=Depends(get_db)):
    feature_notes = db.query(Notes).filter(Notes.user_id.__eq__(dependency.get("id")),Notes.is_feature_note.__eq__(True)).all()
    if not feature_notes:
        return {
            "notes" : []
        }
    notes_list = []
    for note in feature_notes:
        notes_list.append({
            "id": note.id,
            "title": note.title,
            "content": note.content,
            "tags": [{"id": tag.id, "name": tag.name} for tag in note.tags],
            "created_at": note.created_at,
            "updated_at": note.updated_at,
            "is_active": note.is_active,
            "is_archived": note.is_archived,
            "is_pinned": note.is_pinned,
            "favorite": note.favorite
        })

    return notes_list


