
const BASEROW_CONFIG = {
  
    token: 'dq5ZamHGgdU0fv4BgbvUSakrh4c12idq',
    

    tableId: '590151',
    
    baseUrl: 'https://api.baserow.io/api/database/rows/table/',
    

    fields: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
    }
};

// Function to get the full API URL
function getBaserowApiUrl() {
    return `${BASEROW_CONFIG.baseUrl}${BASEROW_CONFIG.tableId}/?user_field_names=true`;
}

// Function to get headers for API requests
function getBaserowHeaders() {
    return {
        'Authorization': `Token ${BASEROW_CONFIG.token}`,
        'Content-Type': 'application/json',
    };
}

// Function to test the connection and get table info
async function testBaserowConnection() {
    try {
        const response = await fetch(`https://api.baserow.io/api/database/tables/${BASEROW_CONFIG.tableId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${BASEROW_CONFIG.token}`,
            }
        });

        if (response.ok) {
            const tableInfo = await response.json();
            console.log('Table info:', tableInfo);
            console.log('Available fields:', tableInfo.fields.map(f => f.name));
            return tableInfo;
        } else {
            console.error('Failed to get table info:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error getting table info:', error);
        return null;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BASEROW_CONFIG, getBaserowApiUrl, getBaserowHeaders, testBaserowConnection };
}
