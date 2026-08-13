from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl

class UserResponse(BaseModel):
    id: int
    user_name: str
    nome: str
    foto: HttpUrl | None = None
    cadastrado_em: datetime
    peixe_lado: str
    peixe_posicao_x: int
    peixe_profundidade: int
    peixe_tamanho: int
    peixe_espelhado: bool

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    user_name: str = Field(min_length=1, max_length=30)
    nome: str = Field(min_length=1, max_length=100)
    foto: HttpUrl | None = None