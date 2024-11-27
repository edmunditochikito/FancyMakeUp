from flask import jsonify,Blueprint
from flask_jwt_extended import jwt_required
from config import db
from models.categories import Categories

categories = Blueprint("categories",__name__)

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