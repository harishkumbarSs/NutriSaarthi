# 🚀 Quick Deployment Checklist

Deploy NutriSaarthi in 30 minutes!

---

## ⏱️ 30-Minute Deployment Plan

### 5 MIN: MongoDB Atlas Setup
- [ ] Sign up at https://www.mongodb.com/cloud/atlas
- [ ] Create M0 Sandbox cluster
- [ ] Create database user (username/password)
- [ ] Add IP whitelist (0.0.0.0/0)
- [ ] Copy connection string
- [ ] Replace `<password>` in connection string

### 10 MIN: Backend on Render
- [ ] Sign up at https://render.com (with GitHub)
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `pip install -r requirements.txt`
- [ ] Set Start Command: `gunicorn main:app`
- [ ] Add environment variables:
  - `MONGODB_URI` = (your connection string)
  - `JWT_SECRET` = (generate random string)
  - `CORS_ORIGINS` = (your frontend URL, leave blank for now)
  - `DEBUG` = False
- [ ] Deploy
- [ ] Copy your backend URL (e.g., https://nutrisaarthi-api.onrender.com)

### 10 MIN: Frontend on Vercel
- [ ] Sign up at https://vercel.com (with GitHub)
- [ ] Import repository
- [ ] Set Root Directory: `frontend`
- [ ] Add environment variable:
  - `VITE_API_BASE_URL` = (your backend URL from Render)
- [ ] Deploy
- [ ] Get your frontend URL (e.g., https://nutrisaarthi.vercel.app)

### 5 MIN: Final Setup
- [ ] Go back to Render dashboard
- [ ] Edit environment variables
- [ ] Update `CORS_ORIGINS` = (your Vercel frontend URL)
- [ ] Redeploy backend
- [ ] Test your live app!

---

## ✅ Post-Deployment Tests

### Test Backend
```bash
# Replace with your actual URL
curl https://nutrisaarthi-api.onrender.com/docs
```

Should show Swagger API documentation.

### Test Frontend
1. Open: `https://YOUR-VERCEL-URL.vercel.app`
2. Sign up with test account
3. Log meal
4. Check water tracking
5. View coaching tip
6. Verify smart water goal

### Test API Connection
In browser console, check:
1. Network requests go to correct backend
2. No CORS errors
3. API responses return data

---

## 🔑 Important Notes

### Free Tier Limitations

**Render (Backend):**
- Free tier spins down after 15 min inactivity
- First request after sleep = ~30 seconds delay
- Solution: Upgrade to paid or use Railway

**Vercel (Frontend):**
- No limitations on free tier
- Fast, reliable, always running

**MongoDB Atlas:**
- 512MB free storage (plenty for testing)
- Shared cluster

### Environment Variables to Never Expose

```
JWT_SECRET          - Keep secret!
MONGODB_URI         - Contains password!
DATABASE_PASSWORD   - Keep secret!
API_KEYS            - Keep secret!
```

✅ Always use platform's environment variable feature (never in code)

---

## 📱 Your Live URLs

After deployment, you'll have:

```
Frontend: https://YOUR-VERCEL-URL.vercel.app
Backend:  https://YOUR-RENDER-URL.onrender.com
API Docs: https://YOUR-RENDER-URL.onrender.com/docs
```

---

## 🔄 Automatic Updates

After initial deployment, every GitHub push automatically:
1. Triggers Render backend redeploy
2. Triggers Vercel frontend redeploy
3. Changes live in 1-2 minutes

No manual work needed! ✨

---

## 💡 Pro Tips

### 1. Monitor Your Apps
- Vercel: Project → Analytics
- Render: Service → Metrics

### 2. Check Logs for Errors
- Vercel: Deployments → Build & Deploy logs
- Render: Service → Logs

### 3. Use Custom Domain (Optional)
Both Vercel and Render support custom domains
- Buy domain from Namecheap, GoDaddy, etc.
- Point to your deployment
- Set SSL certificate

### 4. Upgrade When Needed
- Start free, upgrade when traffic increases
- Gradual scaling as you grow

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend 502 error | Check env variables, MongoDB connection |
| Frontend "Cannot connect to API" | Check VITE_API_BASE_URL, backend URL |
| CORS errors | Update CORS_ORIGINS in backend |
| Slow startup | Normal on Render free tier (30 sec) |
| Database connection timeout | Check MongoDB IP whitelist |

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ Frontend loads without errors  
✅ Can sign up and login  
✅ Can log meals  
✅ Can track water  
✅ See coaching tips  
✅ See smart water goals  
✅ API calls work  
✅ No console errors  

---

## 📞 Need Help?

### Documentation
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
- MongoDB: https://docs.atlas.mongodb.com

### Main README
- See README.md for full documentation
- See DEPLOYMENT_GUIDE.md for detailed setup

---

**Congratulations! Your app is live! 🎉**

Share the URLs with friends and family!

---

Last Updated: November 7, 2025
