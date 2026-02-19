'use strict';

/**
 * CHATBOT CONFIGURATION
 */

const CHATBOT_CONFIG = {
  apiKey: 'AIzaSyDx0RWaxk57mGPPqWexcy750YH0ZHn0Tzw',
  apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  useAPI: true, // Set to false to force rule-based only
  
  // Restaurant Information for Training
  restaurantInfo: {
    name: 'Grilli',
    address: 'Restaurant St, Delicious City, London 9578, UK',
    phone: ['+1 123 456 7890', '+88-123-123456', '+80 (400) 123 4567'],
    email: ['booking@restaurant.com', 'booking@grilli.com'],
    hours: {
      daily: '8:00 am to 10:00 pm',
      lunch: '11:00 am - 2:30 pm (Monday to Sunday)',
      dinner: '5:00 pm - 10:00 pm (Monday to Sunday)',
      winter: '7:00 pm to 9:00 pm (During winter)'
    },
    menu: [
      {
        name: 'Greek Salad',
        price: '$25.50',
        description: 'Tomatoes, green bell pepper, sliced cucumber onion, olives, and feta cheese.',
        badge: 'Seasonal'
      },
      {
        name: 'Lasagne',
        price: '$40.00',
        description: 'Vegetables, cheeses, ground meats, tomato sauce, seasonings and spices'
      },
      {
        name: 'Butternut Pumpkin',
        price: '$10.00',
        description: 'A delicious pumpkin dish'
      },
      {
        name: 'Tokusen Wagyu',
        price: '$39.00',
        description: 'Vegetables, cheeses, ground meats, tomato sauce, seasonings and spices.',
        badge: 'New'
      },
      {
        name: 'Olivas Rellenas',
        price: '$25.00',
        description: 'Avocados with crab meat, red onion, crab salad stuffed red bell pepper and green bell pepper.'
      },
      {
        name: 'Opu Fish',
        price: '$49.00',
        description: 'Vegetables, cheeses, ground meats, tomato sauce, seasonings and spices'
      }
    ],
    specialDish: {
      name: 'Lobster Tortellini',
      originalPrice: '$40.00',
      currentPrice: '$20.00',
      description: 'Our special dish with amazing flavors'
    },
    services: ['Breakfast', 'Appetizers', 'Drinks'],
    features: [
      'Hygienic Food',
      'Fresh Environment',
      'Skilled Chefs',
      'Event & Party'
    ]
  }
};

/**
 * CHATBOT SYSTEM PROMPT
 */

const SYSTEM_PROMPT = `You are a friendly and professional chatbot assistant for Grilli Restaurant. Your role is to help visitors with restaurant-related inquiries.

RESTAURANT INFORMATION:
- Name: ${CHATBOT_CONFIG.restaurantInfo.name}
- Address: ${CHATBOT_CONFIG.restaurantInfo.address}
- Phone: ${CHATBOT_CONFIG.restaurantInfo.phone.join(', ')}
- Email: ${CHATBOT_CONFIG.restaurantInfo.email.join(', ')}

OPERATING HOURS:
- Daily: ${CHATBOT_CONFIG.restaurantInfo.hours.daily}
- Lunch: ${CHATBOT_CONFIG.restaurantInfo.hours.lunch}
- Dinner: ${CHATBOT_CONFIG.restaurantInfo.hours.dinner}
- Winter Special: ${CHATBOT_CONFIG.restaurantInfo.hours.winter}

MENU ITEMS:
${CHATBOT_CONFIG.restaurantInfo.menu.map(item => 
  `- ${item.name}${item.badge ? ` (${item.badge})` : ''}: ${item.price} - ${item.description}`
).join('\n')}

SPECIAL DISH:
- ${CHATBOT_CONFIG.restaurantInfo.specialDish.name}: ${CHATBOT_CONFIG.restaurantInfo.specialDish.currentPrice} (was ${CHATBOT_CONFIG.restaurantInfo.specialDish.originalPrice})

SERVICES: ${CHATBOT_CONFIG.restaurantInfo.services.join(', ')}

FEATURES: ${CHATBOT_CONFIG.restaurantInfo.features.join(', ')}

IMPORTANT GUIDELINES - STRICT ENFORCEMENT:
1. Always greet visitors warmly and offer assistance with restaurant-related questions
2. Provide accurate information about menu items, prices, hours, and services
3. Help with reservations by directing them to call ${CHATBOT_CONFIG.restaurantInfo.phone[0]} or email ${CHATBOT_CONFIG.restaurantInfo.email[0]}

4. CRITICAL: If asked about ANY topic unrelated to Grilli Restaurant (politics, history, geography, weather, celebrities, current events, general knowledge, etc.), you MUST respond EXACTLY with this message:
   "I'm the Grilli Restaurant assistant, and I'm here to help you with information about our restaurant only. I can assist you with our menu, hours, reservations, contact information, and services. How can I help you with your dining experience at Grilli?"

5. NEVER answer questions about:
   - Politics, politicians, or political events
   - Historical figures or events
   - Geography or locations outside the restaurant
   - Weather or climate
   - Celebrities or public figures
   - General knowledge questions
   - Any topic not related to Grilli Restaurant

6. Be concise, friendly, and professional
7. Remember context from the conversation to provide relevant follow-up responses
8. Use natural, conversational language

Respond in a helpful, warm, and professional manner. Keep responses concise (2-3 sentences when possible). ALWAYS redirect irrelevant questions immediately.`;

/**
 * CHATBOT CLASS
 */

class RestaurantChatbot {
  constructor() {
    this.conversationHistory = [];
    this.isOpen = false;
    this.isTyping = false;
    this.currentContext = null; // Track current conversation context
    this.init();
  }

  init() {
    this.createChatbotHTML();
    this.attachEventListeners();
    this.showGreeting();
  }

  createChatbotHTML() {
    const chatbotHTML = `
      <div class="chatbot-container">
        <button class="chatbot-toggle" aria-label="Open chatbot">
          <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
        </button>
        
        <div class="chatbot-window">
          <div class="chatbot-header">
            <div class="chatbot-header-info">
              <div class="chatbot-avatar">G</div>
              <div class="chatbot-header-text">
                <h3>Grilli Assistant</h3>
                <p>Online</p>
              </div>
            </div>
            <button class="chatbot-close" aria-label="Close chatbot">
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
          
          <div class="chatbot-messages" id="chatbot-messages"></div>
          
          <div class="chatbot-input-container">
            <input 
              type="text" 
              class="chatbot-input" 
              id="chatbot-input" 
              placeholder="Type your message..."
              autocomplete="off"
            />
            <button class="chatbot-send" id="chatbot-send" aria-label="Send message">
              <ion-icon name="send-outline"></ion-icon>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    
    this.toggleBtn = document.querySelector('.chatbot-toggle');
    this.window = document.querySelector('.chatbot-window');
    this.messagesContainer = document.getElementById('chatbot-messages');
    this.input = document.getElementById('chatbot-input');
    this.sendBtn = document.getElementById('chatbot-send');
    this.closeBtn = document.querySelector('.chatbot-close');
  }

  attachEventListeners() {
    this.toggleBtn.addEventListener('click', () => this.toggleChatbot());
    this.closeBtn.addEventListener('click', () => this.toggleChatbot());
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Close on overlay click (outside chatbot)
    this.window.addEventListener('click', (e) => {
      if (e.target === this.window) {
        this.toggleChatbot();
      }
    });
  }

  toggleChatbot() {
    this.isOpen = !this.isOpen;
    this.window.classList.toggle('active');
    
    if (this.isOpen) {
      this.input.focus();
      // Show greeting on first open
      if (!this.greetingShown) {
        setTimeout(() => {
          this.addMessage(this.greetingMessage, false);
          this.conversationHistory.push({
            role: 'assistant',
            parts: [{ text: this.greetingMessage }]
          });
          this.greetingShown = true;
        }, 300);
      }
    }
  }

  showGreeting() {
    // Greeting message - will be shown when chatbot is first opened
    this.greetingMessage = "Hello! 👋 Welcome to Grilli Restaurant! I'm here to help you with our menu, hours, reservations, or any questions about dining with us. How can I assist you today?";
    this.greetingShown = false;
  }

  addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const time = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    messageDiv.innerHTML = `
      <div class="message-avatar">${isUser ? 'You' : 'G'}</div>
      <div class="message-content">
        ${this.formatMessage(text)}
        <div class="message-time">${time}</div>
      </div>
    `;

    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  formatMessage(text) {
    // Convert markdown-like formatting to HTML
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  showTypingIndicator() {
    if (this.isTyping) return;
    
    this.isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="message-avatar">G</div>
      <div class="chatbot-typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    
    this.messagesContainer.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    this.isTyping = false;
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  // Scroll to menu section on the page
  scrollToMenuSection() {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      // Close chatbot if open to show the menu
      if (this.isOpen) {
        this.toggleChatbot();
      }
      
      // Smooth scroll to menu section
      setTimeout(() => {
        menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Add a highlight effect
        menuSection.style.transition = 'box-shadow 0.3s ease';
        menuSection.style.boxShadow = '0 0 20px rgba(218, 165, 32, 0.5)';
        setTimeout(() => {
          menuSection.style.boxShadow = '';
        }, 2000);
      }, 300);
      return true;
    }
    return false;
  }

  // Scroll to reservation section on the page
  scrollToReservationSection() {
    const reservationSection = document.getElementById('reservation');
    if (reservationSection) {
      // Close chatbot if open to show the form
      if (this.isOpen) {
        this.toggleChatbot();
      }
      
      // Smooth scroll to reservation section
      setTimeout(() => {
        reservationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Add a highlight effect
        reservationSection.style.transition = 'box-shadow 0.3s ease';
        reservationSection.style.boxShadow = '0 0 20px rgba(218, 165, 32, 0.5)';
        setTimeout(() => {
          reservationSection.style.boxShadow = '';
        }, 2000);
      }, 300);
      return true;
    }
    return false;
  }

  // Add button to message
  addButtonToMessage(messageText, buttonText, buttonAction) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    
    const time = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    messageDiv.innerHTML = `
      <div class="message-avatar">G</div>
      <div class="message-content">
        ${this.formatMessage(messageText)}
        <div class="message-time">${time}</div>
        <button class="chatbot-action-btn" onclick="${buttonAction}">
          ${buttonText}
        </button>
      </div>
    `;

    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  // Add reservation button to chat
  addReservationButton() {
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'chatbot-button-container';
    
    const button = document.createElement('button');
    button.className = 'chatbot-action-btn';
    button.innerHTML = `
      <ion-icon name="calendar-outline"></ion-icon>
      Open Reservation Form
    `;
    button.addEventListener('click', () => this.openReservationForm());
    
    buttonDiv.appendChild(button);
    this.messagesContainer.appendChild(buttonDiv);
    this.scrollToBottom();
  }

  // Open reservation form
  openReservationForm() {
    // Scroll to reservation section
    this.scrollToReservationForm();
    
    // Add confirmation message
    setTimeout(() => {
      this.addMessage("I've opened the reservation form for you! Please fill it out with your details, and we'll confirm your reservation. If you need any help, feel free to ask!", false);
      this.conversationHistory.push({
        role: 'assistant',
        parts: [{ text: "I've opened the reservation form for you! Please fill it out with your details, and we'll confirm your reservation. If you need any help, feel free to ask!" }]
      });
    }, 500);
  }

  // Scroll to reservation form
  scrollToReservationForm() {
    const reservationSection = document.getElementById('reservation');
    if (reservationSection) {
      // Close chatbot if open
      if (this.isOpen) {
        this.toggleChatbot();
      }
      
      // Smooth scroll to reservation section
      setTimeout(() => {
        reservationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Add highlight effect
        reservationSection.style.transition = 'box-shadow 0.3s ease';
        reservationSection.style.boxShadow = '0 0 20px rgba(218, 165, 32, 0.5)';
        setTimeout(() => {
          reservationSection.style.boxShadow = '';
        }, 2000);
      }, 300);
    }
  }

  // Check if response is restaurant-related
  isRestaurantRelated(text) {
    const textLower = text.toLowerCase();
    const restaurantKeywords = [
      'grilli', 'restaurant', 'menu', 'food', 'dish', 'order', 'reservation',
      'book', 'table', 'hour', 'open', 'close', 'price', 'cost', 'dining',
      'eat', 'meal', 'lunch', 'dinner', 'breakfast', 'appetizer', 'drink',
      'special', 'contact', 'phone', 'email', 'address', 'location'
    ];
    return restaurantKeywords.some(keyword => textLower.includes(keyword));
  }

  // Check if question is irrelevant to restaurant
  isIrrelevantQuestion(message) {
    const messageLower = message.toLowerCase();
    
    // Restaurant-related keywords (if these are present, it's relevant)
    const restaurantKeywords = [
      'menu', 'food', 'dish', 'order', 'reservation', 'book', 'table',
      'hour', 'open', 'close', 'price', 'cost', 'grilli', 'restaurant',
      'dining', 'eat', 'meal', 'lunch', 'dinner', 'breakfast', 'appetizer',
      'drink', 'special', 'contact', 'phone', 'email', 'address', 'location',
      'greek salad', 'lasagne', 'pumpkin', 'wagyu', 'olivas', 'fish',
      'lobster', 'tortellini', 'chef', 'service', 'event', 'party'
    ];
    
    // Check if it contains restaurant keywords
    const hasRestaurantKeyword = restaurantKeywords.some(keyword => 
      messageLower.includes(keyword)
    );
    
    if (hasRestaurantKeyword) {
      return false; // It's relevant
    }
    
    // Irrelevant topic keywords
    const irrelevantKeywords = [
      'imran khan', 'pakistan', 'politics', 'political', 'election', 'government',
      'president', 'prime minister', 'who made', 'who created', 'who founded',
      'weather', 'climate', 'temperature', 'rain', 'snow',
      'history', 'historical', 'ancient', 'war', 'battle',
      'celebrity', 'actor', 'actress', 'singer', 'sport', 'football', 'cricket',
      'movie', 'film', 'music', 'song', 'book', 'novel',
      'science', 'math', 'physics', 'chemistry', 'biology',
      'country', 'capital', 'city', 'where is', 'what is', 'who is',
      'news', 'current event', 'today', 'yesterday'
    ];
    
    // Check for irrelevant keywords
    const hasIrrelevantKeyword = irrelevantKeywords.some(keyword => 
      messageLower.includes(keyword)
    );
    
    return hasIrrelevantKeyword; // Return true if irrelevant
  }

  async sendMessage() {
    const message = this.input.value.trim();
    
    if (!message || this.isTyping) return;

    // Add user message to UI
    this.addMessage(message, true);
    this.input.value = '';
    this.sendBtn.disabled = true;

    // Add to conversation history
    this.conversationHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Show typing indicator
    this.showTypingIndicator();

    try {
      // Check for reservation context first (before API call)
      if (this.checkReservationContext(message)) {
        this.hideTypingIndicator();
        const reservationResponse = this.getRuleBasedResponse(message);
        this.addMessage(reservationResponse, false);
        
        // Add button to open reservation form
        setTimeout(() => {
          this.addReservationButton();
        }, 100);
        
        this.conversationHistory.push({
          role: 'assistant',
          parts: [{ text: reservationResponse }]
        });
        return;
      }
      
      // Get response (will use API if available, otherwise rule-based)
      const response = await this.getAIResponse(message);
      this.hideTypingIndicator();
      
      // Check if response mentions reservation
      if (response.toLowerCase().includes('reservation') || response.toLowerCase().includes('book a table')) {
        this.addMessage(response, false);
        // Add button after a short delay
        setTimeout(() => {
          this.addReservationButton();
        }, 100);
      } else {
        this.addMessage(response, false);
      }
      
      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        parts: [{ text: response }]
      });
    } catch (error) {
      console.error('Chatbot error:', error);
      this.hideTypingIndicator();
      // Use rule-based fallback
      const fallbackResponse = this.getRuleBasedResponse(message);
      this.addMessage(fallbackResponse, false);
      
      // Add to conversation history
      this.conversationHistory.push({
        role: 'assistant',
        parts: [{ text: fallbackResponse }]
      });
    } finally {
      this.sendBtn.disabled = false;
      this.input.focus();
    }
  }

  // Check if user is responding to a reservation question
  checkReservationContext(userMessage) {
    const message = userMessage.toLowerCase().trim();
    const lastAssistantMessage = this.conversationHistory
      .filter(msg => msg.role === 'assistant')
      .slice(-1)[0];
    
    if (lastAssistantMessage) {
      const lastText = lastAssistantMessage.parts[0].text.toLowerCase();
      const isReservationQuestion = lastText.includes('reservation') || 
                                    lastText.includes('book a table') ||
                                    lastText.includes('make a reservation');
      
      // Check if user said yes/okay/sure to reservation
      if (isReservationQuestion && (
        message === 'yes' || message === 'y' || message === 'ok' || 
        message === 'okay' || message === 'sure' || message === 'yeah' ||
        message.includes('yes') || message.includes('book') || message.includes('reserve')
      )) {
        return true;
      }
    }
    
    return false;
  }

  // Rule-based responses as fallback (works without API)
  getRuleBasedResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    const info = CHATBOT_CONFIG.restaurantInfo;
    
    // FIRST: Check if user is responding "yes" to a reservation question
    if (this.checkReservationContext(userMessage)) {
      this.currentContext = 'reservation';
      return `Great! I'd be happy to help you make a reservation. Here's what you can do:

**Option 1:** Fill out our online reservation form below (I can open it for you)
**Option 2:** Call us directly at ${info.phone[0]}
**Option 3:** Email us at ${info.email[0]}

Would you like me to open the reservation form for you?`;
    }
    
    // SECOND: Check if question is irrelevant
    if (this.isIrrelevantQuestion(userMessage)) {
      return "I'm the Grilli Restaurant assistant, and I'm here to help you with information about our restaurant only. I can assist you with our menu, hours, reservations, contact information, and services. How can I help you with your dining experience at Grilli?";
    }
    
    // Menu queries
    if (message.includes('menu') || message.includes('what do you serve') || message.includes('what can i order') || message.includes('dishes')) {
      let menuText = "Here's our delicious menu:\n\n";
      info.menu.forEach(item => {
        menuText += `• **${item.name}**${item.badge ? ` (${item.badge})` : ''}: ${item.price}\n   ${item.description}\n\n`;
      });
      menuText += `**Special Dish:** ${info.specialDish.name} - ${info.specialDish.currentPrice} (was ${info.specialDish.originalPrice})\n\n`;
      menuText += "Would you like to know more about any specific dish? I can also show you our menu section on the website!";
      
      // Scroll to menu section
      setTimeout(() => this.scrollToMenuSection(), 500);
      
      return menuText;
    }
    
    // Hours queries
    if (message.includes('hour') || message.includes('open') || message.includes('close') || message.includes('when are you')) {
      return `Our operating hours are:\n\n• **Daily**: ${info.hours.daily}\n• **Lunch**: ${info.hours.lunch}\n• **Dinner**: ${info.hours.dinner}\n• **Winter Special**: ${info.hours.winter}\n\nWe're open every day! How can I help you further?`;
    }
    
    // Reservation queries
    if (message.includes('reservation') || message.includes('book') || message.includes('table') || message.includes('reserve')) {
      this.currentContext = 'reservation';
      return `I'd be happy to help you make a reservation! Here are your options:\n\n• **Phone**: ${info.phone.join(' or ')}\n• **Email**: ${info.email.join(' or ')}\n• **Online Form**: Fill out our reservation form on the website\n\nWould you like me to open the reservation form for you?`;
    }
    
    // Contact queries
    if (message.includes('contact') || message.includes('phone') || message.includes('email') || message.includes('address') || message.includes('location') || message.includes('where')) {
      return `Here's how to reach us:\n\n• **Address**: ${info.address}\n• **Phone**: ${info.phone.join(', ')}\n• **Email**: ${info.email.join(', ')}\n\nFeel free to contact us anytime!`;
    }
    
    // Specific menu items
    for (const item of info.menu) {
      if (message.includes(item.name.toLowerCase())) {
        // Scroll to menu section when specific item is mentioned
        setTimeout(() => this.scrollToMenuSection(), 500);
        return `**${item.name}**${item.badge ? ` (${item.badge})` : ''} - ${item.price}\n\n${item.description}\n\nI've scrolled to our menu section so you can see it on the page. Would you like to make a reservation to try it?`;
      }
    }
    
    // Special dish
    if (message.includes('special') || message.includes('lobster') || message.includes('tortellini')) {
      // Scroll to menu section for special dish
      setTimeout(() => this.scrollToMenuSection(), 500);
      return `Our special dish is **${info.specialDish.name}**! It's currently on special offer at ${info.specialDish.currentPrice} (regularly ${info.specialDish.originalPrice}). ${info.specialDish.description} I've scrolled to our menu section. Would you like to make a reservation?`;
    }
    
    // Price queries
    if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
      const lastMessage = this.conversationHistory[this.conversationHistory.length - 2];
      if (lastMessage && lastMessage.role === 'assistant') {
        const lastText = lastMessage.parts[0].text.toLowerCase();
        for (const item of info.menu) {
          if (lastText.includes(item.name.toLowerCase())) {
            return `The ${item.name} costs ${item.price}. ${item.description}`;
          }
        }
      }
      return "Our menu prices range from $10.00 to $49.00. Would you like to know the price of a specific dish?";
    }
    
    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! 👋 How can I help you today? I can assist you with our menu, hours, reservations, or any questions about Grilli Restaurant!";
    }
    
    // Thank you
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome! Is there anything else I can help you with?";
    }
    
    // Default - check if it's restaurant related
    const restaurantKeywords = ['food', 'restaurant', 'dining', 'eat', 'meal', 'dish', 'grilli'];
    const isRestaurantRelated = restaurantKeywords.some(keyword => message.includes(keyword));
    
    if (!isRestaurantRelated) {
      return "I'm the Grilli Restaurant assistant, and I'm here to help you with information about our restaurant only. I can assist you with our menu, hours, reservations, contact information, and services. How can I help you with your dining experience at Grilli?";
    }
    
    // Generic restaurant response
    return "I'd be happy to help! You can ask me about:\n\n• Our menu and prices\n• Operating hours\n• Making reservations\n• Contact information\n• Special dishes\n\nWhat would you like to know?";
  }

  async getAIResponse(userMessage) {
    // FIRST: Check if user is responding "yes" to reservation
    if (this.checkReservationContext(userMessage)) {
      console.log('📅 Reservation context detected');
      this.currentContext = 'reservation';
      return `Great! I'd be happy to help you make a reservation. Here's what you can do:

**Option 1:** Fill out our online reservation form (I can open it for you)
**Option 2:** Call us directly at ${CHATBOT_CONFIG.restaurantInfo.phone[0]}
**Option 3:** Email us at ${CHATBOT_CONFIG.restaurantInfo.email[0]}

Would you like me to open the reservation form for you?`;
    }
    
    // SECOND: Check if question is irrelevant - handle immediately
    if (this.isIrrelevantQuestion(userMessage)) {
      console.log('🚫 Irrelevant question detected, redirecting...');
      return "I'm the Grilli Restaurant assistant, and I'm here to help you with information about our restaurant only. I can assist you with our menu, hours, reservations, contact information, and services. How can I help you with your dining experience at Grilli?";
    }
    
    // Check if API should be used
    if (!CHATBOT_CONFIG.useAPI) {
      console.log('🤖 Using rule-based response (API disabled)');
      return this.getRuleBasedResponse(userMessage);
    }

    // Try API first, fallback to rule-based
    try {
      console.log('🚀 Attempting Gemini API call...');
      
      // Build conversation context (keep last 10 messages for context)
      const conversationContext = this.conversationHistory.slice(-10);
      
      // Build the full prompt with system instructions and conversation history
      let fullPrompt = SYSTEM_PROMPT;
      
      if (conversationContext.length > 0) {
        fullPrompt += '\n\n=== CONVERSATION HISTORY ===\n';
        conversationContext.forEach(msg => {
          const role = msg.role === 'user' ? 'User' : 'Assistant';
          fullPrompt += `${role}: ${msg.parts[0].text}\n`;
        });
      }
      
      fullPrompt += `\n=== CURRENT USER MESSAGE ===\nUser: ${userMessage}\n\n=== YOUR RESPONSE ===\nAssistant:`;

      // Prepare request for Gemini API
      const requestBody = {
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      console.log('📤 Sending request to Gemini API...');
      
      const apiUrl = `${CHATBOT_CONFIG.apiUrl}?key=${CHATBOT_CONFIG.apiKey}`;
      console.log('🔗 API URL:', apiUrl.replace(CHATBOT_CONFIG.apiKey, 'API_KEY_HIDDEN'));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        // Check for CORS error
        if (errorData.error && errorData.error.message) {
          console.error('❌ Error message:', errorData.error.message);
        }
        
        // Fallback to rule-based
        console.log('🔄 Falling back to rule-based response');
        return this.getRuleBasedResponse(userMessage);
      }

      const data = await response.json();
      console.log('✅ API Response received:', data);
      
      // Handle different possible response structures
      if (data.candidates && data.candidates[0]) {
        const candidate = data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
          let aiResponse = candidate.content.parts[0].text.trim();
          
          // Double-check: If AI response seems irrelevant, override it
          if (this.isIrrelevantQuestion(aiResponse) || !this.isRestaurantRelated(aiResponse)) {
            console.log('⚠️ AI response seems irrelevant, using redirect');
            aiResponse = "I'm the Grilli Restaurant assistant, and I'm here to help you with information about our restaurant only. I can assist you with our menu, hours, reservations, contact information, and services. How can I help you with your dining experience at Grilli?";
          } else {
            // Check if menu items are mentioned - scroll to menu
            const messageLower = userMessage.toLowerCase();
            const menuItemNames = CHATBOT_CONFIG.restaurantInfo.menu.map(item => item.name.toLowerCase());
            const mentionsMenuItem = menuItemNames.some(itemName => messageLower.includes(itemName));
            
            if (mentionsMenuItem || messageLower.includes('menu') || messageLower.includes('dish')) {
              setTimeout(() => this.scrollToMenuSection(), 500);
            }
            
            // Check if reservation is mentioned - add button
            if (aiResponse.toLowerCase().includes('reservation') || 
                aiResponse.toLowerCase().includes('book a table') ||
                aiResponse.toLowerCase().includes('make a reservation')) {
              setTimeout(() => this.addReservationButton(), 100);
            }
          }
          
          console.log('✨ Using Gemini AI response');
          return aiResponse;
        }
      }
      
      console.log('⚠️ Invalid API response format, falling back to rule-based');
      // Fallback to rule-based if API response is invalid
      return this.getRuleBasedResponse(userMessage);
      
    } catch (error) {
      console.error('❌ Chatbot API Error:', error);
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      
      // Check if it's a CORS error
      if (error.message.includes('CORS') || error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        console.error('🚫 CORS Error Detected! The API cannot be called directly from the browser.');
        console.log('💡 Solution: Use a local server (http://localhost) or a backend proxy');
      }
      
      // Always fallback to rule-based responses
      console.log('🔄 Falling back to rule-based response');
      return this.getRuleBasedResponse(userMessage);
    }
  }

}

// Initialize chatbot when DOM is loaded
let chatbot;

document.addEventListener('DOMContentLoaded', () => {
  chatbot = new RestaurantChatbot();
  // Make chatbot accessible globally for button clicks
  window.chatbot = chatbot;
});
