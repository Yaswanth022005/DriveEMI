# DriveEMI — Deployment Guide (EC2 + Nginx + PM2)

This document outlines a simple path to deploy the DriveEMI MERN app to an Ubuntu EC2 instance. It assumes you have an AWS EC2 instance (Ubuntu) ready and SSH access.

1) Prepare server

- SSH into instance
- Update & install tools:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git build-essential
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

2) Get code

```bash
cd /var/www
sudo git clone <your-repo-url> driveemi
cd driveemi/backend
npm install
cp .env.example .env
# Edit .env to set MONGO_URI and JWT_SECRET
```

3) Start backend

```bash
pm2 start ecosystem.config.js
pm2 save
```

4) Build and serve frontend

Option A: Serve static build with Nginx

```bash
cd /var/www/driveemi/frontend
npm install
npm run build
sudo cp -r dist/* /var/www/html/
sudo systemctl restart nginx
```

Option B: Use Docker for frontend or both services (see Dockerfiles in frontend/ and backend/)

5) Nginx reverse proxy (example)

Edit `/etc/nginx/sites-available/default` and proxy /api to localhost:5000:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/html;

    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Restart nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

6) HTTPS with Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

7) Useful tips

- Use MongoDB Atlas for managed DB and set `MONGO_URI` to the connection string.
- Set `JWT_SECRET` in `.env` with a long random value.
- Use PM2 logs to troubleshoot: `pm2 logs driveemi-backend`.
