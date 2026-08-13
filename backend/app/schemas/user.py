from pydantic import BaseModel, Field, HttpUrl


class UserCreate(BaseModel):
    user_name: str = Field(min_length=1, max_length=30)
    nome: str = Field(min_length=1, max_length=100)
    foto: HttpUrl | None = None