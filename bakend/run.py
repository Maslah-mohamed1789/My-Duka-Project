import os
import sys
from flask import Flask
from dotenv import load_dotenv
from app import db, create_app

# Debugging Information
print("Current Working Directory:", os.getcwd())
print("Python Path:", sys.path)

# Load environment variables
load_dotenv()

# Create Flask App
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
