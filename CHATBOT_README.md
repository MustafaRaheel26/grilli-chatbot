# Grilli Restaurant Chatbot - Setup & Usage Guide

## Overview

This chatbot is a fully functional AI assistant integrated into the Grilli Restaurant website. It uses Google's Gemini AI API to provide intelligent, context-aware responses about the restaurant's menu, hours, reservations, and services.

## Features

✅ **Modern UI Design** - Matches the restaurant's gold and dark theme  
✅ **Context-Aware** - Remembers conversation history for better responses  
✅ **Menu Knowledge** - Trained with all menu items, prices, and descriptions  
✅ **Smart Redirects** - Politely handles irrelevant questions  
✅ **Responsive Design** - Works on desktop and mobile devices  
✅ **Easy Integration** - No backend server required (client-side only)

## Files Created

1. **`assets/css/chatbot.css`** - Chatbot styling matching the restaurant theme
2. **`assets/js/chatbot.js`** - Chatbot functionality with Gemini API integration
3. **`index.html`** - Updated to include chatbot CSS and JS links

## How It Works

The chatbot:
- Appears as a floating button at the bottom-right of the screen
- Opens a chat window when clicked
- Uses Google Gemini API for AI responses
- Maintains conversation context (last 10 messages)
- Is trained with restaurant information (menu, hours, contact details)

## Setup Instructions

### Option 1: Direct HTML File (Easiest)

1. Simply open `index.html` in a modern web browser
2. The chatbot will appear at the bottom-right corner
3. Click the chat icon to start chatting

**Note:** Due to CORS restrictions, the Gemini API may not work when opening the file directly. Use Option 2 for full functionality.

### Option 2: Local Server (Recommended)

#### Using Python:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

#### Using Node.js:

```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server -p 8000
```

Then open: `http://localhost:8000`

#### Using VS Code:

1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Testing the Chatbot

### Sample Conversations:

**1. Greeting Test:**
- Open the chatbot
- It should automatically greet you with: "Hello! 👋 Welcome to Grilli Restaurant!"

**2. Menu Query:**
- User: "What's on your menu?"
- Bot: Should list menu items with prices

**3. Hours Query:**
- User: "What are your opening hours?"
- Bot: Should provide daily, lunch, and dinner hours

**4. Reservation Query:**
- User: "How can I make a reservation?"
- Bot: Should provide phone numbers and email

**5. Irrelevant Question Test:**
- User: "What's the weather today?"
- Bot: Should politely redirect to restaurant-related topics

**6. Context Test:**
- User: "Tell me about Greek Salad"
- Bot: Provides details
- User: "How much does it cost?"
- Bot: Should remember context and provide the price ($25.50)

## Customization

### Changing the API Key

If you need to use a different Gemini API key, edit `assets/js/chatbot.js`:

```javascript
const CHATBOT_CONFIG = {
  apiKey: 'YOUR_NEW_API_KEY_HERE',
  // ... rest of config
};
```

### Updating Restaurant Information

Edit the `restaurantInfo` object in `assets/js/chatbot.js`:

```javascript
restaurantInfo: {
  name: 'Your Restaurant Name',
  address: 'Your Address',
  phone: ['Phone 1', 'Phone 2'],
  // ... update menu, hours, etc.
}
```

### Styling

Modify `assets/css/chatbot.css` to change colors, sizes, or layout. The chatbot uses CSS variables from the main theme:
- `--gold-crayola` - Primary gold color
- `--eerie-black-1` - Dark background
- `--white` - Text color

## API Configuration

The chatbot uses Google's Gemini Pro API. The API key is embedded in the JavaScript file. 

**Security Note:** For production, consider:
- Using a backend proxy to hide the API key
- Implementing rate limiting
- Adding authentication if needed

## Troubleshooting

### Chatbot doesn't appear
- Check browser console for errors
- Ensure `chatbot.css` and `chatbot.js` are loaded
- Verify file paths are correct

### API errors
- Check if API key is valid
- Verify internet connection
- Check browser console for specific error messages
- Ensure you're using a local server (not file://)

### Messages not sending
- Check browser console for errors
- Verify Gemini API key is correct
- Check network tab for API request status

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Internet Explorer (Not supported)

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all files are in correct locations
3. Ensure you're using a local server (not opening file directly)
4. Check that the Gemini API key is valid

## License

This chatbot is part of the Grilli Restaurant website template.

---

**Enjoy your new chatbot! 🎉**
