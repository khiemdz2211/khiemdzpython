// Sample product data
const products = [
    {
        id: 1,
        name: "Áo thun unisex",
        price: "199.000 VNĐ",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        description: "Áo thun unisex basic, chất liệu cotton 100%, form rộng thoải mái"
    },
    {
        id: 2,
        name: "Quần tây nam",
        price: "599.000 VNĐ",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a",
        description: "Quần tây nam công sở, form slim fit, vải cao cấp"
    },
    {
        id: 3,
        name: "Áo blazer nữ",
        price: "899.000 VNĐ",
        image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a",
        description: "Áo blazer nữ công sở, thiết kế thanh lịch, phong cách Hàn Quốc"
    },
    {
        id: 4,
        name: "Áo len nam",
        price: "459.000 VNĐ",
        image: "https://pos.nvncdn.com/be3159-662/ps/20241220_4xGi5A1Y08.jpeg",
        description: "Áo len nam thu đông, chất liệu len mềm mại, giữ ấm tốt"
    },
    {
        id: 5,
        name: "Váy liền thân",
        price: "699.000 VNĐ",
        image: "https://images.unsplash.com/photo-1495385794356-15371f348c31",
        description: "Váy liền thân nữ, thiết kế hiện đại, phù hợp dự tiệc"
    },
    {
        id: 6,
        name: "Áo khoác denim",
        price: "799.000 VNĐ",
        image: "https://images.unsplash.com/photo-1601333144130-8cbb312386b6",
        description: "Áo khoác denim unisex, phong cách street style, bền đẹp"
    },
    {
        id: 7,
        name: "Quần jean nữ",
        price: "499.000 VNĐ",
        image: "https://images.unsplash.com/photo-1475178626620-a4d074967452",
        description: "Quần jean nữ ống đứng, form chuẩn, màu xanh đậm thời trang"
    },
    {
        id: 8,
        name: "Set đồ thể thao",
        price: "399.000 VNĐ",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
        description: "Set đồ thể thao nam nữ, chất liệu thun co giãn, thoáng mát"
    }
];

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to format price
function formatPrice(price) {
    if (typeof price === 'string') {
        price = parseInt(price.replace(/\D/g, ''));
    }
    return price.toLocaleString('vi-VN') + ' VNĐ';
}

// Function to parse price
function parsePrice(priceString) {
    return parseInt(priceString.replace(/\D/g, ''));
}
// Function to update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Function to update cart preview
function updateCartPreview() {
    const cartPreviewItems = document.getElementById('cartPreviewItems');
    const cartPreviewTotal = document.getElementById('cartPreviewTotal');
    
    if (!cartPreviewItems || !cartPreviewTotal) return;

    if (cart.length === 0) {
        cartPreviewItems.innerHTML = `
            <div class="empty-cart-preview">
                <i class="fas fa-shopping-bag"></i>
                <p>Giỏ hàng trống</p>
            </div>
        `;
        cartPreviewTotal.textContent = '0 VNĐ';
        return;
    }

    cartPreviewItems.innerHTML = cart.map(item => `
        <div class="cart-preview-item">
            <img src="${item.image}" alt="${item.name}" class="preview-item-image">
            <div class="preview-item-details">
                <div class="preview-item-name">${item.name}</div>
                <div class="preview-item-price">${item.price}</div>
                <div class="preview-item-quantity">Số lượng: ${item.quantity}</div>
            </div>
            <button onclick="removeFromCart(${item.id})" class="preview-remove-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (parsePrice(item.price) * item.quantity), 0);
    cartPreviewTotal.textContent = formatPrice(total);
}

// Function to add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
}
        localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartPreview();
        alert('Đã thêm sản phẩm vào giỏ hàng!');
    }
}

// Function to remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartPreview();
}

// Function to buy now
function buyNow(productId) {
    addToCart(productId);
    window.location.href = 'cart.html';
}

// Function to load products
function loadProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-overlay">
                    <a href="product-detail.html?id=${product.id}" class="view-detail">
                        <i class="fas fa-eye"></i> Xem chi tiết
                    </a>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">${product.price}</p>
                <div class="product-buttons">
                    <button onclick="addToCart(${product.id})" class="btn btn-cart">
                        <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
                    </button>
                    <button onclick="buyNow(${product.id})" class="btn btn-buy">
                        <i class="fas fa-bolt"></i> Mua ngay
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount();
    updateCartPreview();
});
