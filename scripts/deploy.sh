#!/bin/bash

# Farm-AI Deployment Script
# This script helps sync code and trigger deployments.

echo "🚀 Starting Farm-AI Deployment Sync..."

# 1. Sync with GitHub
echo "📦 Syncing code with GitHub..."
git add .
git commit -m "Deploy update: $(date)"
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Code pushed to GitHub. Automatic deployments triggered on Render and Vercel (if connected)."
else
    echo "❌ Git push failed. Please check your connection."
    exit 1
fi

# 2. Optional Vercel CLI Deployment
if command -v vercel &> /dev/null
then
    echo "⚡ Vercel CLI detected. Triggering production deployment..."
    vercel --prod
else
    echo "💡 Tip: Install Vercel CLI ('npm i -g vercel') to trigger production deploys directly from here."
fi

echo "🎉 Deployment Sync Complete!"
echo "Check your dashboards:"
echo "- Vercel: https://vercel.com/dashboard"
echo "- Render: https://dashboard.render.com"
