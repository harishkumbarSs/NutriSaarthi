import pymongo

# MongoDB connection string
uri = "mongodb+srv://nutrisaarthi_user:12Harish34@cluster0.0qft9xv.mongodb.net/?appName=Cluster0"

# Create a new client and connect to the server
client = pymongo.MongoClient(uri)

try:
    # Send a ping to confirm a successful connection
    client.admin.command('ping')
    print("Successfully connected to MongoDB!")
except Exception as e:
    print(e)

client.close()