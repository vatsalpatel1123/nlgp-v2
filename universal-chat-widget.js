// Professional Enterprise Chat Widget
// Automatically loads on all pages with zero conflicts

(function() {
    'use strict';

    // Prevent multiple instances
    if (window.ProfessionalChatWidget) {
        return;
    }

    window.ProfessionalChatWidget = {
        loaded: true,
        version: '2.0.0'
    };

    // Force load FontAwesome if not present
    function ensureFontAwesome() {
        return new Promise((resolve) => {
            if (document.querySelector('link[href*="font-awesome"]') || window.FontAwesome) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            link.crossOrigin = 'anonymous';
            link.onload = resolve;
            link.onerror = resolve; // Continue even if FA fails
            document.head.appendChild(link);

            // Fallback timeout
            setTimeout(resolve, 2000);
        });
    }

    // Inject CSS styles
    const styles = `
        /* Chat Widget Styles */
        .chat-widget-container {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 999999 !important;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }

        .chat-widget-button {
            width: 60px !important;
            height: 60px !important;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%) !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            box-shadow: 0 8px 25px rgba(30, 60, 114, 0.3) !important;
            transition: all 0.3s ease !important;
            position: relative !important;
            animation: pulse-widget 2s infinite !important;
            border: none !important;
        }

        .chat-widget-button:hover {
            transform: scale(1.1) !important;
            box-shadow: 0 12px 35px rgba(30, 60, 114, 0.4) !important;
        }

        .chat-widget-icon {
            color: white !important;
            font-size: 24px !important;
        }

        .chat-widget-notification {
            position: absolute !important;
            top: -5px !important;
            right: -5px !important;
            background: #ef4444 !important;
            color: white !important;
            border-radius: 50% !important;
            width: 20px !important;
            height: 20px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            animation: bounce-notification 1s infinite !important;
        }

        @keyframes pulse-widget {
            0%, 100% { 
                box-shadow: 0 8px 25px rgba(30, 60, 114, 0.3), 0 0 0 0 rgba(30, 60, 114, 0.7) !important; 
            }
            50% { 
                box-shadow: 0 12px 35px rgba(30, 60, 114, 0.4), 0 0 0 10px rgba(30, 60, 114, 0) !important; 
            }
        }

        @keyframes bounce-notification {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0) !important; }
            40% { transform: translateY(-3px) !important; }
            60% { transform: translateY(-1px) !important; }
        }

        .chat-widget-popup {
            position: absolute !important;
            bottom: 80px !important;
            right: 0 !important;
            width: 350px !important;
            height: 500px !important;
            background: white !important;
            border-radius: 20px !important;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            display: none !important;
            flex-direction: column !important;
            overflow: hidden !important;
            transform: scale(0.8) translateY(20px) !important;
            opacity: 0 !important;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        }

        .chat-widget-popup.show {
            display: flex !important;
            transform: scale(1) translateY(0) !important;
            opacity: 1 !important;
        }

        .chat-widget-header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%) !important;
            color: white !important;
            padding: 20px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
        }

        .chat-header-info {
            display: flex !important;
            align-items: center !important;
        }

        .chat-avatar {
            width: 40px !important;
            height: 40px !important;
            background: rgba(255, 255, 255, 0.2) !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin-right: 12px !important;
            font-size: 18px !important;
            color: white !important;
        }

        .chat-header-title {
            font-size: 16px !important;
            font-weight: 600 !important;
            margin-bottom: 2px !important;
            color: white !important;
        }

        .chat-header-status {
            font-size: 12px !important;
            opacity: 0.9 !important;
            color: white !important;
        }

        .chat-close-btn {
            background: none !important;
            border: none !important;
            color: white !important;
            font-size: 18px !important;
            cursor: pointer !important;
            padding: 5px !important;
            border-radius: 50% !important;
            transition: background 0.2s ease !important;
        }

        .chat-close-btn:hover {
            background: rgba(255, 255, 255, 0.1) !important;
        }

        .chat-widget-messages {
            flex: 1 !important;
            padding: 20px !important;
            overflow-y: auto !important;
            background: #f8fafc !important;
        }

        .chat-widget-messages::-webkit-scrollbar {
            width: 4px !important;
        }

        .chat-widget-messages::-webkit-scrollbar-track {
            background: #f1f1f1 !important;
        }

        .chat-widget-messages::-webkit-scrollbar-thumb {
            background: #c1c1c1 !important;
            border-radius: 2px !important;
        }

        .chat-message {
            display: flex !important;
            margin-bottom: 15px !important;
            animation: slideInMessage 0.3s ease-out !important;
        }

        .chat-message.sent {
            flex-direction: row-reverse !important;
        }

        .chat-message-avatar {
            width: 32px !important;
            height: 32px !important;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%) !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: white !important;
            font-size: 14px !important;
            margin-right: 10px !important;
            flex-shrink: 0 !important;
        }

        .chat-message.sent .chat-message-avatar {
            background: #e5e7eb !important;
            color: #6b7280 !important;
            margin-right: 0 !important;
            margin-left: 10px !important;
        }

        .chat-message-bubble {
            max-width: 70% !important;
            padding: 12px 16px !important;
            border-radius: 18px !important;
            font-size: 14px !important;
            line-height: 1.4 !important;
            word-wrap: break-word !important;
        }

        .chat-message.received .chat-message-bubble {
            background: white !important;
            color: #1a1a1a !important;
            border-bottom-left-radius: 6px !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }

        .chat-message.sent .chat-message-bubble {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%) !important;
            color: white !important;
            border-bottom-right-radius: 6px !important;
        }

        @keyframes slideInMessage {
            from {
                opacity: 0 !important;
                transform: translateY(10px) !important;
            }
            to {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        }

        .chat-typing-indicator {
            padding: 0 20px 10px !important;
            background: #f8fafc !important;
            display: none !important;
        }

        .chat-typing-indicator.show {
            display: block !important;
        }

        .chat-typing-dots {
            display: flex !important;
            align-items: center !important;
            padding: 12px 16px !important;
            background: white !important;
            border-radius: 18px !important;
            border-bottom-left-radius: 6px !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
            width: fit-content !important;
        }

        .chat-typing-dots span {
            width: 8px !important;
            height: 8px !important;
            background: #9ca3af !important;
            border-radius: 50% !important;
            margin: 0 2px !important;
            animation: typing-dots 1.4s infinite ease-in-out !important;
        }

        .chat-typing-dots span:nth-child(2) {
            animation-delay: 0.2s !important;
        }

        .chat-typing-dots span:nth-child(3) {
            animation-delay: 0.4s !important;
        }

        @keyframes typing-dots {
            0%, 60%, 100% {
                transform: scale(1) !important;
                opacity: 0.5 !important;
            }
            30% {
                transform: scale(1.2) !important;
                opacity: 1 !important;
            }
        }

        .chat-widget-input {
            padding: 20px !important;
            background: white !important;
            border-top: 1px solid #e5e7eb !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
        }

        .chat-input-container {
            flex: 1 !important;
            background: #f3f4f6 !important;
            border-radius: 25px !important;
            padding: 12px 16px !important;
            display: flex !important;
            align-items: center !important;
        }

        .chat-input-field {
            flex: 1 !important;
            border: none !important;
            background: transparent !important;
            color: #1a1a1a !important;
            font-size: 14px !important;
            outline: none !important;
            font-family: inherit !important;
        }

        .chat-input-field::placeholder {
            color: #6b7280 !important;
        }

        .chat-send-btn {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 50% !important;
            width: 40px !important;
            height: 40px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            font-size: 16px !important;
            transition: all 0.2s ease !important;
            box-shadow: 0 4px 12px rgba(30, 60, 114, 0.3) !important;
        }

        .chat-send-btn:hover:not(:disabled) {
            transform: scale(1.05) !important;
            box-shadow: 0 6px 16px rgba(30, 60, 114, 0.4) !important;
        }

        .chat-send-btn:disabled {
            opacity: 0.5 !important;
            cursor: not-allowed !important;
            transform: none !important;
        }
    `;

    // Professional CSS injection with conflict prevention
    function injectStyles() {
        // Remove any existing chat widget styles
        const existingStyles = document.querySelectorAll('style[data-chat-widget]');
        existingStyles.forEach(style => style.remove());

        const styleSheet = document.createElement('style');
        styleSheet.setAttribute('data-chat-widget', 'professional');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Add mobile responsive styles
    const mobileStyles = `
        /* Mobile Responsive */
        @media (max-width: 768px) {
            .chat-widget-container {
                bottom: 15px !important;
                right: 15px !important;
            }

            .chat-widget-popup {
                width: 320px !important;
                height: 450px !important;
                bottom: 75px !important;
            }

            .chat-widget-button {
                width: 55px !important;
                height: 55px !important;
            }

            .chat-widget-icon {
                font-size: 22px !important;
            }

            .chat-header-title {
                font-size: 15px !important;
            }

            .chat-header-status {
                font-size: 11px !important;
            }

            .chat-message-bubble {
                font-size: 13px !important;
                padding: 10px 14px !important;
            }

            .chat-input-field {
                font-size: 14px !important;
            }
        }

        @media (max-width: 480px) {
            .chat-widget-popup {
                width: calc(100vw - 20px) !important;
                right: -10px !important;
                height: 420px !important;
                bottom: 70px !important;
            }

            .chat-widget-button {
                width: 50px !important;
                height: 50px !important;
            }

            .chat-widget-icon {
                font-size: 20px !important;
            }

            .chat-widget-notification {
                width: 18px !important;
                height: 18px !important;
                font-size: 11px !important;
                top: -3px !important;
                right: -3px !important;
            }

            .chat-widget-header {
                padding: 15px !important;
            }

            .chat-avatar {
                width: 35px !important;
                height: 35px !important;
                font-size: 16px !important;
                margin-right: 10px !important;
            }

            .chat-message-avatar {
                width: 28px !important;
                height: 28px !important;
                font-size: 12px !important;
                margin-right: 8px !important;
            }

            .chat-message.sent .chat-message-avatar {
                margin-left: 8px !important;
                margin-right: 0 !important;
            }

            .chat-widget-input {
                padding: 15px !important;
            }

            .chat-send-btn {
                width: 35px !important;
                height: 35px !important;
                font-size: 14px !important;
            }
        }

        /* Ensure icons are always visible */
        .chat-widget-icon i,
        .chat-avatar i,
        .chat-message-avatar i,
        .chat-close-btn i,
        .chat-send-btn i {
            display: inline-block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }

        /* Force FontAwesome to load */
        .fas, .fa {
            font-family: "Font Awesome 6 Free" !important;
            font-weight: 900 !important;
        }
    `;

    const mobileStyleSheet = document.createElement('style');
    mobileStyleSheet.textContent = mobileStyles;
    document.head.appendChild(mobileStyleSheet);

    // Professional HTML template with unique IDs
    const chatWidgetHTML = `
        <div class="chat-widget-container">
            <!-- Chat Widget Button -->
            <div class="chat-widget-button" id="professionalChatButton">
                <div class="chat-widget-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <div class="chat-widget-notification" id="professionalChatNotification">1</div>
            </div>

            <!-- Chat Widget Popup -->
            <div class="chat-widget-popup" id="professionalChatPopup">
                <div class="chat-widget-header">
                    <div class="chat-header-info">
                        <div class="chat-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="chat-header-text">
                            <div class="chat-header-title">Bella AI</div>
                            <div class="chat-header-status">AI Assistant • Online</div>
                        </div>
                    </div>
                    <button class="chat-close-btn" id="professionalChatClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="chat-widget-messages" id="professionalChatMessages">
                    <!-- Messages will be added dynamically -->
                </div>

                <div class="chat-typing-indicator" id="professionalChatTyping">
                    <div class="chat-typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <div class="chat-widget-input">
                    <div class="chat-input-container">
                        <input type="text" class="chat-input-field" id="professionalChatInput" placeholder="Type your message...">
                    </div>
                    <button class="chat-send-btn" id="professionalChatSend" disabled>
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Professional widget initialization
    async function initChatWidget() {
        try {
            // Ensure FontAwesome is loaded
            await ensureFontAwesome();

            // Remove any existing chat widgets
            const existingWidgets = document.querySelectorAll('[data-chat-widget="professional"]');
            existingWidgets.forEach(widget => widget.remove());

            // Inject styles
            injectStyles();

            // Create widget container with unique identifier
            const widgetContainer = document.createElement('div');
            widgetContainer.setAttribute('data-chat-widget', 'professional');
            widgetContainer.innerHTML = chatWidgetHTML;
            document.body.appendChild(widgetContainer);

            // Initialize functionality with error handling
            const chatWidgetButton = document.getElementById('professionalChatButton');
            const chatWidgetPopup = document.getElementById('professionalChatPopup');
            const chatCloseBtn = document.getElementById('professionalChatClose');
            const chatNotification = document.getElementById('professionalChatNotification');
            const chatInputField = document.getElementById('professionalChatInput');
            const chatSendBtn = document.getElementById('professionalChatSend');
            const chatMessages = document.getElementById('professionalChatMessages');
            const typingIndicator = document.getElementById('professionalChatTyping');

            if (!chatWidgetButton || !chatWidgetPopup) {
                console.error('Professional Chat Widget: Failed to initialize - elements not found');
                return;
            }

            let isOpen = false;
            let messageCount = 0;

            // Professional toggle function
            function toggleChat() {
                try {
                    isOpen = !isOpen;
                    if (isOpen) {
                        chatWidgetPopup.classList.add('show');
                        if (chatNotification) chatNotification.style.display = 'none';
                        setTimeout(() => {
                            if (chatInputField) chatInputField.focus();
                        }, 300);
                    } else {
                        chatWidgetPopup.classList.remove('show');
                    }
                } catch (error) {
                    console.error('Professional Chat Widget: Toggle error', error);
                }
            }

            // Professional event listeners with error handling
            if (chatWidgetButton) {
                chatWidgetButton.addEventListener('click', toggleChat);
            }

            if (chatCloseBtn) {
                chatCloseBtn.addEventListener('click', toggleChat);
            }

            // Close chat when clicking outside
            document.addEventListener('click', function(e) {
                try {
                    if (isOpen && chatWidgetPopup && !chatWidgetPopup.contains(e.target) &&
                        chatWidgetButton && !chatWidgetButton.contains(e.target)) {
                        toggleChat();
                    }
                } catch (error) {
                    console.error('Professional Chat Widget: Outside click error', error);
                }
            });

            // Enable/disable send button based on input
            if (chatInputField && chatSendBtn) {
                chatInputField.addEventListener('input', function() {
                    try {
                        chatSendBtn.disabled = this.value.trim() === '';
                    } catch (error) {
                        console.error('Professional Chat Widget: Input error', error);
                    }
                });

                // Send message on Enter key
                chatInputField.addEventListener('keypress', function(e) {
                    try {
                        if (e.key === 'Enter' && !chatSendBtn.disabled) {
                            sendChatMessage();
                        }
                    } catch (error) {
                        console.error('Professional Chat Widget: Keypress error', error);
                    }
                });
            }

            // Send message on button click
            if (chatSendBtn) {
                chatSendBtn.addEventListener('click', function() {
                    try {
                        if (!this.disabled) {
                            sendChatMessage();
                        }
                    } catch (error) {
                        console.error('Professional Chat Widget: Send click error', error);
                    }
                });
            }

            function sendChatMessage() {
                try {
                    if (!chatInputField) return;

                    const message = chatInputField.value.trim();
                    if (!message) return;

                    messageCount++;

                    // Add user message to chat
                    addMessageToChat(message, 'sent');

                    // Clear input
                    chatInputField.value = '';
                    if (chatSendBtn) chatSendBtn.disabled = true;

                    // Show typing indicator
                    showTypingIndicator();

                    // Professional AI response simulation
                    setTimeout(() => {
                        hideTypingIndicator();
                        const responses = [
                            "Thanks for your message! I'm here to help you understand how AI can transform your business.",
                            "Great question! Let me connect you with the right information about our AI solutions.",
                            "I'd love to help you explore how our AI automation can boost your revenue.",
                            "Perfect! Let's discuss how we can implement AI in your specific business case."
                        ];
                        const response = responses[Math.min(messageCount - 1, responses.length - 1)];
                        addMessageToChat(response, 'received');
                    }, 1500 + Math.random() * 1000);
                } catch (error) {
                    console.error('Professional Chat Widget: Send message error', error);
                }
            }

            function addMessageToChat(message, type) {
                try {
                    if (!chatMessages) return;

                    const messageDiv = document.createElement('div');
                    messageDiv.className = `chat-message ${type}`;

                    const avatarDiv = document.createElement('div');
                    avatarDiv.className = 'chat-message-avatar';
                    avatarDiv.innerHTML = type === 'sent' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

                    const bubbleDiv = document.createElement('div');
                    bubbleDiv.className = 'chat-message-bubble';
                    bubbleDiv.textContent = message;

                    messageDiv.appendChild(avatarDiv);
                    messageDiv.appendChild(bubbleDiv);

                    chatMessages.appendChild(messageDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                } catch (error) {
                    console.error('Professional Chat Widget: Add message error', error);
                }
            }

            function showTypingIndicator() {
                try {
                    if (typingIndicator) {
                        typingIndicator.classList.add('show');
                        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
                    }
                } catch (error) {
                    console.error('Professional Chat Widget: Show typing error', error);
                }
            }

            function hideTypingIndicator() {
                try {
                    if (typingIndicator) {
                        typingIndicator.classList.remove('show');
                    }
                } catch (error) {
                    console.error('Professional Chat Widget: Hide typing error', error);
                }
            }

            // Send welcome message from Bella when chat widget is initialized
            setTimeout(() => {
                try {
                    console.log('Professional Chat Widget: Adding welcome message...');
                    addMessageToChat("Welcome, this is Bella your AI assistant, how can I help you today?", 'received');
                    console.log('Professional Chat Widget: Welcome message added successfully');
                } catch (error) {
                    console.error('Professional Chat Widget: Welcome message error', error);
                }
            }, 500);

            // Professional notification system
            setTimeout(() => {
                try {
                    if (!isOpen && chatNotification) {
                        chatNotification.style.display = 'flex';
                        chatNotification.style.animation = 'bounce-notification 1s infinite';
                    }
                } catch (error) {
                    console.error('Professional Chat Widget: Notification error', error);
                }
            }, 3000);

            // Professional global API for n8n integration
            window.ProfessionalChatAPI = {
                sendMessage: function(message) {
                    try {
                        if (chatInputField && message) {
                            chatInputField.value = message;
                            sendChatMessage();
                        }
                    } catch (error) {
                        console.error('Professional Chat Widget: API send error', error);
                    }
                },

                openChat: function() {
                    try {
                        if (!isOpen) toggleChat();
                    } catch (error) {
                        console.error('Professional Chat Widget: API open error', error);
                    }
                },

                closeChat: function() {
                    try {
                        if (isOpen) toggleChat();
                    } catch (error) {
                        console.error('Professional Chat Widget: API close error', error);
                    }
                },

                isOpen: function() {
                    return isOpen;
                }
            };

            // Legacy compatibility
            window.handleKeyPress = function(event) {
                try {
                    if (event.key === 'Enter' && chatSendBtn && !chatSendBtn.disabled) {
                        sendChatMessage();
                    }
                } catch (error) {
                    console.error('Professional Chat Widget: Legacy keypress error', error);
                }
            };

            window.sendMessage = function() {
                try {
                    if (chatSendBtn && !chatSendBtn.disabled) {
                        sendChatMessage();
                    }
                } catch (error) {
                    console.error('Professional Chat Widget: Legacy send error', error);
                }
            };

            console.log('Professional Chat Widget: Successfully initialized');
            console.log('Professional Chat Widget: Chat messages element:', chatMessages);

        } catch (error) {
            console.error('Professional Chat Widget: Initialization failed', error);
        }
    }

    // Professional initialization with multiple fallbacks
    function initializeWidget() {
        try {
            initChatWidget();
        } catch (error) {
            console.error('Professional Chat Widget: Failed to initialize', error);
            // Retry once after 1 second
            setTimeout(() => {
                try {
                    initChatWidget();
                } catch (retryError) {
                    console.error('Professional Chat Widget: Retry failed', retryError);
                }
            }, 1000);
        }
    }

    // Multiple initialization strategies
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWidget);
    } else if (document.readyState === 'interactive') {
        setTimeout(initializeWidget, 100);
    } else {
        initializeWidget();
    }

    // Fallback initialization
    setTimeout(initializeWidget, 2000);

})();
