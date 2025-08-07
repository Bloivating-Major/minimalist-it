# TodoMaster - Deployment Guide

## 🚀 Production Deployment

### **Prerequisites**
- Node.js 18+ 
- MongoDB Atlas account (or MongoDB server)
- Google Cloud Console project with OAuth configured
- Domain name for production

### **Backend Deployment**

#### **Option 1: Railway (Recommended)**
1. **Create Railway Account:** https://railway.app
2. **Upload your backend code to a repository**
3. **Deploy Backend:**
   ```bash
   # Railway will automatically detect and build your Node.js app
   ```
4. **Set Environment Variables in Railway:**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todomaster
   JWT_SECRET=your-secure-jwt-secret-min-32-chars
   SESSION_SECRET=your-secure-session-secret-min-32-chars
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

#### **Option 2: Heroku**
1. **Install Heroku CLI**
2. **Create Heroku App:**
   ```bash
   heroku create todomaster-api
   ```
3. **Set Environment Variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set SESSION_SECRET=your-session-secret
   heroku config:set GOOGLE_CLIENT_ID=your-google-client-id
   heroku config:set GOOGLE_CLIENT_SECRET=your-google-client-secret
   heroku config:set FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```
4. **Deploy:**
   ```bash
   # Upload your code to Heroku using their deployment methods
   ```

### **Frontend Deployment**

#### **Option 1: Vercel (Recommended)**
1. **Create Vercel Account:** https://vercel.com
2. **Upload your frontend code to a repository**
3. **Deploy Frontend:**
   - Vercel will auto-detect React app
   - Set build command: `npm run build`
   - Set output directory: `dist`
4. **Update API URLs:**
   - Frontend will automatically use production backend URL

#### **Option 2: Netlify**
1. **Create Netlify Account:** https://netlify.com
2. **Upload your frontend code to a repository**
3. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Deploy**

### **Database Setup**

#### **MongoDB Atlas (Recommended)**
1. **Create MongoDB Atlas Account:** https://cloud.mongodb.com
2. **Create Cluster:**
   - Choose free tier for testing
   - Select region closest to your users
3. **Create Database User:**
   - Username/password authentication
   - Give read/write access
4. **Configure Network Access:**
   - Add `0.0.0.0/0` for all IPs (or restrict to your server IPs)
5. **Get Connection String:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/todomaster?retryWrites=true&w=majority
   ```

### **Google OAuth Setup for Production**

1. **Update Google Cloud Console:**
   - Go to "APIs & Services" → "Credentials"
   - Edit your OAuth client ID
   
2. **Add Production URLs:**
   - **Authorized JavaScript origins:**
     ```
     https://your-frontend-domain.vercel.app
     ```
   - **Authorized redirect URIs:**
     ```
     https://your-backend-domain.railway.app/api/auth/google/callback
     ```

3. **Update OAuth Consent Screen:**
   - Add your production domain
   - Update privacy policy and terms of service URLs

### **Environment Variables Summary**

#### **Backend (.env.production)**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todomaster
FRONTEND_URL=https://your-frontend-domain.vercel.app
JWT_SECRET=your-secure-jwt-secret-min-32-chars
SESSION_SECRET=your-secure-session-secret-min-32-chars
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
```

#### **Frontend (Automatic Detection)**
- Frontend automatically detects production backend URL
- No additional environment variables needed

### **Post-Deployment Checklist**

- [ ] Backend API is accessible at production URL
- [ ] Frontend loads and connects to backend
- [ ] Google OAuth works with production domains
- [ ] MongoDB connection is successful
- [ ] QR code scanning works on mobile devices
- [ ] Cross-device todo synchronization works
- [ ] All CRUD operations function properly
- [ ] Theme toggle works correctly
- [ ] User authentication persists across sessions

### **Monitoring & Maintenance**

1. **Error Monitoring:**
   - Set up error tracking (Sentry, LogRocket)
   - Monitor API response times
   - Track user authentication issues

2. **Database Monitoring:**
   - Monitor MongoDB Atlas metrics
   - Set up alerts for connection issues
   - Regular database backups

3. **Security:**
   - Regularly rotate JWT secrets
   - Monitor for suspicious login attempts
   - Keep dependencies updated

### **Scaling Considerations**

1. **Backend Scaling:**
   - Use horizontal scaling for multiple instances
   - Implement Redis for session storage
   - Add rate limiting for API endpoints

2. **Database Scaling:**
   - MongoDB Atlas auto-scaling
   - Database indexing optimization
   - Connection pooling

3. **Frontend Optimization:**
   - CDN for static assets
   - Image optimization
   - Code splitting for better performance

## 🎯 **Quick Deploy Commands**

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend  
cd frontend
npm run build
npm run preview
```

## 🔧 **Troubleshooting**

### **Common Issues:**
1. **CORS Errors:** Update CORS_ORIGIN in backend environment
2. **OAuth Redirect Mismatch:** Check Google Console redirect URIs
3. **Database Connection:** Verify MongoDB URI and network access
4. **QR Scanner Not Working:** Ensure HTTPS in production for camera access

Your TodoMaster application is now ready for production deployment! 🚀
