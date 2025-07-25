// Chat Widget JavaScript - Include this file on all pages
// This will automatically inject the chat widget HTML and CSS

(function() {
    // Inject CSS styles
    const styles = `
        /* Chat Widget Styles */
        .chat-widget-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            font-family: 'Inter', sans-serif;
        }

        .chat-widget-button {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(30, 60, 114, 0.3);
            transition: all 0.3s ease;
            position: relative;
            animation: pulse-widget 2s infinite;
        }

        .chat-widget-button:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 35px rgba(30, 60, 114, 0.4);
        }

        .chat-widget-icon {
            color: white;
            font-size: 24px;
        }

        .chat-widget-notification {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ef4444;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            animation: bounce-notification 1s infinite;
        }

        @keyframes pulse-widget {
            0%, 100% { 
                box-shadow: 0 8px 25px rgba(30, 60, 114, 0.3), 0 0 0 0 rgba(30, 60, 114, 0.7); 
            }
            50% { 
                box-shadow: 0 12px 35px rgba(30, 60, 114, 0.4), 0 0 0 10px rgba(30, 60, 114, 0); 
            }
        }

        @keyframes bounce-notification {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-3px); }
            60% { transform: translateY(-1px); }
        }

        .chat-widget-popup {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.2);
            display: none;
            flex-direction: column;
            overflow: hidden;
            transform: scale(0.8) translateY(20px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .chat-widget-popup.show {
            display: flex;
            transform: scale(1) translateY(0);
            opacity: 1;
        }

        .chat-widget-header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .chat-header-info {
            display: flex;
            align-items: center;
        }

        .chat-avatar {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 18px;
        }

        .chat-header-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 2px;
        }

        .chat-header-status {
            font-size: 12px;
            opacity: 0.9;
        }

        .chat-close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: background 0.2s ease;
        }

        .chat-close-btn:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .chat-widget-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #f8fafc;
        }

        .chat-widget-messages::-webkit-scrollbar {
            width: 4px;
        }

        .chat-widget-messages::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        .chat-widget-messages::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 2px;
        }

        .chat-message {
            display: flex;
            margin-bottom: 15px;
            animation: slideInMessage 0.3s ease-out;
        }

        .chat-message.sent {
            flex-direction: row-reverse;
        }

        .chat-message-avatar {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            margin-right: 10px;
            flex-shrink: 0;
        }

        .chat-message.sent .chat-message-avatar {
            background: #e5e7eb;
            color: #6b7280;
            margin-right: 0;
            margin-left: 10px;
        }

        .chat-message-bubble {
            max-width: 70%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
            word-wrap: break-word;
        }

        .chat-message.received .chat-message-bubble {
            background: white;
            color: #1a1a1a !important;
            border-bottom-left-radius: 6px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .chat-message.sent .chat-message-bubble {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white !important;
            border-bottom-right-radius: 6px;
        }

        @keyframes slideInMessage {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .chat-typing-indicator {
            padding: 0 20px 10px;
            background: #f8fafc;
            display: none;
        }

        .chat-typing-indicator.show {
            display: block;
        }

        .chat-typing-dots {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            background: white;
            border-radius: 18px;
            border-bottom-left-radius: 6px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            width: fit-content;
        }

        .chat-typing-dots span {
            width: 8px;
            height: 8px;
            background: #9ca3af;
            border-radius: 50%;
            margin: 0 2px;
            animation: typing-dots 1.4s infinite ease-in-out;
        }

        .chat-typing-dots span:nth-child(2) {
            animation-delay: 0.2s;
        }

        .chat-typing-dots span:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typing-dots {
            0%, 60%, 100% {
                transform: scale(1);
                opacity: 0.5;
            }
            30% {
                transform: scale(1.2);
                opacity: 1;
            }
        }

        .chat-widget-input {
            padding: 20px;
            background: white;
            border-top: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .chat-input-container {
            flex: 1;
            background: #f3f4f6;
            border-radius: 25px;
            padding: 12px 16px;
            display: flex;
            align-items: center;
        }

        .chat-input-field {
            flex: 1;
            border: none;
            background: transparent;
            color: #1a1a1a !important;
            font-size: 14px;
            outline: none;
            font-family: inherit;
        }

        .chat-input-field::placeholder {
            color: #6b7280 !important;
        }

        .chat-send-btn {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(30, 60, 114, 0.3);
        }

        .chat-send-btn:hover:not(:disabled) {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(30, 60, 114, 0.4);
        }

        .chat-send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .chat-widget-container {
                bottom: 15px;
                right: 15px;
            }

            .chat-widget-popup {
                width: 320px;
                height: 450px;
                bottom: 75px;
            }

            .chat-widget-button {
                width: 55px;
                height: 55px;
            }

            .chat-widget-icon {
                font-size: 22px;
            }

            .chat-header-title {
                font-size: 15px;
            }

            .chat-header-status {
                font-size: 11px;
            }

            .chat-message-bubble {
                font-size: 13px;
                padding: 10px 14px;
            }

            .chat-input-field {
                font-size: 14px;
            }
        }

        @media (max-width: 480px) {
            .chat-widget-popup {
                width: calc(100vw - 20px);
                right: -10px;
                height: 420px;
                bottom: 70px;
            }

            .chat-widget-button {
                width: 50px;
                height: 50px;
            }

            .chat-widget-icon {
                font-size: 20px;
            }

            .chat-widget-notification {
                width: 18px;
                height: 18px;
                font-size: 11px;
                top: -3px;
                right: -3px;
            }

            .chat-widget-header {
                padding: 15px;
            }

            .chat-avatar {
                width: 35px;
                height: 35px;
                font-size: 16px;
                margin-right: 10px;
            }

            .chat-message-avatar {
                width: 28px;
                height: 28px;
                font-size: 12px;
                margin-right: 8px;
            }

            .chat-message.sent .chat-message-avatar {
                margin-left: 8px;
                margin-right: 0;
            }

            .chat-widget-input {
                padding: 15px;
            }

            .chat-send-btn {
                width: 35px;
                height: 35px;
                font-size: 14px;
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

    // Inject styles into head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // HTML template for chat widget
    const chatWidgetHTML = `
        <div class="chat-widget-container">
            <!-- Chat Widget Button -->
            <div class="chat-widget-button" id="chatWidgetButton">
                <div class="chat-widget-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <div class="chat-widget-notification" id="chatNotification">1</div>
            </div>

            <!-- Chat Widget Popup -->
            <div class="chat-widget-popup" id="chatWidgetPopup">
                <div class="chat-widget-header">
                    <div class="chat-header-info">
                        <div class="chat-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="chat-header-text">
                            <div class="chat-header-title">Bella  logu AI</div>
                            <div class="chat-header-status">AI Assistant • Online</div>
                        </div>
                    </div>
                    <button class="chat-close-btn" id="chatCloseBtn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="chat-widget-messages" id="chatMessages">
                    <!-- Messages will be added dynamically -->
                </div>

                <div class="chat-typing-indicator" id="typingIndicator">
                    <div class="chat-typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <div class="chat-widget-input">
                    <div class="chat-input-container">
                        <input type="text" class="chat-input-field" id="messageInput" placeholder="Type your message...">
                    </div>
                    <button class="chat-send-btn" id="sendBtn" disabled>
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Wait for DOM to be ready
    function initChatWidget() {
        // Inject HTML into body
        document.body.insertAdjacentHTML('beforeend', chatWidgetHTML);

        // Initialize functionality
        const chatWidgetButton = document.getElementById('chatWidgetButton');
        const chatWidgetPopup = document.getElementById('chatWidgetPopup');
        const chatCloseBtn = document.getElementById('chatCloseBtn');
        const chatNotification = document.getElementById('chatNotification');
        const chatInputField = document.querySelector('.chat-input-field');
        const chatSendBtn = document.querySelector('.chat-send-btn');
        const chatMessages = document.querySelector('.chat-widget-messages');
        const typingIndicator = document.querySelector('.chat-typing-indicator');

        let isOpen = false;

        // Toggle chat widget
        function toggleChat() {
            isOpen = !isOpen;
            if (isOpen) {
                chatWidgetPopup.classList.add('show');
                chatNotification.style.display = 'none';
                chatInputField.focus();
            } else {
                chatWidgetPopup.classList.remove('show');
            }
        }

        // Event listeners
        chatWidgetButton.addEventListener('click', toggleChat);
        chatCloseBtn.addEventListener('click', toggleChat);

        // Close chat when clicking outside
        document.addEventListener('click', function(e) {
            if (isOpen && !chatWidgetPopup.contains(e.target) && !chatWidgetButton.contains(e.target)) {
                toggleChat();
            }
        });

        // Enable/disable send button based on input
        chatInputField.addEventListener('input', function() {
            chatSendBtn.disabled = this.value.trim() === '';
        });

        // Send message on Enter key
        chatInputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !chatSendBtn.disabled) {
                sendChatMessage();
            }
        });

        // Send message on button click
        chatSendBtn.addEventListener('click', function() {
            if (!this.disabled) {
                sendChatMessage();
            }
        });

        function sendChatMessage() {
            const message = chatInputField.value.trim();
            if (!message) return;

            // Add user message to chat
            addMessageToChat(message, 'sent');

            // Clear input
            chatInputField.value = '';
            chatSendBtn.disabled = true;

            // Show typing indicator
            showTypingIndicator();

            // Here you can integrate with your existing n8n logic
            // For now, simulate AI response
            setTimeout(() => {
                hideTypingIndicator();
                addMessageToChat("Thanks for your message! I'm processing your request and will respond shortly.", 'received');
            }, 1500);
        }

        function addMessageToChat(message, type) {
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
        }

        function showTypingIndicator() {
            typingIndicator.classList.add('show');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function hideTypingIndicator() {
            typingIndicator.classList.remove('show');
        }

        // Send welcome message from Bella when chat widget is initialized
        setTimeout(() => {
            addMessageToChat("Welcome, this is Bella your AI assistant, how can I help you today?", 'received');
        }, 500);

        // Show notification after 3 seconds
        setTimeout(() => {
            if (!isOpen) {
                chatNotification.style.display = 'flex';
            }
        }, 3000);

        // Make functions globally available for existing n8n integration
        window.handleKeyPress = function(event) {
            if (event.key === 'Enter' && !chatSendBtn.disabled) {
                sendChatMessage();
            }
        };

        window.sendMessage = function() {
            if (!chatSendBtn.disabled) {
                sendChatMessage();
            }
        };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatWidget);
    } else {
        initChatWidget();
    }

})();
