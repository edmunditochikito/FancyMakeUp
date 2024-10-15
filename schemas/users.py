from pydantic import BaseModel,constr,EmailStr

class UserRegisterSchema(BaseModel):
    name: str
    phone: str
    email:  EmailStr
    password: str

class UserLogInSchema(BaseModel):
    email:EmailStr
    password:str