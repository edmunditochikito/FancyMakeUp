from config import db
from models.baseModel import BaseModel 

class Categories(BaseModel):
    __tablename__="categories"
    category_id = db.Column(db.Integer(),primary_key=True,autoincrement=True,nullable=False)
    category_name = db.Column(db.String(100),nullable=False)
    description = db.Column(db.Text,nullable=False)
    
    def __init__(self,category_name,description):
        self.category_name=category_name
        self.description=description
        
    def serialize(self):
        return{
            "category_id":self.category_id,
            "category_name":self.category_name,
            "description":self.description
        }
