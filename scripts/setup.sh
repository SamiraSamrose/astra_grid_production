#!/bin/bash
echo "Astra-Grid Setup Script"
echo "======================="
Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "Python version: $python_version"
Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate
Install backend dependencies
echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt
Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install
Create necessary directories
echo "Creating directories..."
mkdir -p ../models/weights
mkdir -p ../data/raw
mkdir -p ../data/processed
Initialize database
echo "Initializing database..."
cd ../backend
python -m alembic upgrade head
echo "Setup complete!"
echo "To start the backend: cd backend && uvicorn app.main:app --reload"
echo "To start the frontend: cd frontend && npm start"
