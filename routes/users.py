from flask import Blueprint,render_template,request,jsonify,redirect,render_template_string,current_app
from flask_jwt_extended import create_access_token,create_refresh_token, jwt_required
from models.users import User
from config import db


user=Blueprint("user",__name__)

@user.route("/Register",methods=["GET"])
def register_GET():
    return render_template("users/register.html")

@user.route("/Register",methods=["POST"])
def register_POST():
    try:
        data=request.json
        username = data["username"]
        phone = data["phone"]
        email = data["email"]
        password = data["password"]
        
        check_user = User.query.filter_by(email=email).first()
        
        if check_user is not None:
            return jsonify({"message":"El Correo ya esta en uso","status":"error"})
        
        new_user = User(password=password,email=email,name=username,phone=phone)
        new_user.save()
        return jsonify({"message":"Usuario Registrado correctamente, Redirigiendo al Login","status":"success"})
    except Exception as e:
        return jsonify({"message":f"El campo {str(e)} esta vacio","status":"error"})
        
        
@user.route("/Login",methods=['GET'])
def login_GET():
    return render_template("users/Login.html")

@user.route("/Login",methods=['POST'])
def login_POST():
    
    data=request.json
    check_user = User.query.filter_by(email=data["email"]).first()
    
    if check_user and (check_user.check_password_hash(data["password"])):
        access_token=create_access_token(identity=check_user.email)
        refresh_token=create_refresh_token(identity=check_user.email)
        print(current_app.config['JWT_SECRET_KEY'])
        return jsonify({
            "message":"Iniciaste sesion con exito",
            "status":"success",
            "tokens":{
                "access":access_token,
                "refresh":refresh_token,
            }
        })
    return jsonify({"message":"El usuario no existe","status":"error"})


@user.route("/test",methods=['GET'])
@jwt_required()
def testing():
    return render_template_string("<h1>Probando auth<h1>")