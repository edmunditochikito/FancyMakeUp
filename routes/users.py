from flask import Blueprint,render_template,request,jsonify
from flask_jwt_extended import create_access_token,create_refresh_token, jwt_required,set_access_cookies,set_refresh_cookies,get_jwt_identity,get_jwt,unset_jwt_cookies
from models.users import User
from models.login_history import Login_History
from schemas.users import UserRegisterSchema,UserLogInSchema
from config import db

user=Blueprint("user",__name__)

@user.route("/Register",methods=["GET"])
def register_GET():
    return render_template("users/register.html")

@user.route("/Register",methods=["POST"])
def register_POST():
    try:
        data=request.json
        user_data=UserRegisterSchema(**data)
        check_user = User.query.filter_by(email=user_data.email).first()
        if check_user is not None:
            return jsonify({"message":"El Correo ya esta en uso","status":"error"})
        
        print(db.session.query(User))
        new_user = User(**user_data.model_dump())
        new_user.save()
        return jsonify({"message":"Usuario Registrado correctamente, Redirigiendo al Login","status":"success"})
    except Exception as e:
        return jsonify({"message":f"El campo {str(e)} esta vacio","status":"error"})
        
        
@user.route("/Login",methods=['GET'])
@jwt_required(optional=True)
def login_GET():
    user=get_jwt_identity()
    if user:
        if user["role"]=="Buyer":
            return jsonify({"message":"Ya has iniciado sesión como comprador","status":"success"}) 
        else:
            return jsonify({"message":"Ya has iniciado sesión como administrador","status":"success"}) 
            
    else:
        return render_template("users/Login.html")

@user.route("/Login", methods=['POST'])
def login_POST():
    data = request.json
    user_data=UserLogInSchema(**data)
    
    check_user = User.query.filter_by(email=user_data.email).first()
    
    if check_user and (check_user.check_password_hash(user_data.password)):
        
        Log_history(check_user.user_id)
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