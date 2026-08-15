from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserCreate
from app.services.fish import gerar_dados_peixe

router = APIRouter(prefix="/usuario", tags=["Usuários"])

@router.post("/criar", status_code=status.HTTP_201_CREATED)
def criar_usuario(
    dados: UserCreate,
    db: Session = Depends(get_db),
):
    MAX_TENTATIVAS = 5

    for tentativa in range(MAX_TENTATIVAS):
        dados_peixe = gerar_dados_peixe(db)

        usuario = User(
            user_name=dados.user_name,
            nome=dados.nome,
            foto=str(dados.foto) if dados.foto else None,
            **dados_peixe,
        )

        db.add(usuario)

        try:
            db.commit()
            db.refresh(usuario)
            return usuario
        except IntegrityError as erro:
            db.rollback()
            mensagem_erro = str(erro.orig)

            if "users_username_key" in mensagem_erro:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Este user_name já está em uso.",
                )

            if "uq_users_peixe_posicao" in mensagem_erro:
                if tentativa == MAX_TENTATIVAS - 1:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="Não foi possível gerar uma posição válida após múltiplas tentativas.",
                    )
                continue

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Violação de integridade nos dados.",
            )

@router.get("/", response_model=List[UserResponse], status_code=status.HTTP_200_OK)
def listar_usuarios(db: Session = Depends(get_db)):
    usuarios = db.scalars(select(User).order_by(User.id.asc())).all()
    return usuarios