# TodoMaster Deployment Checklist ✅

## Pre-Deployment Setup

### 🗄️ Database (MongoDB Atlas)
- [ ] Create MongoDB Atlas account
- [ ] Create free cluster
- [ ] Create database user with read/write permissions
- [ ] Configure network access (0.0.0.0/0 for now)
- [ ] Get connection string
- [ ] Test connection locally

### 🔐 Google OAuth Setup
- [ ] Google Cloud Console project created
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth client ID created
- [ ] Local redirect URIs working
- [ ] Client ID and secret saved securely

### 📁 Code Repository
- [ ] Code organized and ready for deployment
- [ ] Code repository created
- [ ] All necessary files uploaded to repository
- [ ] Environment files excluded from repository
- [ ] Sensitive data not exposed in code

## Backend Deployment (Render)

### 🚀 Render Setup
- [ ] Render account created
- [ ] New web service created
- [ ] Repository connected
- [ ] Build settings configured:
  - Root Directory: `backend`
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`

### 🔧 Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `MONGODB_URI` (from Atlas)
- [ ] `JWT_SECRET` (32+ characters)
- [ ] `SESSION_SECRET` (32+ characters)
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `FRONTEND_URL` (will be Vercel URL)

### ✅ Backend Testing
- [ ] Service deployed successfully
- [ ] API endpoint accessible
- [ ] Database connection working
- [ ] Google OAuth redirect working

## Frontend Deployment (Vercel)

### 🌐 Vercel Setup
- [ ] Vercel account created
- [ ] New project created
- [ ] Repository connected
- [ ] Build settings configured:
  - Framework: Vite
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`

### 🔧 Frontend Configuration
- [ ] API URLs updated for production
- [ ] Auth context updated for production
- [ ] Build successful locally
- [ ] No environment variables needed

### ✅ Frontend Testing
- [ ] Site deployed successfully
- [ ] Login page loads
- [ ] API connection working
- [ ] Responsive design working

## Post-Deployment Configuration

### 🔐 Google OAuth Update
- [ ] Add Vercel URL to authorized JavaScript origins
- [ ] Add Render callback URL to authorized redirect URIs
- [ ] Update OAuth consent screen with production URLs
- [ ] Test OAuth flow end-to-end

### 🧪 Full Application Testing
- [ ] Desktop Google OAuth login works
- [ ] Mobile Google OAuth login works
- [ ] QR code generation works
- [ ] QR code scanning works (on HTTPS)
- [ ] Cross-device synchronization works
- [ ] Todo CRUD operations work
- [ ] Theme toggle works
- [ ] User profile dropdown works
- [ ] Logout functionality works

### 📊 Monitoring Setup
- [ ] Render logs accessible
- [ ] Vercel analytics enabled (optional)
- [ ] MongoDB Atlas monitoring configured
- [ ] Error tracking setup (optional)

## Production URLs

### 🔗 Update These URLs
Replace in deployment guide and code:

**Frontend URL:**
- Development: `http://localhost:5173`
- Production: `https://your-app-name.vercel.app`

**Backend URL:**
- Development: `http://localhost:5000`
- Production: `https://your-backend-name.onrender.com`

**Google OAuth URLs:**
- JavaScript Origins: `https://your-app-name.vercel.app`
- Redirect URIs: `https://your-backend-name.onrender.com/api/auth/google/callback`

## Security Checklist

### 🔒 Production Security
- [ ] JWT secrets are 32+ characters
- [ ] Session secrets are 32+ characters
- [ ] MongoDB user has minimal required permissions
- [ ] CORS configured for specific domains
- [ ] HTTPS enabled on all services
- [ ] Environment variables not exposed in frontend
- [ ] Google OAuth restricted to production domains

## Performance Optimization

### ⚡ Optional Improvements
- [ ] Custom domain configured
- [ ] CDN setup for static assets
- [ ] Database indexes optimized
- [ ] API response caching
- [ ] Frontend code splitting
- [ ] Image optimization
- [ ] Service worker for offline support

## Backup & Recovery

### 💾 Data Protection
- [ ] MongoDB Atlas automatic backups enabled
- [ ] Code files backed up securely
- [ ] Environment variables documented securely
- [ ] Recovery procedures documented

---

## 🎉 Deployment Complete!

When all items are checked:

✅ **Your MinimalistIt application is live and production-ready!**

**Frontend:** https://your-app-name.vercel.app  
**Backend:** https://your-backend-name.onrender.com  
**Database:** MongoDB Atlas cluster  

### Next Steps:
1. Share your app with users
2. Monitor performance and errors
3. Collect user feedback
4. Plan future features
5. Scale as needed

**Congratulations on deploying your full-stack application!** 🚀
