
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings
import secrets
import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

SECRET_KEY = settings.JWT_SECRET
ALGORITHM = settings.JWT_ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

class SecurityManager:
    """Handle authentication and authorization"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using bcrypt"""
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify password against hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire, "iat": datetime.utcnow()})
        
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def decode_token(token: str) -> Dict[str, Any]:
        """Decode and validate JWT token"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError as e:
            raise HTTPException(
                status_code=401,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    @staticmethod
    def generate_api_key() -> str:
        """Generate secure API key"""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def hash_api_key(api_key: str) -> str:
        """Hash API key for storage"""
        return hashlib.sha256(api_key.encode()).hexdigest()
    
    @staticmethod
    def verify_api_key(api_key: str, hashed_key: str) -> bool:
        """Verify API key against hash"""
        return hashlib.sha256(api_key.encode()).hexdigest() == hashed_key

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> Dict[str, Any]:
    """Dependency to get current authenticated user"""
    token = credentials.credentials
    
    try:
        payload = SecurityManager.decode_token(token)
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication credentials"
            )
        
        return {
            "user_id": user_id,
            "username": payload.get("username"),
            "email": payload.get("email"),
            "roles": payload.get("roles", [])
        }
    
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials"
        )

def require_role(required_role: str):
    """Decorator to require specific role"""
    async def role_checker(current_user: Dict = Depends(get_current_user)):
        if required_role not in current_user.get("roles", []):
            raise HTTPException(
                status_code=403,
                detail=f"Insufficient permissions. Required role: {required_role}"
            )
        return current_user
    return role_checker

def validate_password_strength(password: str) -> bool:
    """Validate password meets security requirements"""
    if len(password) < 8:
        return False
    
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password)
    
    return all([has_upper, has_lower, has_digit, has_special])

def sanitize_input(input_str: str) -> str:
    """Sanitize user input to prevent injection attacks"""
    dangerous_chars = ["<", ">", "&", """, "'", ";", "--", "/*", "*/"]
    
    for char in dangerous_chars:
        input_str = input_str.replace(char, "")
    
    return input_str.strip()

def rate_limit_key(user_id: str, endpoint: str) -> str:
    """Generate rate limit key"""
    return f"rate_limit:{user_id}:{endpoint}"

def encrypt_sensitive_data(data: str, key: str) -> str:
    """Encrypt sensitive data"""
    from cryptography.fernet import Fernet
    
    f = Fernet(key.encode())
    encrypted = f.encrypt(data.encode())
    return encrypted.decode()

def decrypt_sensitive_data(encrypted_data: str, key: str) -> str:
    """Decrypt sensitive data"""
    from cryptography.fernet import Fernet
    
    f = Fernet(key.encode())
    decrypted = f.decrypt(encrypted_data.encode())
    return decrypted.decode()

def generate_csrf_token() -> str:
    """Generate CSRF token"""
    return secrets.token_hex(32)

def verify_csrf_token(token: str, stored_token: str) -> bool:
    """Verify CSRF token"""
    return secrets.compare_digest(token, stored_token)

class RateLimiter:
    """Simple in-memory rate limiter"""
    
    def __init__(self):
        self.requests = {}
    
    def is_allowed(
        self,
        key: str,
        max_requests: int = 100,
        window_seconds: int = 60
    ) -> bool:
        """Check if request is allowed under rate limit"""
        now = datetime.utcnow()
        
        if key not in self.requests:
            self.requests[key] = []
        
        self.requests[key] = [
            timestamp for timestamp in self.requests[key]
            if now - timestamp < timedelta(seconds=window_seconds)
        ]
        
        if len(self.requests[key]) < max_requests:
            self.requests[key].append(now)
            return True
        
        return False

rate_limiter = RateLimiter()

def check_rate_limit(key: str, max_requests: int = 100, window_seconds: int = 60):
    """Dependency to check rate limit"""
    async def _check_rate_limit():
        if not rate_limiter.is_allowed(key, max_requests, window_seconds):
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded. Please try again later."
            )
    return _check_rate_limit
