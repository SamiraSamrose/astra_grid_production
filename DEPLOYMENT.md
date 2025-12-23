Deployment Guide
Prerequisites

Ubuntu 20.04+ or similar Linux distribution
Docker 24.0+
Docker Compose 2.0+
8GB+ RAM
50GB+ disk space

## Production Deployment
1. Server Setup
bash# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
2. Clone Repository
bashgit clone https://github.com/samirasamrose/astra-grid.git
cd astra-grid
3. Configure Environment
bash# Backend
cp backend/.env.example backend/.env
nano backend/.env

# Frontend
cp frontend/.env.example frontend/.env
nano frontend/.env
4. Build and Deploy
bash# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose ps
5. Initialize Database
bashdocker-compose exec api python -m alembic upgrade head
6. Verify Deployment
bashcurl http://localhost:8000/health
Monitoring
Logs
bash# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
Health Checks
bash# API health
curl http://localhost:8000/health

# Frontend
curl http://localhost:3000
Backup
Database Backup
bashdocker-compose exec db pg_dump -U postgres astraGrid > backup.sql
Restore
bashdocker-compose exec -T db psql -U postgres astraGrid < backup.sql
Scaling
Horizontal Scaling
bashdocker-compose up -d --scale api=3
Load Balancer (Nginx)
nginxupstream api_backend {
    server localhost:8001;
    server localhost:8002;
    server localhost:8003;
}

server {
    listen 80;
    location /api/ {
        proxy_pass http://api_backend;
    }
}
SSL/TLS
Certbot Setup
bashsudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
Troubleshooting
Container Issues
bash# Restart service
docker-compose restart api

# Rebuild
docker-compose build --no-cache api

# Remove and recreate
docker-compose down
docker-compose up -d
Database Connection
bash# Check database
docker-compose exec db psql -U postgres -l

# Test connection
docker-compose exec api python -c "from app.database import engine; print(engine.connect())"
