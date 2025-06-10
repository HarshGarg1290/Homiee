# 🚀 Deploy ML Service to Railway
Write-Host "🚀 Deploying ML Service to Railway..." -ForegroundColor Green

# Check if Railway CLI is installed
if (!(Get-Command "railway" -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

# Login to Railway
Write-Host "🔐 Please login to Railway..." -ForegroundColor Yellow
railway login

# Create new project
Write-Host "📝 Creating new Railway project..." -ForegroundColor Yellow
railway project new

# Change to ml-service directory
Set-Location ml-service

# Set environment variables
Write-Host "⚙️ Setting up environment variables..." -ForegroundColor Yellow
railway variables set PORT=5000

# Deploy the service
Write-Host "🚢 Deploying ML service..." -ForegroundColor Yellow
railway up

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy the service URL from Railway dashboard" -ForegroundColor White
Write-Host "2. Update ML_SERVICE_URL in your Vercel environment variables" -ForegroundColor White
Write-Host "3. Deploy your Next.js app to Vercel" -ForegroundColor White
