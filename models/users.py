from config import db
from datetime import datetime,timezone
#from uuid import uuid4
from werkzeug.security import generate_password_hash,check_password_hash

class User(db.Model):
    __tablename__ = 'Users'
    
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    registration_date = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    role = db.Column(db.Enum('administrator', 'buyer', name='role_enum'), default='buyer', nullable=False)

    def __init__(self, name, email, password, phone=None, role='Buyer'):
        self.name = name
        self.email = email
        self.password = generate_password_hash(password)
        self.phone = phone
        self.role = role

    def serialize(self):
        return {
            'user_id': self.user_id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'registration_date': self.registration_date.strftime("%Y-%m-%d %H:%M:%S"),
            'role': self.role
        }
        
    def set_password(self,password):
        self.password=generate_password_hash(password=password)
    
    def check_password_hash(self,password):
        return check_password_hash(self.password,password)
        
    def save(self):
        try:
            db.session.add(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e

    def delete(self):
        try:
            db.session.delete(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e
    
    