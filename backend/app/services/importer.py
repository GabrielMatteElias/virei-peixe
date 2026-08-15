import asyncio
import random
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.schemas.imports import FollowerRawItem
from app.services.instagram import InstagramService
from app.services.fish import gerar_dados_peixe
from app.models.user import User

class ImporterService:
    def __init__(self, db: Session):
        self.db = db
        self.instagram_service = InstagramService()

    async def process_followers(
        self, 
        followers: List[FollowerRawItem],
        batch_size: int = 10,
        min_delay: float = 2.5,
        max_delay: float = 5.0
    ) -> Dict[str, Any]:
        usernames = list({item.username for item in followers if item.username})

        existing_users = set(
            u[0] for u in self.db.query(User.user_name).filter(User.user_name.in_(usernames)).all()
        )

        new_usernames = [u for u in usernames if u not in existing_users]
        processed_count = 0

        for index, username in enumerate(new_usernames):
            profile_data = await self.instagram_service.fetch_profile_data(username)

            if profile_data.get("full_name") or profile_data.get("profile_pic"):
                dados_peixe = gerar_dados_peixe(self.db)

                user_obj = User(
                    user_name=profile_data["username"],
                    nome=profile_data["full_name"] or "",
                    foto=profile_data["profile_pic"] or "",
                    **dados_peixe
                )
                self.db.add(user_obj)
                self.db.flush()
                processed_count += 1

            if (index + 1) % batch_size == 0:
                self.db.commit()

            delay = random.uniform(min_delay, max_delay)
            await asyncio.sleep(delay)

        self.db.commit()

        return {
            "total_recebidos": len(followers),
            "novos_processados": processed_count,
            "ja_existentes": len(existing_users)
        }