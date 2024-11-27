from config import db
class BaseModel(db.Model):
    __abstract__ = True  # Esto indica que esta clase no se mapeará a una tabla directamente

    def save(self):
        try:
            db.session.add(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e

    def delete(self):
        try:
            db.session.delete(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e