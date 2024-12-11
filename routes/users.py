from flask import Blueprint,render_template,request,jsonify,redirect
from flask_jwt_extended import create_access_token,create_refresh_token, jwt_required,set_access_cookies,set_refresh_cookies,get_jwt_identity,get_jwt,unset_jwt_cookies
from flask_mail import Message
from models.users import User
from models.login_history import Login_History
from schemas.users import UserRegisterSchema,UserLogInSchema
from tasks.login_register import log_history_task
from config import db,mail

user=Blueprint("user",__name__)

@user.route("/Register",methods=["GET"])
def register_GET():
    return render_template("users/register.html")

with open("templates/index.html", "r", encoding="utf-8") as f:
    html_content = f.read()

@user.route("/Register",methods=["POST"])
def register_POST():
    try:
        data=request.json
        user_data=UserRegisterSchema(**data)
        check_user = User.query.filter_by(email=user_data.email).first()
        # if check_user is not None:
        #     return jsonify({"message":"El Correo ya esta en uso","status":"error"})
        print(html_content)
        msg=Message("victoor",sender="edmundo2004.ea@gmail.com",recipients=[user_data.email],html=html_content)
        msg.body="victorr victoor"
        mail.send(message=msg)
        new_user = User(**user_data.model_dump())
        new_user.save()
        return jsonify({"message":"Usuario Registrado correctamente, Redirigiendo al Login","status":"success"})
    except Exception as e:
        print(e)
        return jsonify({"message":f"Uno o mas campos estan vacios {e}","status":"error"})
        
        
@user.route("/Login",methods=['GET'])
@jwt_required(optional=True)
def login_GET():
    user=get_jwt_identity()
    if user:
        return redirect("/")
    else:
        return render_template("users/Login.html")

@user.route("/Login", methods=['POST'])
def login_POST():
    data = request.json
    user_data=UserLogInSchema(**data)
    
    check_user = User.query.filter_by(email=user_data.email).first()
    
    if check_user and (check_user.check_password_hash(user_data.password)):
        
        log_history_task(check_user.user_id)
        access_token = create_access_token(identity=check_user.serialize())
        refresh_token = create_refresh_token(identity=check_user.serialize())
        response = jsonify({
            "message": "Iniciaste sesión con éxito",
            "status": "success",
            "url_for":"/"
        })
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        
        
        return response

    return jsonify({"message": "Credenciales incorrectas", "status": "error"})


@user.route("/test",methods=['GET'])
@jwt_required()
def testing():
    current_user = get_jwt_identity()

    if current_user["role"]=="Aminstrator":
        return jsonify({"message":"Iniciaste sesion como administrador","status":"error"}),402
    return jsonify({"message": "Acceso concedido, redirigiendo a /Register", "status": "success", "redirect_url": "/Register"})


@user.route("/refresh", methods=["GET"])
@jwt_required(refresh=True) 
def refresh():
    current_user = get_jwt_identity() 
    new_access_token = create_access_token(identity=current_user)
    response = jsonify({"msg": "Access token refrescado"})
    set_access_cookies(response, new_access_token)
    return response


@user.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    try:
        response = jsonify({"message": "Logout exitoso","status":"success"})
        unset_jwt_cookies(response)
        
        return response
    except Exception as e:
        return jsonify({"message": f"Error al cerrar sesion {str(e)}", "status": "error"})
    
    
    
def Log_history(user_id):
    new_log = Login_History(user_id=user_id)
    new_log.save()
    return True

@user.route("/whoAmI", methods=["GET"])
@jwt_required() 
def who_am_i():
    current_user = get_jwt_identity() 
    response = jsonify({"you are":current_user })
    return response