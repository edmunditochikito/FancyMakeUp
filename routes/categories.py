from flask import jsonify,Blueprint,render_template,request
from flask_jwt_extended import jwt_required
from config import db
from models.categories import Categories
import smtplib

categories = Blueprint("categories",__name__)

@categories.route("/addCategory",methods=["GET"])
@jwt_required()
def addCategoryGET():
    return render_template("/category/add.html")

@categories.route("/manageCategory",methods=["GET"])
@jwt_required()
def manageCategory():
    return render_template("/category/manage.html")

@categories.route("/addCategory",methods=["POST"])
@jwt_required()
def addCategoryPOST():
    try:
        data=request.json
        existent=Categories.query.filter(Categories.category_name==data["category_name"]).first()
        if existent is not None:
            return jsonify({"message":"La categoria ya existe","status":"error"})
        
        new_category=Categories(**data)
        new_category.save()
    
        return jsonify({"message":"Categoria Agregada correctamente","status":"success"})
    except Exception as e:
        return jsonify({"message":"Error al agregar la categoria","status":"error"})

@categories.route("/getCategories")
@jwt_required()
def getCategories():
    all_categories=db.session.execute(
        db.select(
            Categories
        )
    ).scalars().all()
    all_categories=[ category.serialize() for category in all_categories ]
    return jsonify(all_categories)

@categories.route("/dtCategories",methods=["GET"])
@jwt_required()
def dtCategories():
    all_categories=db.session.execute(
        db.select(
            Categories
        )
    ).scalars().all()
    all_categories=[ category.serialize() for category in all_categories ]
    return jsonify({"data":all_categories})

@categories.route("/getCategory/<id>",methods=["POST"])
@jwt_required()
def getCategory(id):
    Categoria=Categories.query.get(id)
    print(Categoria.serialize())
    return jsonify(Categoria.serialize())

@categories.route("/updateCategory/<id>",methods=["POST"])
@jwt_required()
def updateCategory(id):
    try:
        
        Categoria=Categories.query.get(id)
        data=request.form.to_dict()
        if not Categoria:
            return jsonify({"message":"el Producto no existe","status":"error"})
        Categoria.category_name=data["category_name"]
        Categoria.description=data["description"]
        name=data["category_name"]
        Categoria.save()
        return jsonify({"title":"Categoria actualizada correctamente","status":"success","message":f"La categoria {name} ha sido actualizada con exito"})
    except Exception as e:
        return jsonify({"title":f"Ha ocurrido un error","status":"error","message":f"Error al actualizar la categoria {name}"})

@categories.route("/delteCategory/<id>",methods=["POST"])
@jwt_required()
def delteCategory(id):
    try:
        
        Categoria=Categories.query.get(id)
        if not Categoria:
            return jsonify({"message":"el Producto no existe","status":"error"})
        
        name=Categoria.category_name
        Categoria.delete()
        return jsonify({"title":"Categoria Eliminada correctamente","status":"success","message":f"La categoria {name} ha sido eliminada con exito"})
    except Exception as e:
        return jsonify({"title":f"Ha ocurrido un error","status":"error","message":f"Error al eliminar la categoria {name}"})
