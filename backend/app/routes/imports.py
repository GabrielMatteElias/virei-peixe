import json
from typing import List
from fastapi import APIRouter, BackgroundTasks, File, HTTPException, UploadFile, status
from pydantic import TypeAdapter
from app.db.database import SessionLocal
from app.schemas.imports import FollowerRawItem, ImportResponse
from app.services.importer import ImporterService

router = APIRouter(prefix="/imports", tags=["Imports"])

async def run_import_task(followers: List[FollowerRawItem]):
    db = SessionLocal()
    try:
        importer = ImporterService(db)
        await importer.process_followers(followers)
    finally:
        db.close()

@router.post("/followers", response_model=ImportResponse, status_code=status.HTTP_202_ACCEPTED)
async def import_followers(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    if not file.filename.endswith(".json"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O arquivo enviado deve ser do tipo .json"
        )

    try:
        content = await file.read()
        json_data = json.loads(content)
        
        adapter = TypeAdapter(List[FollowerRawItem])
        followers = adapter.validate_python(json_data)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Arquivo JSON inválido."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Estrutura do arquivo incompatível: {str(e)}"
        )

    if not followers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A lista de seguidores não pode estar vazia."
        )

    background_tasks.add_task(run_import_task, followers)

    return ImportResponse(
        mensagem="Importação iniciada em segundo plano.",
        total_recebidos=len(followers),
        status="em_processamento"
    )