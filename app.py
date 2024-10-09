from flask import Flask
from config import Config,db,jwt


from routes.users import user 



app=Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
jwt.init_app(app)

app.register_blueprint(user)


    
if __name__=="__main__":
    app.run(debug=True,port=3000)