from app import app

from routes.users import user 
from routes.index import index
from routes.products import product
from routes.categories import categories


app.register_blueprint(user)
app.register_blueprint(index)
app.register_blueprint(product)
app.register_blueprint(categories)