from flask import Blueprint,render_template,jsonify,request,redirect
from flask_jwt_extended import jwt_required, get_jwt_identity
product=Blueprint("product",__name__)

@product.route("/addProduct",methods=["GET"])
@jwt_required()
def addProduct():
    user=get_jwt_identity()
    if(user["role"]=="buyer"):
        return render_template("products/add.html")
    
    else: return redirect("/")