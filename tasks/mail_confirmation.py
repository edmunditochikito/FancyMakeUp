from config import mail
from flask_mail import Message
from app import celery,app
import secrets

@celery.task
def mail_confirmation(recipient):
    try:
        code = secrets.token_hex(3)
        with app.app_context():
            msg = Message("Email Probando", sender="edmundo2004.ea@gmail.com", recipients=[recipient])
            msg.body = f"Codigo de verificacion: {code}"
            mail.send(msg)
    except Exception as e:
        print(f"Error enviando correo: {e}")