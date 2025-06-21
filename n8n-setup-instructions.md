# n8n Chat Widget Integration Setup

## Overview
The new chat widget is now integrated with n8n workflow for professional AI responses. The widget features a smartphone-like iMessage UI and connects directly to your n8n workflow.

## Setup Instructions

### 1. Configure n8n Webhook URL
1. Open `n8n-chat-integration.js`
2. Find line 18: `webhookUrl: 'YOUR_N8N_WEBHOOK_URL_HERE'`
3. Replace with your actual n8n webhook URL

Example:
```javascript
const N8N_CONFIG = {
    webhookUrl: 'https://your-n8n-instance.com/webhook/chat-widget',
    timeout: 10000,
    retryAttempts: 3
};
```

### 2. n8n Workflow Setup
Your n8n workflow should expect this payload:
```json
{
    "message": "User's message text",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "userAgent": "Browser info",
    "url": "Current page URL",
    "sessionId": "Unique session identifier"
}
```

Your workflow should return:
```json
{
    "response": "AI assistant response text"
}
```

### 3. Features Included

#### Professional UI
- ✅ Smartphone-like iMessage interface
- ✅ iOS-style design with proper animations
- ✅ Responsive design for all devices
- ✅ Professional gradient styling

#### Functionality
- ✅ Direct n8n workflow integration
- ✅ Session management
- ✅ Error handling with fallback messages
- ✅ Typing indicators
- ✅ Real-time message delivery
- ✅ Mobile-responsive popup

#### Branding
- ✅ Bella AI assistant name
- ✅ Online status indicator
- ✅ Professional blue color scheme
- ✅ FontAwesome icons

### 4. Widget Placement
The widget automatically appears on ALL pages that include the script:
- ✅ Fixed position (bottom-right)
- ✅ Visible on mobile and desktop
- ✅ Professional notification badge
- ✅ Smooth animations

### 5. API Access
Global JavaScript API available:
```javascript
// Open chat widget
N8nChatAPI.open();

// Close chat widget
N8nChatAPI.close();

// Send message programmatically
N8nChatAPI.sendMessage("Hello from external script");

// Check if chat is open
if (N8nChatAPI.isOpen()) {
    console.log("Chat is currently open");
}
```

### 6. Testing
1. Load any page with the widget
2. Click the blue chat button
3. Send a test message
4. Verify n8n workflow receives the payload
5. Check that response appears in chat

### 7. Troubleshooting

#### Widget not appearing:
- Check browser console for errors
- Verify FontAwesome is loading
- Ensure script is included in HTML

#### n8n not receiving messages:
- Verify webhook URL is correct
- Check n8n workflow is active
- Review browser network tab for failed requests

#### Styling issues:
- Check for CSS conflicts
- Verify responsive breakpoints
- Test on different devices

## Files Modified
1. `index.html` - Updated to use new n8n integration
2. `n8n-chat-integration.js` - New professional chat widget
3. Image section - Fixed white corner issue (now 100% width)

## Next Steps
1. Configure your n8n webhook URL
2. Set up your n8n workflow to handle chat messages
3. Test the integration thoroughly
4. Deploy to production

The chat widget is now ready for professional use with your n8n workflow!
