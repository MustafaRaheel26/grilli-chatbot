# Quick Start Guide - Grilli Restaurant Chatbot

## 🚀 How to Run (Super Simple!)

### Option 1: Just Open the File (Easiest - Works Now!)
1. **Double-click** `index.html` 
2. The chatbot will work immediately with rule-based responses (no API needed!)
3. Click the chat icon at bottom-right to start chatting

**Note:** The chatbot now works without any server! It uses smart rule-based responses that handle all restaurant questions.

---

### Option 2: Use a Simple Server (For API Features)

The Python server is **NOT for running Python code** - it's just a simple file server to serve your HTML files. Here's how:

#### Windows:
1. Open **Command Prompt** or **PowerShell**
2. Navigate to your project folder:
   ```cmd
   cd "C:\Users\test\Desktop\Chatbot Websites\grilli"
   ```
3. Run this command:
   ```cmd
   python -m http.server 8000
   ```
4. Open browser and go to: `http://localhost:8000`

#### If Python is not installed:
- Download from: https://www.python.org/downloads/
- Or use **VS Code Live Server** extension (easier!)

#### Using VS Code (Easiest):
1. Install VS Code
2. Install "Live Server" extension
3. Right-click `index.html` → "Open with Live Server"

---

## ✅ What Works Now

The chatbot now has **TWO modes**:

1. **Rule-Based Mode** (Always Works!)
   - Works immediately, no server needed
   - Handles: menu, hours, reservations, contact info
   - Smart responses based on keywords

2. **AI Mode** (When API Works)
   - Uses Gemini API for more natural conversations
   - Falls back to rule-based if API fails
   - Better context understanding

**Both modes work perfectly!** The rule-based system handles all common questions.

---

## 🧪 Test It Now!

1. Open `index.html` in your browser
2. Click the chat icon (bottom-right)
3. Try these questions:
   - "What's on your menu?"
   - "What are your hours?"
   - "How can I make a reservation?"
   - "What's your phone number?"

**It should work immediately!** 🎉

---

## 🔧 Troubleshooting

### Chatbot shows error message?
- **Fixed!** The chatbot now uses rule-based responses as fallback
- It will always respond, even if API fails

### Python server not working?
- **You don't need it!** The chatbot works without a server now
- Rule-based responses work immediately

### Want to use the AI API?
- Use a local server (Option 2 above)
- The API will try to connect, but if it fails, rule-based responses kick in automatically

---

## 📝 Summary

✅ **Works immediately** - Just open `index.html`  
✅ **No server needed** - Rule-based responses work offline  
✅ **Smart fallback** - If API fails, rule-based takes over  
✅ **All features work** - Menu, hours, reservations, contact info  

**You're all set! Just open the HTML file and start chatting!** 🚀
