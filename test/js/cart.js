let cart = JSON.parse(localStorage.getItem('cart')) || [];
const SHIPPING_FEE = 30000;

// Format price
function formatPrice(price) {
    if (typeof price === 'string') {
        price = parseInt(price.replace(/\D/g, ''));
    }
    return price.toLocaleString('vi-VN') + ' VNĐ';
}

// Parse price string to number
function parsePrice(priceString) {
    return parseInt(priceString.replace(/\D/g, ''));
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Remove item from cart
function removeItem(productId) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
    }
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItem(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartCount();
        }
    }
}

// Calculate totals
function calculateTotals() {
    const subtotal = cart.reduce((total, item) => {
        return total + (parsePrice(item.price) * item.quantity);
    }, 0);
    
    return {
        subtotal,
        shipping: cart.length > 0 ? SHIPPING_FEE : 0,
        total: subtotal + (cart.length > 0 ? SHIPPING_FEE : 0)
    };
}

// Render cart
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    
    if (!cartItems) return;

            if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Giỏ hàng của bạn đang trống</p>
                <a href="index.html" class="btn">Tiếp tục mua sắm</a>
            </div>
        `;
        subtotalElement.textContent = formatPrice(0);
        shippingElement.textContent = formatPrice(0);
        totalElement.textContent = formatPrice(0);
        return;
    }

    cartItems.innerHTML = `
        <div class="cart-header">
            <button onclick="clearCart()" class="clear-cart-btn">
                <i class="fas fa-trash"></i> Xóa tất cả
            </button>
        </div>
        ${cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">${item.price}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${item.id}, -1)" class="quantity-btn">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="quantity-btn">+</button>
                    </div>
                </div>
                <button onclick="removeItem(${item.id})" class="remove-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('')}
    `;

    const totals = calculateTotals();
    subtotalElement.textContent = formatPrice(totals.subtotal);
    shippingElement.textContent = formatPrice(totals.shipping);
    totalElement.textContent = formatPrice(totals.total);
}

// Clear cart
function clearCart() {
    if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
    }
}

// Initialize cart
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateCartCount();
});