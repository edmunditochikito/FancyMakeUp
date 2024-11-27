from flask import Flask
from flask_jwt_extended import get_jwt_identity,verify_jwt_in_request
from flask_cors import CORS
from config import Config,db,jwt


from routes.users import user 
from routes.index import index
from routes.products import product
from routes.categories import categories



app=Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
jwt.init_app(app)
CORS(app, supports_credentials=True)

app.register_blueprint(user)
app.register_blueprint(index)
app.register_blueprint(product)
app.register_blueprint(categories)
@app.context_processor
def inject_user():
    try:
        verify_jwt_in_request(optional=True)
        current_user = get_jwt_identity()
    except Exception:
        current_user = None

    return {'user_logged_in': current_user is not None, 'current_user': current_user}

if __name__=="__main__":
    app.run(port=3000,debug=True)