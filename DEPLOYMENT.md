# 🚀 GitHub Deployment Checklist

This guide walks you through deploying your Enterprise Operations Platform to GitHub and running it on external servers.

## 📋 Step-by-Step Deployment Guide

### 1. Prepare for GitHub Upload

#### A. Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click "New Repository" or go to [github.com/new](https://github.com/new)
3. Repository settings:
   - **Name**: `enterprise-operations-platform` (or your preferred name)
   - **Description**: "Comprehensive enterprise IT operations management platform"
   - **Visibility**: Choose Public or Private
   - **Initialize**: ✅ Add README, ✅ Add .gitignore (Node), ✅ Choose MIT License
4. Click "Create Repository"

#### B. Prepare Local Files
Before uploading, ensure you have these files ready:

**✅ Required Files (Already Created):**
- `README.md` - Complete setup documentation
- `.gitignore` - Excludes sensitive files and build artifacts
- `LICENSE` - MIT license
- `.env.example` - Environment template
- `setup.sh` - Automated setup script

**⚠️ IMPORTANT - Create .env file locally (DO NOT commit to GitHub):**
```bash
# Copy the example file
cp .env.example .env

# Edit with your actual database credentials
# DATABASE_URL="postgresql://your-credentials-here"
```

### 2. Upload to GitHub

#### Option A: Using Git Command Line
```bash
# Initialize git repository
git init

# Add GitHub repository as remote
git remote add origin https://github.com/yourusername/enterprise-operations-platform.git

# Add all files (sensitive files excluded by .gitignore)
git add .

# Commit files
git commit -m "Initial commit: Enterprise Operations Platform"

# Push to GitHub
git push -u origin main
```

#### Option B: Using GitHub Desktop
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Click "Clone a repository from the Internet"
3. Clone your new repository
4. Copy all project files to the cloned folder (except .env)
5. Commit and push changes

### 3. Set Up on New Server

#### A. Server Requirements
- **Node.js**: Version 18 or higher
- **PostgreSQL**: Local instance or cloud database
- **Git**: For cloning repository
- **Memory**: Minimum 1GB RAM recommended
- **Storage**: 2GB+ available space

#### B. Clone and Setup
```bash
# Clone your repository
git clone https://github.com/yourusername/enterprise-operations-platform.git
cd enterprise-operations-platform

# Run automated setup
chmod +x setup.sh
./setup.sh

# Or manual setup:
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run db:push
npm run dev
```

### 4. Database Setup Options

#### Option A: Cloud Database (Recommended)

**Neon (Free Tier Available)**
1. Sign up at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string to .env file
4. Database URL format: `postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/db`

**Supabase (Free Tier Available)**
1. Sign up at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy connection string to .env file

**Railway (Paid)**
1. Sign up at [railway.app](https://railway.app)
2. Create PostgreSQL service
3. Copy connection variables to .env file

#### Option B: Local PostgreSQL
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE enterprise_ops;
CREATE USER enterprise_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE enterprise_ops TO enterprise_user;
\q

# Set DATABASE_URL in .env
DATABASE_URL="postgresql://enterprise_user:your_password@localhost:5432/enterprise_ops"
```

### 5. Production Deployment Options

#### Option A: Vercel (Frontend + Serverless)
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Set environment variables in Vercel dashboard
5. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`

#### Option B: Railway (Full-Stack)
1. Create account at [railway.app](https://railway.app)
2. Create new project from GitHub repository
3. Add environment variables in dashboard
4. Deploy automatically on push

#### Option C: DigitalOcean App Platform
1. Create account at [digitalocean.com](https://digitalocean.com)
2. Create new app from GitHub repository
3. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `npm start`
4. Add environment variables
5. Deploy

#### Option D: Self-Hosted VPS
```bash
# On your VPS (Ubuntu/CentOS)
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone and setup project
git clone https://github.com/yourusername/enterprise-operations-platform.git
cd enterprise-operations-platform
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run build

# Start with PM2
pm2 start npm --name "enterprise-ops" -- start
pm2 startup
pm2 save

# Setup Nginx reverse proxy (optional)
sudo apt install nginx
# Configure Nginx to proxy to port 5000
```

### 6. Environment Variables Checklist

**Required:**
- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `NODE_ENV` - Set to "production" for production

**Optional:**
- ⚠️ `OPENAI_API_KEY` - For AI insights features
- ⚠️ `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Individual DB params

### 7. Post-Deployment Verification

#### Test Checklist
```bash
# Check application health
curl http://your-domain.com/api/dashboard/holistic-kpis

# Verify database connection
npm run db:studio

# Check all services
npm run check

# Monitor logs
pm2 logs enterprise-ops  # If using PM2
```

#### Application Features to Test
- ✅ Dashboard loads with KPIs
- ✅ Users page displays workforce analytics
- ✅ User detail modals open correctly
- ✅ Licensing management functions
- ✅ Service management displays properly
- ✅ Manufacturing and supply chain data loads

### 8. Maintenance and Updates

#### Regular Updates
```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install

# Update database schema if needed
npm run db:push

# Rebuild and restart
npm run build
pm2 restart enterprise-ops
```

#### Monitoring
- Set up application monitoring (e.g., PM2 monitoring)
- Configure database backups
- Monitor server resources
- Set up error logging
- Implement health checks

### 9. Security Best Practices

#### Production Security
- ✅ Use HTTPS in production
- ✅ Keep environment variables secure
- ✅ Regular security updates
- ✅ Database connection encryption
- ✅ Rate limiting implementation
- ✅ CORS configuration
- ✅ Input validation

#### Backup Strategy
- Database regular backups
- Code repository backups
- Environment configuration backups
- File system backups

### 🆘 Troubleshooting

#### Common Issues
**Database Connection Failed:**
- Verify DATABASE_URL format
- Check database server accessibility
- Confirm credentials are correct

**Build Errors:**
- Run `npm install` to update dependencies
- Check Node.js version compatibility
- Clear node_modules and reinstall

**Port Already in Use:**
- Check what's using port 5000: `lsof -i :5000`
- Kill conflicting process or change port

**Permission Denied:**
- Check file permissions: `chmod +x setup.sh`
- Run with appropriate user privileges

#### Getting Help
- Check the main README.md file
- Create issue on GitHub repository
- Review application logs
- Check server system logs

---

**🎉 Congratulations!** Your Enterprise Operations Platform is now ready for GitHub deployment and external hosting.

For additional support, refer to the main README.md or create an issue in your GitHub repository.