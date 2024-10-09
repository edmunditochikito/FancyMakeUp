import os
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db=SQLAlchemy()
jwt = JWTManager()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'mi_clave_secreta_por_defecto')
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:password@localhost/FancyMakeupStore'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'mi_clave_jwt_por_defecto')