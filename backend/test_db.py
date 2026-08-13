from sqlalchemy import select

from app.db.database import SessionLocal
from app.models.user import User


with SessionLocal() as db:
    users = db.scalars(
        select(User)
    ).all()

    print(users)