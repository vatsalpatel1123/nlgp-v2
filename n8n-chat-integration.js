// Professional n8n Chat Widget Integration
// Connects chat widget directly to n8n workflow for AI responses
// Works across all pages with smartphone-like iMessage UI
//
// WEBHOOK RESPONSE HANDLING FIXES:
// - Supports both JSON and text responses from n8n
// - Multiple response field compatibility (response, message, aiReply, etc.)
// - Robust error handling with retry logic
// - Debug mode for troubleshooting webhook issues

(function() {
    'use strict';

    // Prevent multiple instances
    if (window.N8nChatIntegration) {
        return;
    }

    window.N8nChatIntegration = {
        loaded: true,
        version: '1.0.0'
    };

    // n8n Webhook Configuration
    const N8N_CONFIG = {
        webhookUrl: 'https://n8n.srv791889.hstgr.cloud/webhook/a8205c39-11e6-4be8-a95f-6f9ad5df6a25', // Replace with your actual n8n webhook URL
        timeout: 10000, // 10 seconds timeout
        retryAttempts: 3,
        debugMode: true // Set to false in production
    };

    // Professional CSS for smartphone-like iMessage UI
    const smartphoneStyles = `
        /* Enhanced Smartphone iMessage-like Chat Widget */
        .n8n-chat-container {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 999999 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
        }

        .n8n-chat-button {
            width: 64px !important;
            height: 64px !important;
            background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%) !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            box-shadow: 0 8px 32px rgba(0, 122, 255, 0.3) !important;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            border: none !important;
            position: relative !important;
        }

        .n8n-chat-button:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 12px 40px rgba(0, 122, 255, 0.4) !important;
        }

        .n8n-chat-button:active {
            transform: scale(0.95) !important;
        }

        .n8n-chat-icon {
            color: white !important;
            font-size: 26px !important;
            transition: transform 0.3s ease !important;
        }

        .n8n-chat-notification {
            position: absolute !important;
            top: -6px !important;
            right: -6px !important;
            background: #FF3B30 !important;
            color: white !important;
            border-radius: 50% !important;
            width: 22px !important;
            height: 22px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            border: 2px solid white !important;
            animation: pulse-notification 2s infinite !important;
        }

        @keyframes pulse-notification {
            0%, 100% { transform: scale(1) !important; }
            50% { transform: scale(1.1) !important; }
        }

        .n8n-chat-popup {
            position: absolute !important;
            bottom: 80px !important;
            right: 0 !important;
            width: 375px !important;
            height: 600px !important;
            background: #FFFFFF !important;
            border-radius: 24px !important;
            box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2) !important;
            border: 1px solid rgba(0, 0, 0, 0.05) !important;
            display: none !important;
            flex-direction: column !important;
            overflow: hidden !important;
            transform: scale(0.85) translateY(20px) !important;
            opacity: 0 !important;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            backdrop-filter: blur(20px) !important;
        }

        .n8n-chat-popup.show {
            display: flex !important;
            transform: scale(1) translateY(0) !important;
            opacity: 1 !important;
        }

        .n8n-chat-header {
            background: linear-gradient(180deg, #F7F7F7 0%, #EFEFEF 100%) !important;
            color: #000000 !important;
            padding: 20px 20px 16px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
            backdrop-filter: blur(20px) !important;
        }

        .n8n-chat-header-info {
            display: flex !important;
            align-items: center !important;
            flex: 1 !important;
        }

        .n8n-chat-avatar {
            width: 44px !important;
            height: 44px !important;
            background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%) !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin-right: 12px !important;
            font-size: 20px !important;
            color: white !important;
            box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3) !important;
        }

        .n8n-chat-header-text {
            flex: 1 !important;
        }

        .n8n-chat-header-title {
            font-size: 17px !important;
            font-weight: 600 !important;
            margin-bottom: 2px !important;
            color: #000000 !important;
            letter-spacing: -0.4px !important;
        }

        .n8n-chat-header-status {
            font-size: 13px !important;
            color: #007AFF !important;
            font-weight: 500 !important;
            display: flex !important;
            align-items: center !important;
        }

        .n8n-chat-header-status::before {
            content: '●' !important;
            color: #34C759 !important;
            margin-right: 6px !important;
            font-size: 12px !important;
        }

        .n8n-chat-close-btn {
            background: none !important;
            border: none !important;
            color: #007AFF !important;
            font-size: 18px !important;
            cursor: pointer !important;
            padding: 8px !important;
            border-radius: 50% !important;
            transition: all 0.2s ease !important;
            width: 36px !important;
            height: 36px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .n8n-chat-close-btn:hover {
            background: rgba(0, 122, 255, 0.1) !important;
        }

        .n8n-chat-messages {
            flex: 1 !important;
            padding: 16px !important;
            overflow-y: auto !important;
            background: #FFFFFF !important;
            scroll-behavior: smooth !important;
        }

        .n8n-chat-messages::-webkit-scrollbar {
            width: 0px !important;
            background: transparent !important;
        }

        .n8n-chat-message {
            display: flex !important;
            margin-bottom: 12px !important;
            animation: slideInMessage 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        }

        .n8n-chat-message.sent {
            flex-direction: row-reverse !important;
        }

        .n8n-chat-message-bubble {
            max-width: 75% !important;
            padding: 12px 16px !important;
            border-radius: 20px !important;
            font-size: 16px !important;
            line-height: 1.4 !important;
            word-wrap: break-word !important;
            position: relative !important;
        }

        .n8n-chat-message.received .n8n-chat-message-bubble {
            background: #E9E9EB !important;
            color: #000000 !important;
            border-bottom-left-radius: 6px !important;
            margin-right: auto !important;
        }

        .n8n-chat-message.sent .n8n-chat-message-bubble {
            background: #007AFF !important;
            color: white !important;
            border-bottom-right-radius: 6px !important;
            margin-left: auto !important;
        }

        .n8n-chat-message-time {
            font-size: 12px !important;
            color: #8E8E93 !important;
            margin-top: 4px !important;
            text-align: center !important;
        }

        @keyframes slideInMessage {
            from {
                opacity: 0 !important;
                transform: translateY(10px) scale(0.95) !important;
            }
            to {
                opacity: 1 !important;
                transform: translateY(0) scale(1) !important;
            }
        }

        .n8n-chat-typing {
            padding: 0 16px 12px !important;
            background: #FFFFFF !important;
            display: none !important;
        }

        .n8n-chat-typing.show {
            display: block !important;
        }

        .n8n-chat-typing-bubble {
            background: #E9E9EB !important;
            border-radius: 20px !important;
            border-bottom-left-radius: 6px !important;
            padding: 12px 16px !important;
            width: fit-content !important;
            display: flex !important;
            align-items: center !important;
        }

        .n8n-chat-typing-dots {
            display: flex !important;
            gap: 4px !important;
        }

        .n8n-chat-typing-dots span {
            width: 8px !important;
            height: 8px !important;
            background: #8E8E93 !important;
            border-radius: 50% !important;
            animation: typing-dots 1.4s infinite ease-in-out !important;
        }

        .n8n-chat-typing-dots span:nth-child(2) {
            animation-delay: 0.2s !important;
        }

        .n8n-chat-typing-dots span:nth-child(3) {
            animation-delay: 0.4s !important;
        }

        @keyframes typing-dots {
            0%, 60%, 100% {
                transform: scale(0.8) !important;
                opacity: 0.5 !important;
            }
            30% {
                transform: scale(1.2) !important;
                opacity: 1 !important;
            }
        }

        .n8n-chat-input-container {
            padding: 12px 16px 20px !important;
            background: #FFFFFF !important;
            border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
        }

        .n8n-chat-input-wrapper {
            background: #F2F2F7 !important;
            border-radius: 24px !important;
            padding: 8px 16px !important;
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            border: 1px solid transparent !important;
            transition: all 0.2s ease !important;
        }

        .n8n-chat-input-wrapper:focus-within {
            border-color: #007AFF !important;
            background: #FFFFFF !important;
            box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1) !important;
        }

        .n8n-chat-input {
            flex: 1 !important;
            border: none !important;
            background: transparent !important;
            color: #000000 !important;
            font-size: 16px !important;
            outline: none !important;
            font-family: inherit !important;
            padding: 8px 0 !important;
            line-height: 1.4 !important;
        }

        .n8n-chat-input::placeholder {
            color: #8E8E93 !important;
        }

        .n8n-chat-send-btn {
            background: #007AFF !important;
            color: white !important;
            border: none !important;
            border-radius: 50% !important;
            width: 32px !important;
            height: 32px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            font-size: 14px !important;
            transition: all 0.2s ease !important;
            opacity: 0.5 !important;
            transform: scale(0.8) !important;
        }

        .n8n-chat-send-btn:not(:disabled) {
            opacity: 1 !important;
            transform: scale(1) !important;
        }

        .n8n-chat-send-btn:not(:disabled):hover {
            background: #0051D5 !important;
            transform: scale(1.05) !important;
        }

        .n8n-chat-send-btn:not(:disabled):active {
            transform: scale(0.95) !important;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .n8n-chat-container {
                bottom: 16px !important;
                right: 16px !important;
            }

            .n8n-chat-popup {
                width: calc(100vw - 32px) !important;
                height: 70vh !important;
                bottom: 80px !important;
                right: -8px !important;
            }

            .n8n-chat-button {
                width: 56px !important;
                height: 56px !important;
            }

            .n8n-chat-icon {
                font-size: 24px !important;
            }
        }

        @media (max-width: 480px) {
            .n8n-chat-popup {
                width: calc(100vw - 16px) !important;
                height: 75vh !important;
                bottom: 72px !important;
                right: -8px !important;
            }
        }
    `;

    // Inject styles
    function injectStyles() {
        const existingStyles = document.querySelectorAll('style[data-n8n-chat]');
        existingStyles.forEach(style => style.remove());

        const styleSheet = document.createElement('style');
        styleSheet.setAttribute('data-n8n-chat', 'integration');
        styleSheet.textContent = smartphoneStyles;
        document.head.appendChild(styleSheet);
    }

    // Professional n8n API integration with robust response handling
    async function sendToN8n(message, userContext = {}) {
        try {
            const payload = {
                message: message,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                sessionId: getSessionId(),
                ...userContext
            };

            if (N8N_CONFIG.debugMode) {
                console.log('Sending to n8n:', payload);
            }

            const response = await fetch(N8N_CONFIG.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(N8N_CONFIG.timeout)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Handle both text and JSON responses from n8n
            const contentType = response.headers.get('content-type');
            let responseData;

            if (contentType && contentType.includes('application/json')) {
                // Handle JSON response
                responseData = await response.json();
                if (N8N_CONFIG.debugMode) {
                    console.log('n8n JSON response:', responseData);
                }

                // Try multiple possible response fields for compatibility
                const aiResponse = responseData.response ||
                                 responseData.message ||
                                 responseData.aiReply ||
                                 responseData.reply ||
                                 responseData.text ||
                                 responseData.content;

                if (aiResponse) {
                    return aiResponse;
                }

                // If no recognized field, try to extract any string value
                const stringValues = Object.values(responseData).filter(val => typeof val === 'string');
                if (stringValues.length > 0) {
                    return stringValues[0];
                }

                return "Thank you for your message! I'll get back to you shortly.";
            } else {
                // Handle text response
                responseData = await response.text();
                if (N8N_CONFIG.debugMode) {
                    console.log('n8n text response:', responseData);
                }

                // Clean up the text response
                const cleanResponse = responseData.trim();

                if (cleanResponse && cleanResponse.length > 0) {
                    // Check if it's JSON wrapped in text
                    try {
                        const parsedJson = JSON.parse(cleanResponse);
                        const aiResponse = parsedJson.response ||
                                         parsedJson.message ||
                                         parsedJson.aiReply ||
                                         parsedJson.reply ||
                                         parsedJson.text ||
                                         parsedJson.content;

                        if (aiResponse) {
                            return aiResponse;
                        }
                    } catch (e) {
                        // Not JSON, treat as plain text
                    }

                    return cleanResponse;
                }

                return "Thank you for your message! I'll get back to you shortly.";
            }
        } catch (error) {
            console.error('n8n Integration Error:', error);

            // Provide more specific error messages based on error type
            if (error.name === 'AbortError') {
                return "The request timed out. Please try again.";
            } else if (error.message.includes('HTTP error')) {
                return "I'm having trouble connecting to the server. Please try again in a moment.";
            } else if (error.message.includes('Failed to fetch')) {
                return "Network connection issue. Please check your internet connection and try again.";
            } else {
                return "I'm experiencing some technical difficulties. Please try again in a moment.";
            }
        }
    }

    // Session management
    function getSessionId() {
        let sessionId = sessionStorage.getItem('n8n-chat-session');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
            sessionStorage.setItem('n8n-chat-session', sessionId);
        }
        return sessionId;
    }

    // Validate n8n configuration
    function validateN8nConfig() {
        const issues = [];

        if (!N8N_CONFIG.webhookUrl || N8N_CONFIG.webhookUrl === 'YOUR_N8N_WEBHOOK_URL_HERE') {
            issues.push('Webhook URL not configured');
        }

        if (!N8N_CONFIG.webhookUrl.startsWith('http')) {
            issues.push('Invalid webhook URL format');
        }

        if (issues.length > 0) {
            console.warn('n8n Configuration Issues:', issues);
            return false;
        }

        if (N8N_CONFIG.debugMode) {
            console.log('n8n Configuration validated successfully');
        }
        return true;
    }

    // Professional HTML template
    const chatWidgetHTML = `
        <div class="n8n-chat-container">
            <div class="n8n-chat-button" id="n8nChatButton">
                <div class="n8n-chat-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <div class="n8n-chat-notification" id="n8nChatNotification">1</div>
            </div>

            <div class="n8n-chat-popup" id="n8nChatPopup">
                <div class="n8n-chat-header">
                    <div class="n8n-chat-header-info">
                        <div class="n8n-chat-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="n8n-chat-header-text">
                            <div class="n8n-chat-header-title">Bella AI</div>
                            <div class="n8n-chat-header-status">Online</div>
                        </div>
                    </div>
                    <button class="n8n-chat-close-btn" id="n8nChatClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="n8n-chat-messages" id="n8nChatMessages">
                    <!-- Messages will be populated by n8n workflow -->
                </div>

                <div class="n8n-chat-typing" id="n8nChatTyping">
                    <div class="n8n-chat-typing-bubble">
                        <div class="n8n-chat-typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>

                <div class="n8n-chat-input-container">
                    <div class="n8n-chat-input-wrapper">
                        <input type="text" class="n8n-chat-input" id="n8nChatInput" placeholder="Message Bella AI...">
                        <button class="n8n-chat-send-btn" id="n8nChatSend" disabled>
                            <i class="fas fa-arrow-up"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize chat widget
    async function initN8nChatWidget() {
        try {
            // Validate n8n configuration first
            if (!validateN8nConfig()) {
                console.error('n8n Chat Widget: Configuration validation failed');
                // Still initialize the widget but show a warning
            }

            // Ensure FontAwesome is loaded
            if (!document.querySelector('link[href*="font-awesome"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            }

            // Remove existing widgets
            const existingWidgets = document.querySelectorAll('[data-n8n-chat="widget"]');
            existingWidgets.forEach(widget => widget.remove());

            // Inject styles
            injectStyles();

            // Create widget
            const widgetContainer = document.createElement('div');
            widgetContainer.setAttribute('data-n8n-chat', 'widget');
            widgetContainer.innerHTML = chatWidgetHTML;
            document.body.appendChild(widgetContainer);

            // Initialize functionality
            setupChatFunctionality();

            console.log('n8n Chat Widget: Successfully initialized');
        } catch (error) {
            console.error('n8n Chat Widget: Initialization failed', error);
        }
    }

    // Setup chat functionality
    function setupChatFunctionality() {
        const chatButton = document.getElementById('n8nChatButton');
        const chatPopup = document.getElementById('n8nChatPopup');
        const chatClose = document.getElementById('n8nChatClose');
        const chatNotification = document.getElementById('n8nChatNotification');
        const chatInput = document.getElementById('n8nChatInput');
        const chatSend = document.getElementById('n8nChatSend');
        const chatMessages = document.getElementById('n8nChatMessages');
        const chatTyping = document.getElementById('n8nChatTyping');

        if (!chatButton || !chatPopup) {
            console.error('n8n Chat Widget: Required elements not found');
            return;
        }

        let isOpen = false;

        // Toggle chat
        function toggleChat() {
            isOpen = !isOpen;
            if (isOpen) {
                chatPopup.classList.add('show');
                if (chatNotification) chatNotification.style.display = 'none';
                setTimeout(() => {
                    if (chatInput) chatInput.focus();
                }, 400);
            } else {
                chatPopup.classList.remove('show');
            }
        }

        // Event listeners
        chatButton.addEventListener('click', toggleChat);
        if (chatClose) chatClose.addEventListener('click', toggleChat);

        // Close on outside click
        document.addEventListener('click', function(e) {
            if (isOpen && !chatPopup.contains(e.target) && !chatButton.contains(e.target)) {
                toggleChat();
            }
        });

        // Input handling
        if (chatInput && chatSend) {
            chatInput.addEventListener('input', function() {
                chatSend.disabled = this.value.trim() === '';
            });

            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !chatSend.disabled) {
                    sendMessage();
                }
            });

            chatSend.addEventListener('click', function() {
                if (!this.disabled) {
                    sendMessage();
                }
            });
        }

        // Send message to n8n with retry logic
        async function sendMessage() {
            if (!chatInput || !chatMessages) return;

            const message = chatInput.value.trim();
            if (!message) return;

            // Add user message
            addMessage(message, 'sent');
            chatInput.value = '';
            chatSend.disabled = true;

            // Show typing indicator
            showTyping();

            let retryCount = 0;
            const maxRetries = N8N_CONFIG.retryAttempts || 3;

            async function attemptSend() {
                try {
                    // Send to n8n workflow
                    const response = await sendToN8n(message);

                    // Hide typing and show response
                    hideTyping();
                    addMessage(response, 'received');

                    // Re-enable input
                    chatSend.disabled = false;
                } catch (error) {
                    console.error(`Send attempt ${retryCount + 1} failed:`, error);

                    if (retryCount < maxRetries - 1) {
                        retryCount++;
                        console.log(`Retrying... (${retryCount}/${maxRetries})`);

                        // Wait before retry (exponential backoff)
                        const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 5000);
                        setTimeout(attemptSend, delay);
                    } else {
                        // All retries failed
                        hideTyping();
                        addMessage("I'm having trouble connecting right now. Please try again.", 'received');
                        chatSend.disabled = false;
                    }
                }
            }

            // Start the first attempt
            attemptSend();
        }

        // Add message to chat
        function addMessage(text, type) {
            if (!chatMessages) return;

            const messageDiv = document.createElement('div');
            messageDiv.className = `n8n-chat-message ${type}`;

            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'n8n-chat-message-bubble';
            bubbleDiv.textContent = text;

            messageDiv.appendChild(bubbleDiv);
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Show typing indicator
        function showTyping() {
            if (chatTyping) {
                chatTyping.classList.add('show');
                if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }

        // Hide typing indicator
        function hideTyping() {
            if (chatTyping) {
                chatTyping.classList.remove('show');
            }
        }

        // Send welcome message from Bella when chat widget is initialized
        setTimeout(() => {
            addMessage("Welcome, this is Bella your AI assistant, how can I help you today?", 'received');
        }, 500);

        // Show notification after delay
        setTimeout(() => {
            if (!isOpen && chatNotification) {
                chatNotification.style.display = 'flex';
            }
        }, 5000);

        // Global API for external integration
        window.N8nChatAPI = {
            open: () => { if (!isOpen) toggleChat(); },
            close: () => { if (isOpen) toggleChat(); },
            sendMessage: (msg) => {
                if (chatInput) {
                    chatInput.value = msg;
                    sendMessage();
                }
            },
            isOpen: () => isOpen
        };
    }

    // Initialize when DOM is ready
    function initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initN8nChatWidget);
        } else {
            initN8nChatWidget();
        }
    }

    // Start initialization
    initialize();

    // Fallback initialization
    setTimeout(initN8nChatWidget, 2000);

})();
