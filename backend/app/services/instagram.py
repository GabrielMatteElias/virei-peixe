import re
from typing import Dict, Any
import httpx
from bs4 import BeautifulSoup

class InstagramService:
    def __init__(self):
        self.headers = {
            "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        }

    async def fetch_profile_data(self, username: str) -> Dict[str, Any]:
        url = f"https://www.instagram.com/{username}/"
        try:
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                response = await client.get(url, headers=self.headers)
                
            if response.status_code != 200:
                return {
                    "username": username,
                    "full_name": None,
                    "profile_pic": None,
                    "error": f"HTTP {response.status_code}"
                }

            soup = BeautifulSoup(response.text, "html.parser")
            
            og_title_tag = soup.find("meta", property="og:title") or soup.find("meta", attrs={"name": "title"})
            og_image_tag = soup.find("meta", property="og:image")
            
            og_title = og_title_tag["content"] if og_title_tag and og_title_tag.has_attr("content") else ""
            og_image = og_image_tag["content"] if og_image_tag and og_image_tag.has_attr("content") else ""

            full_name = None
            if og_title:
                match = re.match(r"^([^(@•]+)", og_title)
                if match:
                    full_name = match.group(1).strip()

            return {
                "username": username,
                "full_name": full_name or None,
                "profile_pic": og_image or None,
                "error": None
            }
        except Exception as e:
            return {
                "username": username,
                "full_name": None,
                "profile_pic": None,
                "error": str(e)
            }