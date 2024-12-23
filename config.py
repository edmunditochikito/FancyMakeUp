import os
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_mail import Mail
from celery import Celery

mail = Mail()
db = SQLAlchemy()
jwt = JWTManager()
celery = Celery(__name__, broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:password@localhost/fancy_makeup_store'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(hours=30)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_ACCESS_COOKIE_PATH = '/'
    JWT_REFRESH_COOKIE_PATH = '/refresh'
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_CSRF_METHODS=['POST', 'PUT', 'PATCH', 'DELETE']
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 465
    MAIL_USERNAME = "edmundo2004.ea@gmail.com"
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
 
