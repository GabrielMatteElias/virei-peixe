from typing import List, Optional
from pydantic import BaseModel, Field

class StringListData(BaseModel):
    href: Optional[str] = None
    value: str
    timestamp: Optional[int] = None

class FollowerRawItem(BaseModel):
    title: Optional[str] = ""
    media_list_data: Optional[List[dict]] = Field(default_factory=list)
    string_list_data: List[StringListData]

    @property
    def username(self) -> str:
        if self.string_list_data and len(self.string_list_data) > 0:
            return self.string_list_data[0].value
        return ""

class ImportRequest(BaseModel):
    followers: List[FollowerRawItem]

class ImportResponse(BaseModel):
    mensagem: str
    total_recebidos: int
    status: str