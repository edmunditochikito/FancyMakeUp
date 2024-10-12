from pydantic import BaseModel,constr,EmailStr

class UserRegisterSchema(BaseModel):
    name: constr(min_length=3)
    email:  EmailStr
    password: constr(min_length=8, max_length=14)
    phone: constr(min_length=6)

