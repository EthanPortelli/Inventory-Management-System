document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed."); // Log to confirm the event fired

    // LOGIN REQUEST
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log("Login form found. Setting up event listener.");
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // Collect username and password from the login form
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                // Send a POST request to the backend login route
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }), 
                });

                // Parse the JSON response from the server
                const result = await response.json();

                // Check if login was successful and redirect based on the user's role
                if (result.success) {
                    // Store the role in localStorage to use for retricting role views
                    localStorage.setItem('role', result.role); 

                    if (result.role === 'admin') {
                        window.location.href = 'admin.html'; // Redirect to admin page 
                    } else if (result.role === 'manager') {
                        window.location.href = 'manager.html'; // Redirect to manager page
                    } else if (result.role === 'employee') {
                        window.location.href = 'employee.html'; // Redirect to employee page
                    }
                } else {
                    alert(result.message || 'Login failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    } else {
        console.error("Login form not found in the DOM."); // Log if the login form is missing
    }

    // ADD ITEM FORM HANDLER
    const addItemForm = document.getElementById('add-item-form');
    if (addItemForm) {
        console.log("Add item form found. Setting up event listener.");
        addItemForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const itemName = document.getElementById('item-name').value.trim();
            const itemPrice = document.getElementById('item-price').value.trim();
            const itemQuantity = parseInt(document.getElementById('item-quantity').value);


            if (!itemName || isNaN(itemQuantity) || itemQuantity <= 0) {
                alert('Invalid input. Please enter a valid item name and quantity.');
                return;
            }

            try {
                // Send a POST request to add the new item to the database
                const response = await fetch('http://localhost:3000/add-item', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        item_name: itemName,
                        item_price: itemPrice,
                        quantity: itemQuantity
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    // After successfully adding an item, refresh the inventory list
                    alert(result.message || 'Item added successfully!');
                    loadInventory();
                } else {
                    alert(result.error || 'Failed to add item.');
                }
            } catch (error) {
                console.error('Error adding item:', error);
                alert('An error occurred while adding the item.');
            }
        });
    } else {
        console.error("Add item form not found in the DOM."); // Log if the add item form is missing
    }

    // LOAD INVENTORY FUNCTION
    if (document.getElementById('inventory-list')) {
        console.log("Inventory list element found. Calling loadInventory()...");
        loadInventory(); // Load inventory when the page is ready
    } else {
        console.error("Inventory list element not found in the DOM."); // Log if the inventory list is missing
    }
});

// LOAD INVENTORY FUNCTION
async function loadInventory() {
    console.log("Loading inventory..."); // Start log
    try {
        const response = await fetch('http://localhost:3000/inventory');
        console.log("Received response:", response.status); // Log the response status

        if (!response.ok) {
            throw new Error('Failed to fetch inventory data');
        }

        const inventory = await response.json();
        console.log("Inventory data:", inventory); // Log the inventory data received

        // Get the user role from localStorage
        const userRole = localStorage.getItem('role');

        const inventoryList = document.getElementById('inventory-list');
        if (!inventoryList) {
            console.error("Element with ID 'inventory-list' not found."); // Log if the element is not found
            return;
        }
        inventoryList.innerHTML = ''; // Clear the list before adding new items

        if (inventory.length === 0) {
            inventoryList.textContent = 'No items in inventory.';
        } else {
            inventory.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('inventory-item');
                itemElement.textContent = `${item.item_name} - Price: ${item.item_price} - Current Quantity: ${item.quantity}`;

                const updateButton = document.createElement('button');
                updateButton.textContent = 'Update';
                updateButton.classList.add('update-button');

                const editLabel = document.createElement('span');
                editLabel.textContent = 'New Quantity:';
                editLabel.classList.add('edit-label');  

                const quantityInput = document.createElement('input');// Create an input field for quantity
                quantityInput.type = 'number'; // Ensure it's a number input
                quantityInput.value = item.quantity; // Set the current quantity as the input's value
                quantityInput.setAttribute('min', '0'); 
                quantityInput.classList.add('quantity-input');

                // Add the input field and the update button to the item element
                itemElement.appendChild(editLabel);
                itemElement.appendChild(quantityInput);
                itemElement.appendChild(updateButton);

                // Add click event for updating item quantity
                updateButton.onclick = () => {
                    const newQuantity = quantityInput.value; // Get the new quantity from the input field
                    updateItem(item.id, newQuantity); // Call the updateItem function with item ID and new quantity
                };

                // Only create the delete button if the user is an admin
                if (userRole === "admin" || userRole === "manager") {
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('delete-button');
                    deleteButton.onclick = () => deleteItem(item.id); // Add click event for deleting item
                    itemElement.appendChild(deleteButton);
                }
               
                inventoryList.appendChild(itemElement);
                console.log("Item added:", itemElement); // Log each item added to the list
            });
        }
    } catch (error) {
        console.error('Error loading inventory:', error);
    }
}

// DELETE ITEM FUNCTION
async function deleteItem(itemId) {
    console.log(`Attempting to delete item with ID: ${itemId}`); // Added for Debugging

    if (confirm('Are you sure you want to delete this item?')) {
        try {
            const response = await fetch(`http://localhost:3000/delete-item/${itemId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || 'Item deleted successfully!');
                loadInventory(); // Refresh the inventory list
            } else {
                alert(result.error || 'Failed to delete item.');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('An error occurred while deleting the item.');
        }
    }
}

// UPDATE ITEM FUNCTION
async function updateItem(itemId, itemQuantity) {
    console.log(`Attempting to update item with ID: ${itemId}`); // Added for Debugging

    if (confirm('Are you sure you want to update this item?')) {
        try {
            const response = await fetch(`http://localhost:3000/update-item/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quantity: itemQuantity
                })
            });
            
            
            const result = await response.json();

            if (response.ok) {
                alert(result.message || 'Item updated successfully!');
                loadInventory(); // Refresh the inventory list
            } else {
                alert(result.error || 'Failed to update item.');
            }
        } catch (error) {
            console.error('Error updating item:', error);
            alert('An error occurred while uppdating the item.');
        }
    }
}
