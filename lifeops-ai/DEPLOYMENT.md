# Deploying Sona to the Cloud ☁️

## Quick Options (Easiest to Hardest)

### 1. **Railway** (Recommended - Free Tier Available)
✅ Easiest deployment  
✅ Auto-deploys from GitHub  
✅ Free $5/month credit  

### 2. **Render** (Good Free Tier)
✅ Free tier available  
✅ Auto-deploys from GitHub  
⚠️ Sleeps after 15 min inactivity (wakes up on request)

### 3. **DigitalOcean App Platform** (Paid but cheap)
💰 ~$5/month  
✅ Always running  
✅ Good performance

---

## Option 1: Deploy to Railway (Recommended)

### Step 1: Prepare Your Code

Create a `Procfile` in your project root:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Make sure `requirements.txt` is complete.

### Step 2: Push to GitHub
```bash
cd /Users/vikasverma/Desktop/sona.ai/lifeops-ai
git init
git add .
git commit -m "Initial commit - Sona WhatsApp AI"
git branch -M main
# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/sona-ai.git
git push -u origin main
```

### Step 3: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `sona-ai` repository
5. Railway will auto-detect it's a Python app

### Step 4: Set Environment Variables
In Railway dashboard → Variables, add:
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_API_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `GROQ_API_KEY`

### Step 5: Update WhatsApp Webhook
1. Railway will give you a URL like: `https://sona-ai-production.up.railway.app`
2. Go to Meta Developer Console
3. Update webhook URL to: `https://YOUR_RAILWAY_URL/webhook`
4. Test the webhook

✅ **Done!** Sona is now live 24/7.

---

## Option 2: Deploy to Render

### Step 1: Prepare Your Code

Create `render.yaml`:
```yaml
services:
  - type: web
    name: sona-ai
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

### Step 2: Push to GitHub (same as above)

### Step 3: Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Render auto-detects Python

### Step 4: Set Environment Variables
Add all your env vars in Render dashboard.

### Step 5: Update WhatsApp Webhook
Use your Render URL: `https://sona-ai.onrender.com/webhook`

⚠️ **Note**: Free tier sleeps after 15 min. Paid tier ($7/mo) stays awake.

---

## Option 3: DigitalOcean App Platform

### Step 1: Push to GitHub

### Step 2: Deploy
1. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. Create account
3. Apps → Create App → GitHub
4. Select repo
5. Set environment variables
6. Deploy ($5/month)

---

## Quick Comparison

| Platform | Cost | Always On? | Difficulty |
|----------|------|------------|------------|
| **Railway** | Free $5/mo credit | ✅ Yes | Easy |
| **Render** | Free | ❌ Sleeps | Easy |
| **Render Paid** | $7/mo | ✅ Yes | Easy |
| **DigitalOcean** | $5/mo | ✅ Yes | Medium |

---

## After Deployment Checklist

✅ Update WhatsApp webhook URL to your cloud URL  
✅ Test webhook with a message  
✅ Check logs in platform dashboard  
✅ Monitor Supabase storage  
✅ Set up error alerts (optional)  

---

## Troubleshooting

### "Module not found" error
Make sure `requirements.txt` has all dependencies:
```bash
pip freeze > requirements.txt
```

### Webhook not responding
- Check logs in platform dashboard
- Verify environment variables are set
- Test webhook with Meta's "Test" button

### App sleeping (Render free tier)
Upgrade to paid tier or use Railway/DigitalOcean.

---

## Need Help?

1. Check platform logs
2. Test locally first: `uvicorn app.main:app --reload`
3. Verify env vars are set correctly
