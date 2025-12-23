#!/bin/bash
echo "Astra-Grid Deployment Script"
echo "============================"
Build Docker images
echo "Building Docker images..."
docker-compose -f docker-compose.prod.yml build
Stop existing containers
echo "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down
Start services
echo "Starting services..."
docker-compose -f docker-compose.prod.yml up -d
Wait for services
echo "Waiting for services to start..."
sleep 10
Check health
echo "Checking service health..."
curl -f http://localhost:8000/health || exit 1
echo "Deployment complete!"
echo "Frontend: http://localhost:3000"
echo "API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
