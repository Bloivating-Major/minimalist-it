# TodoMaster - Vercel + Render Deployment Guide

Complete step-by-step guide to deploy your TodoMaster application using Vercel for frontend and Render for backend.

## 🚀 Prerequisites

- Code repository (GitHub, GitLab, etc.)
- Vercel account (free)
- Render account (free)
- MongoDB Atlas account (free)
- Google Cloud Console project

## 📋 Deployment Overview

1. **Database:** MongoDB Atlas (cloud database)
2. **Backend:** Render (Node.js hosting)
3. **Frontend:** Vercel (React hosting)
4. **Authentication:** Google OAuth (updated for production)

---

## 🗄️ Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign up for free account
3. Create a new organization and project

### 1.2 Create Database Cluster
1. Click "Build a Database"
2. Choose **FREE** shared cluster
3. Select cloud provider and region (closest to your users)
4. Cluster name: `todomaster-cluster`
5. Click "Create Cluster"

### 1.3 Configure Database Access
1. **Database Access** → "Add New Database User"
2. Authentication Method: **Password**
3. Username: `todomaster-user`
4. Password: Generate secure password (save it!)
5. Database User Privileges: **Read and write to any database**
6. Click "Add User"

### 1.4 Configure Network Access
1. **Network Access** → "Add IP Address"
2. Click "Allow Access from Anywhere" (0.0.0.0/0)
3. Click "Confirm"

### 1.5 Get Connection String
1. **Clusters** → Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: **Node.js**, Version: **4.1 or later**
4. Copy connection string:
   ```
   mongodb+srv://todomaster-user:<password>@todomaster-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name: `/todomaster` before the `?`

**Final connection string:**
```
mongodb+srv://todomaster-user:yourpassword@todomaster-cluster.xxxxx.mongodb.net/todomaster?retryWrites=true&w=majority
```

---

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Prepare Code for Deployment
1. Ensure all your code is ready for deployment
2. Create a code repository: `todomaster`
3. Upload your project files to the repository

### 2.2 Create Render Account
1. Go to [Render](https://render.com/)
2. Sign up with your preferred method
3. Connect your code repository to Render

### 2.3 Deploy Backend Service
1. **Dashboard** → "New" → "Web Service"
2. Connect your code repository: `todomaster`
3. **Service Configuration:**
   - **Name:** `todomaster-backend`
   - **Environment:** `Node`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

### 2.4 Set Environment Variables
In Render dashboard, go to your service → **Environment**:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://todomaster-user:yourpassword@todomaster-cluster.xxxxx.mongodb.net/todomaster?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-min-32-characters-long
SESSION_SECRET=your-super-secure-session-secret-min-32-characters-long
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=https://todomaster.vercel.app
```

**Important:** Generate secure secrets:
```bash
# Generate JWT_SECRET (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate SESSION_SECRET (32+ characters)  
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.5 Deploy Backend
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend will be available at: `https://todomaster-backend.onrender.com`

---

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Update Frontend API Configuration
Update `frontend/src/lib/api.ts`:

```typescript
// Replace the production backend URL
else if (hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
  return 'https://todomaster-backend.onrender.com/api';  // Your actual Render URL
}
```

### 3.2 Update Code
Make sure your frontend code has the updated API URLs for production deployment.

### 3.3 Create Vercel Account
1. Go to [Vercel](https://vercel.com/)
2. Sign up with your preferred method
3. Connect your code repository to Vercel

### 3.4 Deploy Frontend
1. **Dashboard** → "Add New..." → "Project"
2. Import your code repository: `todomaster`
3. **Project Configuration:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### 3.5 Configure Project Settings
1. **Environment Variables:** (None needed for frontend)
2. **Domains:** Your app will be at `https://todomaster.vercel.app`
3. Click "Deploy"

### 3.6 Custom Domain (Optional)
1. **Settings** → "Domains"
2. Add your custom domain
3. Configure DNS records as instructed

---

## 🔐 Step 4: Update Google OAuth

### 4.1 Get Your Production URLs
- **Frontend:** `https://todomaster.vercel.app`
- **Backend:** `https://todomaster-backend.onrender.com`

### 4.2 Update Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → "Credentials"
3. Click on your OAuth 2.0 Client ID

### 4.3 Add Production URLs
**Authorized JavaScript origins:**
```
https://todomaster.vercel.app
```

**Authorized redirect URIs:**
```
https://todomaster-backend.onrender.com/api/auth/google/callback
```

### 4.4 Update OAuth Consent Screen
1. **OAuth consent screen**
2. Update **Application home page:** `https://todomaster.vercel.app`
3. Update **Privacy policy link** and **Terms of service link** (if required)

---

## ✅ Step 5: Test Deployment

### 5.1 Test Backend API
Visit: `https://todomaster-backend.onrender.com/api/auth/google`
- Should redirect to Google OAuth

### 5.2 Test Frontend
Visit: `https://todomaster.vercel.app`
- Should load the login page
- Google OAuth should work
- QR code generation should work

### 5.3 Test Full Flow
1. **Desktop:** Sign in with Google OAuth
2. **Generate QR code** using smartphone icon
3. **Mobile:** Scan QR code or use Google OAuth
4. **Verify:** Cross-device synchronization works

---

## 🔧 Step 6: Post-Deployment Configuration

### 6.1 Custom Domain (Optional)
**Vercel:**
1. Settings → Domains → Add domain
2. Configure DNS records

**Render:**
1. Settings → Custom Domains → Add domain
2. Configure DNS records

### 6.2 Environment Variables Update
If you use custom domains, update:
- `FRONTEND_URL` in Render
- Google OAuth URLs in Google Console

### 6.3 SSL Certificates
Both Vercel and Render provide automatic SSL certificates.

---

## 📊 Step 7: Monitoring & Maintenance

### 7.1 Render Monitoring
- **Logs:** View real-time logs in Render dashboard
- **Metrics:** Monitor CPU, memory, and response times
- **Alerts:** Set up email notifications

### 7.2 Vercel Analytics
- **Analytics:** Enable Vercel Analytics for frontend metrics
- **Performance:** Monitor Core Web Vitals
- **Errors:** Track JavaScript errors

### 7.3 MongoDB Atlas Monitoring
- **Metrics:** Monitor database performance
- **Alerts:** Set up alerts for connection issues
- **Backups:** Configure automatic backups

---

## 🚨 Troubleshooting

### Common Issues:

**1. CORS Errors:**
- Check `FRONTEND_URL` in Render environment variables
- Verify frontend URL matches exactly

**2. OAuth Redirect Mismatch:**
- Verify Google Console redirect URIs match Render URL exactly
- Check for http vs https

**3. Database Connection:**
- Verify MongoDB connection string
- Check network access settings in Atlas

**4. Build Failures:**
- Check build logs in Render/Vercel
- Verify all dependencies are in package.json

**5. QR Scanner Not Working:**
- Ensure HTTPS is enabled (required for camera access)
- Test on actual mobile device

---

## 🎉 Deployment Complete!

Your TodoMaster application is now live:

- **Frontend:** https://todomaster.vercel.app
- **Backend:** https://todomaster-backend.onrender.com
- **Database:** MongoDB Atlas cluster

### Features Working:
✅ Google OAuth authentication  
✅ QR code scanning on mobile  
✅ Cross-device synchronization  
✅ Real-time todo management  
✅ Dark/Light theme toggle  
✅ Responsive design  

**Your production-ready TodoMaster is now accessible worldwide!** 🚀
