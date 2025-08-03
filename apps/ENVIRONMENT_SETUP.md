# Environment Configuration

This document explains how the frontend is configured to work with different backend environments.

## Environment Setup

### Local Development
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Environment File**: `.env.local`

### Production (Vercel)
- **Frontend**: Deployed on Vercel
- **Backend**: https://baltar-inc-1.onrender.com
- **Environment File**: `.env.production` and `vercel.json`

## Configuration Files

### 1. Environment Files

#### `.env.local` (Local Development)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ENVIRONMENT=development
```

#### `.env.production` (Production)
```
NEXT_PUBLIC_API_URL=https://baltar-inc-1.onrender.com
NEXT_PUBLIC_ENVIRONMENT=production
```

### 2. Configuration Utility

The `lib/config.js` file automatically detects the environment and provides the correct API URL:

```javascript
import { getApiEndpoint } from '../lib/config';

// Usage in components
const response = await fetch(getApiEndpoint('/api/auth/login'), {
  // ... request options
});
```

### 3. Vercel Configuration

The `vercel.json` file ensures production environment variables are set correctly during deployment.

## Updated Components

The following components have been updated to use the environment configuration:

1. **Admin Login** (`/admin/page.js`)
2. **Admin Dashboard** (`/admin/dashboard/page.js`)
3. **Quote Management** (`/admin/quote/[id]/page.js`)
4. **Savour & Sip Pricing** (`/sip-and-savour/pricing/page.js`)
5. **Frontend Web Design Contact** (`/components/FrontendWebDesign/ContactUsComponent/ContactUs.js`)

## Deployment Instructions

### For Vercel Deployment:
1. Push code to your repository
2. Connect repository to Vercel
3. Vercel will automatically use the production environment variables
4. The frontend will connect to the Render backend at `https://baltar-inc-1.onrender.com`

### For Local Development:
1. Ensure backend is running on `http://localhost:5000`
2. Run `npm run dev` in the apps directory
3. Frontend will automatically connect to local backend

## Environment Detection

The system automatically detects the environment based on:
- `process.env.NEXT_PUBLIC_ENVIRONMENT`
- `process.env.NODE_ENV`
- Fallback to development if not specified

## Testing

To test the configuration:
1. **Local**: Visit http://localhost:3000/admin and verify it connects to local backend
2. **Production**: Deploy to Vercel and verify it connects to Render backend

## Troubleshooting

If you encounter connection issues:
1. Check that the backend URL is correct in the environment files
2. Verify the backend is running and accessible
3. Check browser console for network errors
4. Ensure CORS is properly configured on the backend for the frontend domain
