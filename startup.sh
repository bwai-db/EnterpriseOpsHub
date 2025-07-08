#!/bin/bash

# Azure App Service startup script for Enterprise Operations Platform
# This script ensures proper initialization in the cloud environment

echo "🚀 Starting Enterprise Operations Platform on Azure App Service"
echo "=============================================================="

# Set working directory
cd /home/site/wwwroot

# Display environment information
echo "📊 Environment Information:"
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo "Working directory: $(pwd)"
echo "NODE_ENV: ${NODE_ENV:-development}"
echo "PORT: ${PORT:-5000}"

# Check if node_modules exists, install if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci --production
else
    echo "✅ Dependencies already installed"
fi

# Run database migrations
echo "🗄️ Running database migrations..."
if [ -n "$DATABASE_URL" ]; then
    npm run db:push || echo "⚠️ Database migration failed - continuing anyway"
else
    echo "⚠️ No DATABASE_URL found - skipping migrations"
fi

# Build application if needed
if [ ! -d "dist" ]; then
    echo "🔨 Building application..."
    npm run build || echo "⚠️ Build failed - using source files"
fi

# Health check
echo "🩺 Running health check..."
node -e "
const { createServer } = require('http');
const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'pre-startup-check', timestamp: new Date().toISOString() }));
});
server.listen(${PORT:-5000}, '0.0.0.0', () => {
    console.log('✅ Health check server started successfully');
    server.close();
});
" || echo "⚠️ Health check failed"

echo "🎯 Starting main application..."
echo "Application will be available at: http://localhost:${PORT:-5000}"
echo "Health endpoint: http://localhost:${PORT:-5000}/api/health"

# Start the application
exec npm start