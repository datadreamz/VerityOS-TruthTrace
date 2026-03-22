from pydantic import BaseModel
from typing import Optional


class TextRequest(BaseModel):
    text: str


class CombinedResponse(BaseModel):
    text: dict
    image: dict
    graph_score: float