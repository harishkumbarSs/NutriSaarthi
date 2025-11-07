"""MongoDB connection handling"""
import os
from typing import Generator
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MongoDB URI from environment or use default
MONGODB_URI = os.getenv(
    "MONGODB_URI",
    "mongodb://localhost:27017/nutrisaarthi"
)

# Create MongoDB client
client = MongoClient(MONGODB_URI)

# Get database name from URI
DB_NAME = os.getenv("DB", "nutrisaarthi")

# Get database
db = client[DB_NAME]

def get_db() -> Generator:
    """Get database connection"""
    try:
        yield db
    finally:
        # No need to close connection per request
        # MongoDB maintains connection pool
        pass