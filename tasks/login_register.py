from config import db,celery
from models.login_history import Login_History


@celery.task
def log_history_task(user_id):
    new_log = Login_History(user_id=user_id)
    db.session.add(new_log)
    db.session.commit()
