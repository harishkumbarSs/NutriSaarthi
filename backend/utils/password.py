"""Password hashing and verification utilities"""
import hashlib
import hmac
import os
from typing import Union

def hash_password(password: Union[str, bytes]) -> str:
    """Hash a password using SHA256 and a random salt"""
    if isinstance(password, str):
        password = password.encode('utf-8')
        
    salt = os.urandom(16)  # Generate random 16-byte salt
    
    # Create HMAC with SHA256 and salt
    hashed = hmac.new(
        salt,
        password,
        hashlib.sha256
    ).hexdigest()
    
    # Combine salt and hash with $ separator
    return f"{salt.hex()}${hashed}"

def verify_password(password: Union[str, bytes], hashed_password: str) -> bool:
    """Verify a password against its hash"""
    if isinstance(password, str):
        password = password.encode('utf-8')
        
    try:
        # Split salt and hash
        salt_hex, stored_hash = hashed_password.split('$')
        salt = bytes.fromhex(salt_hex)
        
        # Re-create hash with same salt
        computed_hash = hmac.new(
            salt,
            password,
            hashlib.sha256
        ).hexdigest()
        
        # Compare in constant time
        return hmac.compare_digest(
            computed_hash.encode('utf-8'),
            stored_hash.encode('utf-8')
        )
        
    except Exception:
        return False