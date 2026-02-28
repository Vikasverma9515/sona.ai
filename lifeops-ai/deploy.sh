#!/bin/bash

# Quick deployment setup for Railway
echo "🚀 Setting up Sona for deployment..."

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git..."
    git init
    git add .
    git commit -m "Initial commit - Sona WhatsApp AI"
    git branch -M main
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

echo ""
echo "📋 Next steps:"
echo "1. Create a new repository on GitHub: https://github.com/new"
echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/sona-ai.git"
echo "3. Run: git push -u origin main"
echo "4. Go to https://railway.app and deploy from GitHub"
echo "5. Add environment variables in Railway dashboard"
echo "6. Update WhatsApp webhook URL to your Railway URL"
echo ""
echo "📖 Full guide: See DEPLOYMENT.md"
