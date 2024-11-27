from pydantic import BaseModel
from decimal import Decimal

class productAdditionSchema(BaseModel):
    product_name:str
    description:str
    price:Decimal
    stock: int
    category_id: int
    image_url: str
    status: str