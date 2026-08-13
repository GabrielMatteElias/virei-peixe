import random
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserCreate

router = APIRouter(prefix="/usuario", tags=["Usuários"])

def calcular_posicao_x_valida(ultimo_x: int | None) -> int:
    LIMITE_MIN = 0
    LIMITE_MAX = 40
    DISTANCIA_MINIMA = 5

    if ultimo_x is None:
        return random.randint(LIMITE_MIN, LIMITE_MAX)

    posicoes_validas = [
        x for x in range(LIMITE_MIN, LIMITE_MAX + 1)
        if abs(x - ultimo_x) >= DISTANCIA_MINIMA
    ]

    return random.choice(posicoes_validas)

def gerar_dados_peixe(db: Session) -> dict:
    ultimo_usuario = db.scalar(select(User).order_by(User.id.desc()))

    ultima_profundidade = ultimo_usuario.peixe_profundidade if ultimo_usuario else 0
    ultimo_x = ultimo_usuario.peixe_posicao_x if ultimo_usuario else None

    nova_profundidade = ultima_profundidade + random.randint(70, 120)
    novo_x = calcular_posicao_x_valida(ultimo_x)

    return {
        "peixe_lado": random.choice(["direita", "esquerda"]),
        "peixe_posicao_x": novo_x,
        "peixe_profundidade": nova_profundidade,
        "peixe_tamanho": random.randint(80, 115),
        "peixe_espelhado": random.choice([True, False]),
    }


@router.post("/criar", status_code=status.HTTP_201_CREATED)
def criar_usuario(
    dados: UserCreate,
    db: Session = Depends(get_db),
):
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
    except IntegrityError as erro:
        db.rollback()
        mensagem_erro = str(erro.orig)

        if "users_username_key" in mensagem_erro:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Este user_name já está em uso.",
            )

        if "uq_users_peixe_posicao" in mensagem_erro:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Conflito de posição do peixe gerado. Tente novamente.",
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Violação de integridade nos dados.",
        )

    return usuario


@router.get("/", response_model=List[UserResponse], status_code=status.HTTP_200_OK)
def listar_usuarios(db: Session = Depends(get_db)):
    usuarios = db.scalars(select(User).order_by(User.id.asc())).all()
    return usuarios