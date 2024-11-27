from config import db 
from models.baseModel import BaseModel
class Products(BaseModel):
    __tablename__ = "products"
    product_id = db.Column(db.Integer(),primary_key=True,autoincrement=True,nullable=False)
    product_name = db.Column(db.String(100),nullable=False)
    description = db.Column(db.Text,nullable=False)
    price = db.Column(db.Numeric(10,2),nullable=False)
    stock = db.Column(db.Integer(),nullable=False)
    category_id = db.Column(db.Integer(),db.ForeignKey('categories.category_id'),nullable=False)
    image_url = db.Column(db.String(255),nullable=False)
    status = db.Column(db.Enum('active','inactive',name="status_enum"),default="active",nullable=False)
    
    def __init__(self,product_name,description,price,stock,category_id,image_url,status="active"):
        self.product_name=product_name
        self.description=description
        self.price=price
        self.stock=stock
        self.category_id=category_id
        self.image_url=image_url
        self.status=status
    

    
    def serialize(self):
        return{
            "product_id":self.product_id,
            "product_name":self.product_name,
            "description":self.description,
            "price":self.price,
            "stock":self.stock,
            "category_id":self.category_id,
            "image_url":self.image_url,
            "status":self.status
        }

