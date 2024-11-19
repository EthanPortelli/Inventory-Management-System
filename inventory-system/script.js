// LOGIN REQUEST
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Collect username and password from the login form
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Send a POST request to the backend login route
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        // Parse the JSON response from the server
        const result = await response.json();

        // Check if login was successful and redirect based on the user's role
        if (response.ok) {
            if (result.role === 'admin') {
                window.location.href = 'admin-dashboard.html'; // Redirect to admin page
            } else if (result.role === 'employee') {
                window.location.href = 'employee-dashboard.html'; // Redirect to employee page
            }
        } else {
            alert(result.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});

// LOAD INVENTORY FUNCTION
async function loadInventory() {
    try {
        // Send a GET request to retrieve inventory data from the backend
        const response = await fetch('http://localhost:3000/inventory');
        const inventory = await response.json();

        // Find the inventory list element in the HTML
        const inventoryList = document.getElementById('inventory-list');
        inventoryList.innerHTML = ''; // Clear the list before adding new items

        // Populate the inventory list with data from the server
        inventory.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.textContent = `${item.item_name} - Quantity: ${item.quantity}`;
            inventoryList.appendChild(itemElement);
        });
    } catch (error) {
        console.error('Error loading inventory:', error);
    }
}

// Call loadInventory when the page loads, if it's an admin or employee page
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the inventory pages
    if (document.getElementById('inventory-list')) {
        loadInventory();
    }
});


