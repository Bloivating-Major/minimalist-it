# Google OAuth Setup Guide

To enable Google OAuth authentication in your TodoMaster app, follow these steps:

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "TodoMaster" (or any name you prefer)
4. Click "Create"

## 2. Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

## 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace)
3. Fill in the required information:
   - App name: "TodoMaster"
   - User support email: Your email
   - Developer contact information: Your email
4. Click "Save and Continue"
5. Skip "Scopes" for now (click "Save and Continue")
6. Add test users if needed (your email address)
7. Click "Save and Continue"

## 4. Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Name: "TodoMaster Web Client"
5. Add Authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - Add your production domain when deploying
6. Add Authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (for development)
   - Add your production API domain when deploying
7. Click "Create"

## 5. Update Environment Variables

1. Copy the Client ID and Client Secret from the credentials page
2. Update your `backend/.env` file:

```env
GOOGLE_CLIENT_ID=your-actual-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
```

## 6. Test the Authentication

1. Start your backend server: `cd backend && npm run dev`
2. Start your frontend server: `cd frontend && npm run dev`
3. Visit `http://localhost:5173`
4. Click "Continue with Google"
5. Complete the OAuth flow

## Production Deployment

When deploying to production:

1. Update the OAuth consent screen with your production domain
2. Add your production domains to Authorized JavaScript origins and redirect URIs
3. Update environment variables with production URLs
4. Consider moving to "Internal" user type if using Google Workspace

## Security Notes

- Keep your Client Secret secure and never expose it in frontend code
- Use HTTPS in production
- Regularly rotate your secrets
- Monitor OAuth usage in Google Cloud Console

## Troubleshooting

- **"redirect_uri_mismatch"**: Check that your redirect URI exactly matches what's configured in Google Cloud Console
- **"invalid_client"**: Verify your Client ID and Secret are correct
- **"access_blocked"**: Make sure your app is not restricted and test users are added if needed
