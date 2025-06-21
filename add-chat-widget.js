// Script to add universal chat widget to all HTML pages
// This script will add the chat widget script tag to all HTML files

const fs = require('fs');
const path = require('path');

// List of HTML files to update
const htmlFiles = [
    'index.html',
    'Home.html',
    'apps.html',
    'appscroll.html',
    'flow.html',
    'flowvp.html',
    'mobile-chat.html',
    'model.html',
    'side-flow.html'
];

// Chat widget script tag to add
const chatWidgetScript = '  <!-- Universal Chat Widget -->\n  <script src="universal-chat-widget.js"></script>';

// Function to add chat widget to HTML file
function addChatWidgetToFile(filename) {
    try {
        const filePath = path.join(__dirname, filename);
        
        if (!fs.existsSync(filePath)) {
            console.log(`File ${filename} does not exist, skipping...`);
            return;
        }

        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if chat widget is already added
        if (content.includes('universal-chat-widget.js')) {
            console.log(`Chat widget already exists in ${filename}, skipping...`);
            return;
        }

        // Try to find a good place to insert the script
        // Look for FontAwesome link or head closing tag
        let insertPosition = -1;
        let insertAfter = '';

        // Try to find FontAwesome link
        const fontAwesomeMatch = content.match(/.*font-awesome.*\.css.*>/i);
        if (fontAwesomeMatch) {
            insertPosition = content.indexOf(fontAwesomeMatch[0]) + fontAwesomeMatch[0].length;
            insertAfter = fontAwesomeMatch[0];
        }
        // Try to find any CSS link
        else {
            const cssMatch = content.match(/.*<link.*\.css.*>/i);
            if (cssMatch) {
                insertPosition = content.indexOf(cssMatch[0]) + cssMatch[0].length;
                insertAfter = cssMatch[0];
            }
            // Fallback to head closing tag
            else {
                const headMatch = content.match(/<\/head>/i);
                if (headMatch) {
                    insertPosition = content.indexOf(headMatch[0]);
                    insertAfter = '';
                }
            }
        }

        if (insertPosition === -1) {
            console.log(`Could not find suitable insertion point in ${filename}`);
            return;
        }

        // Insert the chat widget script
        const beforeInsert = content.substring(0, insertPosition);
        const afterInsert = content.substring(insertPosition);
        
        let newContent;
        if (insertAfter) {
            newContent = beforeInsert + '\n' + chatWidgetScript + afterInsert;
        } else {
            newContent = beforeInsert + chatWidgetScript + '\n' + afterInsert;
        }

        // Write the updated content back to file
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Successfully added chat widget to ${filename}`);

    } catch (error) {
        console.error(`Error processing ${filename}:`, error.message);
    }
}

// Process all HTML files
console.log('Adding universal chat widget to HTML files...\n');

htmlFiles.forEach(filename => {
    addChatWidgetToFile(filename);
});

console.log('\nChat widget addition complete!');
console.log('\nFiles updated:');
htmlFiles.forEach(filename => {
    if (fs.existsSync(path.join(__dirname, filename))) {
        console.log(`✓ ${filename}`);
    }
});
