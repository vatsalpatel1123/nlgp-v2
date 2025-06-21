# Form to Google Sheets via n8n - Complete Setup Guide

## Overview
This setup integrates your website forms (demo request popup and contact form) with Google Sheets via n8n workflow automation. All form submissions will be automatically stored in Google Sheets and trigger email notifications.

## Prerequisites
1. n8n instance (cloud or self-hosted)
2. Google Sheets API access
3. SMTP email credentials (Gmail, SendGrid, etc.)

## Step 1: Google Sheets Setup

### 1.1 Create Google Sheet
1. Create a new Google Sheet
2. Name it "Form Submissions" or similar
3. Add headers in the first row:
   - A1: Timestamp
   - B1: Form Type
   - C1: Source
   - D1: First Name
   - E1: Last Name
   - F1: Full Name
   - G1: Email
   - H1: Phone
   - I1: Company
   - J1: Service Interest
   - K1: Referral Source
   - L1: Message
   - M1: SMS Consent
   - N1: Terms Consent
   - O1: Page URL
   - P1: User Agent

### 1.2 Get Sheet ID
Copy the Google Sheet ID from the URL:
`https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`

## Step 2: n8n Setup

### 2.1 Import Workflow
1. Open your n8n instance
2. Go to Workflows
3. Click "Import from file"
4. Upload the `n8n-workflow-form-to-sheets.json` file

### 2.2 Configure Credentials

#### Google Sheets API
1. Go to Credentials in n8n
2. Add "Google Sheets API" credential
3. Follow the OAuth2 setup or use Service Account
4. Test the connection

#### SMTP Email
1. Add "SMTP" credential
2. Configure with your email provider:
   - Gmail: smtp.gmail.com, port 587
   - SendGrid: smtp.sendgrid.net, port 587
   - Outlook: smtp-mail.outlook.com, port 587

### 2.3 Update Workflow Configuration

#### Google Sheets Node
1. Open "Add to Google Sheets" node
2. Set your Google Sheet ID
3. Select your Google Sheets credential
4. Set sheet name to "Form Submissions"

#### Email Node
1. Open "Send Notification Email" node
2. Set recipient email address
3. Select your SMTP credential

### 2.4 Get Webhook URLs
1. Open "Demo Form Webhook" node
2. Copy the webhook URL (e.g., `https://your-n8n.com/webhook/demo-form`)
3. Open "Contact Form Webhook" node
4. Copy the webhook URL (e.g., `https://your-n8n.com/webhook/contact-form`)

## Step 3: Update Website Code

### 3.1 Update index.html
Replace the webhook URL in the demo form submission:
```javascript
// Find this line in index.html:
fetch('https://your-n8n-instance.com/webhook/demo-form', {

// Replace with your actual webhook URL:
fetch('https://YOUR_ACTUAL_N8N_URL/webhook/demo-form', {
```

### 3.2 Update contact.html
Replace the webhook URL in the contact form submission:
```javascript
// Find this line in contact.html:
fetch('https://your-n8n-instance.com/webhook/contact-form', {

// Replace with your actual webhook URL:
fetch('https://YOUR_ACTUAL_N8N_URL/webhook/contact-form', {
```

## Step 4: Testing

### 4.1 Test Demo Form
1. Open your website's index page
2. Click "Request Demo" button
3. Fill out the popup form
4. Submit and verify:
   - Success message appears
   - Data appears in Google Sheets
   - Email notification received

### 4.2 Test Contact Form
1. Open your website's contact page
2. Fill out the main contact form
3. Submit and verify:
   - Success message appears
   - Data appears in Google Sheets
   - Email notification received

## Step 5: Customization Options

### 5.1 Add More Fields
To add new form fields:
1. Update the HTML form
2. Update the JavaScript data collection
3. Update the n8n workflow data formatting
4. Add new columns to Google Sheets

### 5.2 Email Templates
Customize the email notification in the "Send Notification Email" node:
- Change subject line
- Modify HTML template
- Add conditional formatting

### 5.3 Data Validation
Add validation nodes in n8n:
- Email format validation
- Phone number formatting
- Required field checks

## Troubleshooting

### Common Issues
1. **Webhook not receiving data**: Check CORS settings and URL
2. **Google Sheets not updating**: Verify credentials and sheet permissions
3. **Email not sending**: Check SMTP settings and credentials
4. **Form not submitting**: Check browser console for JavaScript errors

### Debug Steps
1. Check n8n execution logs
2. Test webhook URLs directly with Postman
3. Verify Google Sheets API permissions
4. Test email credentials separately

## Security Considerations
1. Use HTTPS for all webhook URLs
2. Implement rate limiting if needed
3. Validate and sanitize form data
4. Use environment variables for sensitive data
5. Regular backup of Google Sheets data

## Data Structure
Each form submission creates a row with:
- Timestamp (ISO format)
- Form type (demo_request/contact_form/newsletter_signup)
- Source (index_page_popup/contact_page_main/etc.)
- All form field data
- Metadata (page URL, user agent)
