from flask import Blueprint,render_template,jsonify,request,redirect
from flask_jwt_extended import jwt_required, get_jwt_identity
from schemas.products import productAdditionSchema
from werkzeug.utils import secure_filename  
from models.products import Products
from models.categories import Categories
from config import db
import os
product=Blueprint("product",__name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
UPLOAD_FOLDER = 'static/images'

def validFile(filename):
    return "." in filename and filename.rsplit(".",1)[1].lower() in ALLOWED_EXTENSIONS

@product.route("/addProduct",methods=["GET"])
@jwt_required()
def addProduct():
    user=get_jwt_identity()
    if(user["role"]=="administrator"):
        return render_template("products/add.html")
    
    else: return redirect("/")

@product.route("/addProduct",methods=["POST"])
@jwt_required()
def addProductPost():
    try:
        data=request.form.to_dict()
        image=request.files.get("image_url")
        valid_product = productAdditionSchema(**data,image_url=image.filename)
        print(valid_product.image_url)    
        product_exists=db.session.execute(
            db.select(Products).filter(Products.product_name==valid_product.product_name)
        ).scalars().first()
       
        
        if(product_exists):
            return jsonify({"status":"error","message":"El producto ya existe en el inventario"})
        
            
        if image and validFile(image.filename):
            
            filename = secure_filename(image.filename)
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            image.save(file_path)
            relative_path = f"{UPLOAD_FOLDER}/{filename}"
            new_product=Products(**valid_product.model_dump())
            new_product.image_url=relative_path
            new_product.save()
            
        return jsonify({"message":"Producto agregado correctamente","status":"success"})
    except Exception as e:
        print(e)
        return jsonify({"message":f"error al agregar el producto","status":"error"})
    

@product.route("/manageProducts",methods=["GET"])
@jwt_required()
def manageProducts():
    return render_template("products/manage.html")
    
@product.route("/getProducts",methods=["GET"])
def getProducts():
    products=db.session.execute(
        db.select(Products,Categories).join(Categories,Categories.category_id==Products.category_id)
    ).all()
    products=[{"product_name":product.product_name,"description":product.description,"price":product.price,"stock":product.stock,"status":product.status,"id":product.product_id,"category":category.category_name,"category_id":product.category_id,"image_url":product.image_url} for product,category in products]
    return jsonify({"data":products})

@product.route("/getProduct/<id>", methods=["POST"])
def getProduct(id):
    try:
        id = int(id)
        product_data = db.session.execute(
            db.select(Products, Categories)
            .join(Categories, Categories.category_id == Products.category_id).filter(Products.product_id==id)
        ).all()
        product_data=[{"product_name":product.product_name,"description":product.description,"price":product.price,"stock":product.stock,"status":product.status,"id":product.product_id,"category":category.category_name,"category_id":product.category_id} for product,category in product_data]
        return jsonify(product_data[0])
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@product.route("/updateProduct/<id>", methods=["POST"])
@jwt_required()
def updateProduct(id):
    user=get_jwt_identity()
    if(user["role"]=="administrator"):
        try:
            product=Products.query.get(id)
            if not product:
                return jsonify({"message":"el Producto no existe","status":"error"})
            data=request.form.to_dict()
            product.product_name=data["product_name"]
            product.description=data["description"]
            product.price=data["price"]
            product.stock=data["stock"]
            product.status=data["status"]
            product.category_id=data["category_id"]
            name=product.product_name
            product.save()
        
            return jsonify({"title":"Producto actualizado correctamente","status":"success","message":f"El producto {name} ha sido actualizado con exito"})
        except Exception as e:
            print(e)
            return jsonify({"title":f"Ha ocurrido un error","status":"error","message":f"Error al actualizar el platillo {name}"})
    else: 
        return jsonify({"message":"no eres un administrador, ne debrias estar aqui ","status":"error","title":"por que estas aqui?"})

@product.route("/deleteProduct/<id>", methods=["POST"])
@jwt_required()
def deleteProduct(id):
    user=get_jwt_identity()
    if(user["role"]=="administrator"):
        try:
            product=Products.query.get(id)
            if not product:
                return jsonify({"message":"el Producto no existe","status":"error"})

            name=product.product_name
            
            if product.image_url and os.path.exists(os.path.join(UPLOAD_FOLDER, product.image_url)):
                os.remove(os.path.join(UPLOAD_FOLDER, product.image_url))
            product.delete()
        
            return jsonify({"title":"Producto eliminado correctamente","status":"success","message":f"El producto {name} ha sido eliminado con exito"})
        except Exception as e:
            print(e)
            return jsonify({"title":f"Ha ocurrido un error","status":"error","message":f"Error al eliminar el platillo {name}"})
    else:
        return jsonify({"message":"no eres un administrador, ne debrias estar aqui ","status":"error","title":"por que estas aqui?"})
 

