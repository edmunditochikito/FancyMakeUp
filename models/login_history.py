from config import db
from datetime import datetime, timezone
import pytz
class Login_History(db.Model):
    __tablename__ = 'login_history'
    login_id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # login_id
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=False)  # user_id (Foreign Key de la tabla Users)
    login_date = db.Column(db.DateTime, default=datetime.now(pytz.utc), nullable=False)  # login_date
    

    user = db.relationship('User', backref=db.backref('login_history', lazy=True))

    def __init__(self, user_id):
        self.user_id = user_id
        nicaragua_tz = pytz.timezone('America/Managua')
        self.login_date = datetime.now(nicaragua_tz)
    
    def serialize(self):
        nicaragua_tz = pytz.timezone('America/Managua')
        local_login_date = self.login_date.astimezone(nicaragua_tz)
        return {
            'login_id': self.login_id,
            'user_id': self.user_id,
            'login_date':local_login_date.strftime("%Y-%m-%d %H:%M:%S")
        }

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