# Contact Form Setup Guide

## Environment Variables

### Frontend (.env)
```env
VITE_APP_API_BASE=http://localhost:4000
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

### Backend (server/.env)
```env
GITHUB_TOKEN=your_github_token_here
MONGO_URI=mongodb://localhost:27017/portfolio
RECAPTCHA_SECRET=your_recaptcha_secret_key_here
NODE_ENV=development
PORT=4000
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   cd server && npm install
   ```

2. **Configure Environment Variables**:
   - Copy `.env.example` to `.env`
   - Fill in your actual values

3. **Start MongoDB**:
   - Make sure MongoDB is running on your system
   - The app will create a `portfolio` database automatically

4. **Start the Servers**:
   ```bash
   # Terminal 1 - Backend
   cd server
   npm start
   
   # Terminal 2 - Frontend
   npm run dev
   ```

## Testing the Database Connection

Run the test script to verify MongoDB connection:
```bash
cd server
node test-db.js
```

## Features

- ✅ reCAPTCHA integration for spam protection
- ✅ Form validation
- ✅ MongoDB storage for submissions
- ✅ CORS enabled for development
- ✅ Proxy configuration for API calls
- ✅ Visual feedback for form states

## Troubleshooting

1. **reCAPTCHA not working**:
   - Ensure VITE_RECAPTCHA_SITE_KEY is set
   - Check that the domain is registered in reCAPTCHA admin console

2. **Database connection failed**:
   - Verify MongoDB is running
   - Check MONGO_URI in server/.env
   - Run `node test-db.js` to test connection

3. **API calls failing**:
   - Ensure backend server is running on port 4000
   - Check CORS configuration
   - Verify proxy settings in vite.config.js
