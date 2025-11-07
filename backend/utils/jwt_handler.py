"""JWT token handling utilities"""
import jwt
from datetime import datetime, timedelta
from typing import Dict

# Your production secret key - change this!
JWT_SECRET = "your-production-secret-key-change-this"
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

def create_token(data: Dict) -> str:
    """Create a new JWT token"""
    expiration = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    
    payload = data.copy()
    payload.update({"exp": expiration})
    
    token = jwt.encode(
        payload,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )
    
    return token

def verify_token(token: str) -> Dict:
    """Verify and decode JWT token"""
    try:
        decoded = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )
        return decoded
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")