// Shoe "database" as a JavaScript array of objects
const shoeDatabase = [
    {
        id: 1,
        name: "Running Pro X1",
        price: 99.99,
        imageUrl: "https://example.com/images/shoes/running-pro-x1.jpg",
        category: "Running",
        description: "Lightweight running shoes with extra cushioning"
    },
    {
        id: 2,
        name: "Casual Walker",
        price: 79.50,
        imageUrl: "https://example.com/images/shoes/casual-walker.jpg",
        category: "Casual",
        description: "Comfortable everyday walking shoes"
    },
    {
        id: 3,
        name: "Basketball Elite",
        price: 129.99,
        imageUrl: "https://example.com/images/shoes/basketball-elite.jpg",
        category: "Sports",
        description: "High-performance basketball shoes"
    },
    {
        id: 4,
        name: "Hiking Extreme",
        price: 149.99,
        imageUrl: "https://example.com/images/shoes/hiking-extreme.jpg",
        category: "outdoor",
        description: "Durable hiking boots for extreme conditions"
    }
];

// Function to display shoes on the page
function displayShoes(shoes) {
    const container = document.getElementById('shoe-container');
    container.innerHTML = '';
    
    shoes.forEach(shoe => {
        const shoeCard = document.createElement('div');
        shoeCard.className = 'shoe-card';
        shoeCard.innerHTML = `
            <img src="${shoe.imageUrl}" alt="${shoe.name}" class="shoe-image">
            <div class="shoe-details">
                <h3>${shoe.name}</h3>
                <p class="category">${shoe.category}</p>
                <p class="description">${shoe.description}</p>
                <p class="price">$${shoe.price.toFixed(2)}</p>
                <button onclick="cart.addItem(${shoe.id})">Add to Cart</button>
            </div>
        `;
        container.appendChild(shoeCard);
    });
}

// Function to filter shoes by category
function filterByCategory(category) {
    if (category === 'all') {
        displayShoes(shoeDatabase);
    } else {
        const filteredShoes = shoeDatabase.filter(shoe => 
            shoe.category.toLowerCase() === category.toLowerCase()
        );
        displayShoes(filteredShoes);
    }
}

// Function to search shoes by name
function searchShoes(searchTerm) {
    const filteredShoes = shoeDatabase.filter(shoe => 
        shoe.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shoe.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayShoes(filteredShoes);
}


// Simple add to cart function (placeholder)
class ShoppingCart {
    constructor() {
        this.items = [];
    }

    addItem(shoeId, quantity = 1) {
        const shoe = shoeDatabase.find(s => s.id === shoeId);
        const existingItem = this.items.find(item => item.shoe.id === shoeId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ shoe, quantity });
        }
        this.updateCartDisplay();
    }

    removeItem(shoeId) {
        this.items = this.items.filter(item => item.shoe.id !== shoeId);
        this.updateCartDisplay();
    }

    updateQuantity(shoeId, quantity) {
        const item = this.items.find(item => item.shoe.id === shoeId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(shoeId);
            } else {
                item.quantity = quantity;
                this.updateCartDisplay();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => 
            total + (item.shoe.price * item.quantity), 0);
    }

    clearCart() {
        this.items = [];
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        cartItems.innerHTML = '';
        this.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.shoe.imageUrl}" alt="${item.shoe.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.shoe.name}</h4>
                    <p>Price: $${item.shoe.price.toFixed(2)}</p>
                    <input type="number" value="${item.quantity}" min="1" 
                        onchange="cart.updateQuantity(${item.shoe.id}, parseInt(this.value))">
                    <button onclick="cart.removeItem(${item.shoe.id})">Remove</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        cartTotal.textContent = `Total: $${this.getTotal().toFixed(2)}`;
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Checkout function
function showCheckout() {
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    checkoutItems.innerHTML = '';
    cart.items.forEach(item => {
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        checkoutItem.innerHTML = `
            <span>${item.shoe.name} (x${item.quantity})</span>
            <span>$${(item.shoe.price * item.quantity).toFixed(2)}</span>
        `;
        checkoutItems.appendChild(checkoutItem);
    });

    checkoutTotal.textContent = `Total: $${cart.getTotal().toFixed(2)}`;
    checkoutModal.style.display = 'block';
}

function completePurchase() {
    alert(`Thank you for your purchase! Total amount: $${cart.getTotal().toFixed(2)}`);
    cart.clearCart();
    document.getElementById('checkout-modal').style.display = 'none';
};


// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Display all shoes initially
    displayShoes(shoeDatabase);
    
    // Add event listener for search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchShoes(e.target.value);
        });
    }
    // Close checkout modal
    document.getElementById('close-checkout').addEventListener('click', () => {
        document.getElementById('checkout-modal').style.display = 'none';
    });
});