from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_name: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
    )
    nome: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    foto: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )
    cadastrado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    peixe_lado: Mapped[str] = mapped_column(String(10), nullable=False)
    peixe_posicao_x: Mapped[int] = mapped_column(nullable=False)
    peixe_profundidade: Mapped[int] = mapped_column(nullable=False)
    peixe_tamanho: Mapped[int] = mapped_column(nullable=False)
    peixe_espelhado: Mapped[bool] = mapped_column(nullable=False)
    peixe_especie: Mapped[int] = mapped_column(nullable=False)