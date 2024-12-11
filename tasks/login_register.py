# tasks.py
from celery import Celery
from config import db
from models.login_history import Login_History

# Ajusta la URL de tu broker (Redis en este caso) según sea necesario
celery = Celery(__name__, broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')

@celery.task
def log_history_task(user_id):
    new_log = Login_History(user_id=user_id)
    db.session.add(new_log)
    db.session.commit()
