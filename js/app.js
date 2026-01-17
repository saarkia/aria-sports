// ========================================
// Aria Sports - Main Application Logic
// ========================================

// Cart Management
const Cart = {
  KEY: 'aria_sports_cart',
  
  getItems() {
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : [];
  },
  
  saveItems(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    updateCartCount();
  },
  
  addItem(productId, quantity = 1) {
    const items = this.getItems();
    const existingItem = items.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ productId, quantity });
    }
    
    this.saveItems(items);
    
    // Track with Braze eCommerce events
    const product = getProductById(productId);
    if (product) {
      // This will trigger ecommerce.cart_updated event
      BrazeTracker.trackAddToCart(product, quantity);
    }
    
    // Show feedback
    showNotification(`Added to cart!`);
    
    return items;
  },
  
  updateQuantity(productId, quantity) {
    const items = this.getItems();
    const item = items.find(i => i.productId === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.saveItems(items);
      }
    }
    
    return this.getItems();
  },
  
  removeItem(productId) {
    const items = this.getItems().filter(item => item.productId !== productId);
    this.saveItems(items);
    return items;
  },
  
  clear() {
    localStorage.removeItem(this.KEY);
    updateCartCount();
  },
  
  getTotal() {
    const items = this.getItems();
    return items.reduce((total, item) => {
      const product = getProductById(item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  },
  
  getItemCount() {
    return this.getItems().reduce((count, item) => count + item.quantity, 0);
  }
};

// Update cart count in header
function updateCartCount() {
  const countElements = document.querySelectorAll('#cartCount, .cart-count');
  const count = Cart.getItemCount();
  countElements.forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// Create product card HTML
function createProductCard(product) {
  const discount = getDiscountPercentage(product);
  const hasDiscount = discount > 0;
  
  return `
    <div class="product-card" data-product-id="${product.id}">
      <a href="product.html?id=${product.id}" class="product-card-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${hasDiscount ? `<div class="product-card-badges"><span class="badge badge-sale">Sale</span></div>` : ''}
        <div class="product-card-actions">
          <button class="product-card-action" onclick="event.preventDefault(); Cart.addItem(${product.id})" title="Add to Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
          </button>
        </div>
      </a>
      <div class="product-card-body">
        <p class="product-card-brand">${product.brand}</p>
        <h3 class="product-card-name"><a href="product.html?id=${product.id}">${product.name}</a></h3>
        <div class="product-card-price">
          <span class="product-price">${formatPrice(product.price)}</span>
          ${hasDiscount ? `
            <div class="product-price-details">
              <span class="product-price-rrp">RRP ${formatPrice(product.rrp)}</span>
              <span class="product-price-save">Save ${discount}%</span>
            </div>
          ` : ''}
        </div>
        <div class="product-card-link">
          <a href="product.html?id=${product.id}">View Details & Buy</a>
        </div>
      </div>
    </div>
  `;
}

// Show notification toast
function showNotification(message, type = 'success') {
  // Remove existing notification
  const existing = document.querySelector('.notification-toast');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = `notification-toast notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
  `;
  
  // Styles
  Object.assign(notification.style, {
    position: 'fixed',
    bottom: '100px',
    right: '20px',
    background: type === 'success' ? 'var(--color-success)' : 'var(--color-danger)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: '10000',
    animation: 'slideUp 0.3s ease-out',
    fontWeight: '500'
  });
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => notification.remove(), 300);
  }, 2500);
}

// Demo Panel Toggle
function toggleDemoPanel() {
  const panel = document.getElementById('demoPanelContent');
  panel.classList.toggle('open');
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(10px); }
  }
`;
document.head.appendChild(style);

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);

// User Session Management
const UserSession = {
  KEY: 'aria_sports_user',
  
  getUser() {
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : null;
  },
  
  setUser(user) {
    localStorage.setItem(this.KEY, JSON.stringify(user));
    this.updateUI();
  },
  
  clearUser() {
    localStorage.removeItem(this.KEY);
    this.updateUI();
  },
  
  isLoggedIn() {
    return this.getUser() !== null;
  },
  
  updateUI() {
    const user = this.getUser();
    const statusEl = document.getElementById('userStatus');
    const userIdEl = document.getElementById('userId');
    
    if (statusEl) {
      statusEl.textContent = user ? 'Logged In' : 'Anonymous';
    }
    if (userIdEl) {
      userIdEl.textContent = user ? user.id : '-';
    }
  }
};

// URL Parameter Helper
function getURLParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Confetti Effect for Checkout Success
function createConfetti() {
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti';
  document.body.appendChild(confettiContainer);
  
  const colors = ['#E85A2C', '#1A2E4C', '#28A745', '#FFC107', '#17A2B8'];
  
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: absolute;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}%;
      top: -20px;
      opacity: ${Math.random() * 0.5 + 0.5};
      transform: rotate(${Math.random() * 360}deg);
      animation: confettiFall ${Math.random() * 2 + 2}s linear forwards;
    `;
    confettiContainer.appendChild(confetti);
  }
  
  // Add animation
  const confettiStyle = document.createElement('style');
  confettiStyle.textContent = `
    @keyframes confettiFall {
      to {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(confettiStyle);
  
  // Remove after animation
  setTimeout(() => {
    confettiContainer.remove();
    confettiStyle.remove();
  }, 4000);
}

// Format currency (already in products.js but adding here for safety)
if (typeof formatPrice === 'undefined') {
  function formatPrice(price) {
    return '£' + price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

