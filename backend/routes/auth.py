"""Authentication routes and utilities"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from bson import ObjectId
from typing import Optional

from db.connection import get_db
from utils.jwt_handler import verify_token
from utils.password import hash_password, verify_password

router = APIRouter()
security = HTTPBearer()

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    weight: Optional[float] = None
    height: Optional[float] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    activity_level: Optional[str] = None
    dietary_preference: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db = Depends(get_db)
):
    """Get current user from JWT token"""
    try:
        token = credentials.credentials
        payload = verify_token(token)
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
            
        # Convert ObjectId to string for JSON serialization
        user["id"] = str(user["_id"])
        del user["_id"]
        
        return user
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}"
        )

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db = Depends(get_db)):
    """Register a new user"""
    if db.users.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    user_dict = user.dict()
    user_dict["password"] = hash_password(user_dict["password"])
    
    result = db.users.insert_one(user_dict)
    
    return {
        "id": str(result.inserted_id),
        "message": "User created successfully"
    }

@router.post("/login")
async def login(user: UserLogin, db = Depends(get_db)):
    """Login and return JWT token"""
    db_user = db.users.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    return {
        "access_token": create_token({"user_id": str(db_user["_id"])}),
        "token_type": "bearer"
    }

@router.get("/me")
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    return current_user