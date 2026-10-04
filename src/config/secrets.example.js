// 1) Copy this file to src/config/secrets.js (same folder)
// 2) Fill in your values
// 3) secrets.js is in .gitignore, so it is NOT pushed to your public GitHub repo.

export const API_BASE_URL = 'https://cyberakshak-api.onrender.com'; // FastAPI Chatbot endpoint
export const API_KEY = 'YOUR_FASTAPI_CHATBOT_KEY';

// Supabase Backend Configuration
export const SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co';
export const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Google OAuth Web Client ID for Native Google Sign-In
export const GOOGLE_WEB_CLIENT_ID = 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com';

// App Security Controls
export const REQUIRE_AUTH = true;
