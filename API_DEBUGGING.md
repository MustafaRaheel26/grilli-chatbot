# Gemini API Debugging Guide

## Why the API Might Not Be Working

The Gemini API may not be working due to **CORS (Cross-Origin Resource Sharing) restrictions**. When you open the HTML file directly (using `file://` protocol), browsers block API calls to external services for security reasons.

## How to Check What's Happening

1. **Open your browser's Developer Console:**
   - Press `F12` or `Right-click → Inspect`
   - Go to the "Console" tab

2. **Send a message in the chatbot**

3. **Look for these messages:**
   - `🚀 Attempting Gemini API call...` - API is being tried
   - `✅ API Response received` - API worked!
   - `❌ API Error` - API failed
   - `🚫 CORS Error Detected!` - CORS is blocking the request
   - `🔄 Falling back to rule-based response` - Using fallback

## Solutions

### Solution 1: Use a Local Server (Recommended)

**The API will work when using a local server!**

#### Using Python:
```bash
# Navigate to your project folder
cd "C:\Users\test\Desktop\Chatbot Websites\grilli"

# Run server
python -m http.server 8000

# Open browser to:
http://localhost:8000
```

#### Using Node.js:
```bash
# Install http-server (one time)
npm install -g http-server

# Run server
http-server -p 8000

# Open browser to:
http://localhost:8000
```

#### Using VS Code:
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

### Solution 2: Check API Key

1. Verify your API key is correct in `assets/js/chatbot.js`
2. Make sure the API key is active in Google AI Studio
3. Check if there are any usage limits

### Solution 3: Disable API (Use Rule-Based Only)

If you want to force rule-based responses only, edit `assets/js/chatbot.js`:

```javascript
const CHATBOT_CONFIG = {
  apiKey: 'AIzaSyDx0RWaxk57mGPPqWexcy750YH0ZHn0Tzw',
  apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  useAPI: false, // Change to false to disable API
  // ...
};
```

## Expected Console Output

### When API Works:
```
🚀 Attempting Gemini API call...
📤 Sending request to Gemini API...
🔗 API URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=API_KEY_HIDDEN
📥 Response status: 200 OK
✅ API Response received: {...}
✨ Using Gemini AI response
```

### When API Fails (CORS):
```
🚀 Attempting Gemini API call...
📤 Sending request to Gemini API...
❌ Chatbot API Error: TypeError: Failed to fetch
Error type: TypeError
Error message: Failed to fetch
🚫 CORS Error Detected! The API cannot be called directly from the browser.
💡 Solution: Use a local server (http://localhost) or a backend proxy
🔄 Falling back to rule-based response
```

## Quick Test

1. Open `index.html` in browser
2. Open Console (F12)
3. Click chatbot icon
4. Type: "What's on your menu?"
5. Check console for messages

## Summary

- **Opening file directly (`file://`)**: API will fail due to CORS → Uses rule-based
- **Using local server (`http://localhost`)**: API should work → Uses Gemini AI
- **Rule-based always works**: Even if API fails, chatbot responds

The chatbot is designed to **always work** - it will use the API when possible, and automatically fall back to rule-based responses when the API isn't available.
