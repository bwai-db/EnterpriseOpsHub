#!/bin/bash

# Enterprise Operations Platform Setup Script
# This script helps set up the application for development or production

set -e

echo "🏢 Enterprise Operations Platform Setup"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    echo "   Please upgrade Node.js and try again."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available. Please install npm and try again."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check for .env file
echo ""
echo "🔧 Checking environment configuration..."

if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env
    echo "✅ Created .env file from template"
    echo ""
    echo "🔍 IMPORTANT: Please edit .env file with your database credentials:"
    echo "   - Set DATABASE_URL to your PostgreSQL connection string"
    echo "   - Optionally set OPENAI_API_KEY for AI features"
    echo ""
    echo "📝 Example database URLs:"
    echo "   Local:    postgresql://postgres:password@localhost:5432/enterprise_ops"
    echo "   Neon:     postgresql://user:pass@ep-example.us-east-1.aws.neon.tech/db"
    echo "   Supabase: postgresql://postgres:pass@db.example.supabase.co:5432/postgres"
    echo ""
else
    echo "✅ .env file exists"
    
    # Check if DATABASE_URL is set
    if grep -q "DATABASE_URL=" .env; then
        if grep -q "DATABASE_URL=\"postgresql://username:password" .env; then
            echo "⚠️  DATABASE_URL appears to be using template values"
            echo "   Please update .env with your actual database credentials"
        else
            echo "✅ DATABASE_URL configured"
        fi
    else
        echo "⚠️  DATABASE_URL not found in .env file"
        echo "   Please add your PostgreSQL connection string"
    fi
fi

# Database setup
echo ""
echo "🗄️  Database setup..."

# Check if we can connect to the database
if npm run db:push > /dev/null 2>&1; then
    echo "✅ Database schema deployed successfully"
else
    echo "⚠️  Could not deploy database schema"
    echo "   This might be due to:"
    echo "   - Incorrect DATABASE_URL in .env file"
    echo "   - Database server not accessible"
    echo "   - Network connectivity issues"
    echo ""
    echo "   Please verify your database configuration and try again"
fi

# TypeScript check
echo ""
echo "🔍 Running TypeScript check..."
if npm run check > /dev/null 2>&1; then
    echo "✅ TypeScript compilation successful"
else
    echo "⚠️  TypeScript compilation issues detected"
    echo "   Run 'npm run check' for details"
fi

# Final setup summary
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "🚀 To start development:"
echo "   npm run dev"
echo ""
echo "🌐 Application will be available at:"
echo "   http://localhost:5000"
echo ""
echo "📚 Available commands:"
echo "   npm run dev          # Start development server"
echo "   npm run build        # Build for production"
echo "   npm start           # Start production server"
echo "   npm run db:push     # Deploy database schema"
echo "   npm run db:studio   # Open database management"
echo "   npm run check       # TypeScript type checking"
echo ""
echo "🔧 Next steps:"
echo "   1. Verify .env configuration"
echo "   2. Run 'npm run dev' to start development"
echo "   3. Visit http://localhost:5000 in your browser"
echo ""
echo "📖 For more information, see README.md"
echo "🆘 For support, create an issue on GitHub"
echo ""