// ========================================
// Aria Sports - Braze SDK Integration
// ========================================

// Braze Configuration
const BRAZE_CONFIG = {
  apiKey: '1e41b17e-ab33-4de2-9329-4b7210434917',
  baseUrl: 'sdk.fra-02.braze.eu',
  enableLogging: true,  // Enable for demo purposes
  allowUserSuppliedJavascript: true,
  serviceWorkerLocation: '/service-worker.js',
  manageServiceWorkerExternally: false,
  disablePushTokenMaintenance: false, // Set to true to disable push entirely
  sessionTimeoutInSeconds: 10, // Short timeout for demo purposes (default is 30)
  minimumIntervalBetweenTriggerActionsInSeconds: 1 // Allow IAMs to trigger rapidly (default is 30)
};

// Global state
let brazeInitialized = false;
let loggingEnabled = true;
let sdkEnabled = true;

// Event queue for events fired before SDK is ready
const eventQueue = [];

// Console log storage
const consoleLog = [];

// Initialize Braze SDK
function initializeBraze() {
  // Check if Braze SDK is loaded
  if (typeof braze === 'undefined') {
    console.warn('[Braze] SDK not loaded yet, will retry...');
    devLog('Waiting for Braze SDK...', 'info');
    return false;
  }
  
  try {
    // Initialize the SDK
    braze.initialize(BRAZE_CONFIG.apiKey, {
      baseUrl: BRAZE_CONFIG.baseUrl,
      enableLogging: BRAZE_CONFIG.enableLogging,
      allowUserSuppliedJavascript: BRAZE_CONFIG.allowUserSuppliedJavascript,
      serviceWorkerLocation: BRAZE_CONFIG.serviceWorkerLocation,
      manageServiceWorkerExternally: BRAZE_CONFIG.manageServiceWorkerExternally,
      sessionTimeoutInSeconds: BRAZE_CONFIG.sessionTimeoutInSeconds,
      minimumIntervalBetweenTriggerActionsInSeconds: BRAZE_CONFIG.minimumIntervalBetweenTriggerActionsInSeconds
    });
    
    // Enable in-app messages
    braze.automaticallyShowInAppMessages();
    
    // Subscribe to content cards updates
    braze.subscribeToContentCardsUpdates(function(cards) {
      devLog('Content Cards updated: ' + cards.length + ' cards', 'info');
    });
    
    // ========================================
    // Braze Banners - Subscribe and Refresh
    // ========================================
    braze.subscribeToBannersUpdates(function(banners) {
      devLog('Banners updated', 'info');
      
      // Get the hero banner placement
      const heroBanner = braze.getBanner('aria-sports-hero');
      const container = document.getElementById('aria-sports-hero-container');
      const heroSection = document.getElementById('hero-section');
      const fallbackContent = document.getElementById('hero-fallback-content');
      const fallbackPattern = document.getElementById('hero-fallback-pattern');
      
      if (container) {
        if (heroBanner && !heroBanner.isControl) {
          // Show the banner container and insert the banner
          container.style.display = 'block';
          braze.insertBanner(heroBanner, container);
          
          // Hide fallback content when banner is shown
          if (fallbackContent) fallbackContent.style.display = 'none';
          if (fallbackPattern) fallbackPattern.style.display = 'none';
          
          // Remove hero section's default background (banner provides its own)
          if (heroSection) heroSection.style.background = 'none';
          
          devLog('Hero banner inserted: aria-sports-hero', 'info');
        } else if (heroBanner && heroBanner.isControl) {
          // User is in control variant - hide banner container, show fallback
          container.style.display = 'none';
          devLog('Hero banner: user in control variant', 'info');
        } else {
          // No banner available - keep fallback visible, hide banner container
          container.style.display = 'none';
          devLog('No hero banner available for this user', 'info');
        }
      }
    });
    
    // Request banner refresh for the hero placement
    braze.requestBannersRefresh(['aria-sports-hero']);
    devLog('Requested banner refresh: aria-sports-hero', 'info');
    
    // NOTE: We do NOT call changeUser on every page load!
    // Braze SDK persists user identity in IndexedDB automatically.
    // We only call changeUser explicitly when:
    // 1. User logs in (account.html)
    // 2. User checks out (checkout.html)
    // 3. User set via developer dialog
    // This avoids unnecessary syncs and IAM trigger resets.
    const user = UserSession.getUser();
    if (user) {
      devLog('Session user: ' + user.id + ' (Braze will restore from cache)', 'user');
    }
    
    // Open session
    braze.openSession();
    
    brazeInitialized = true;
    console.log('[Braze] SDK initialized successfully');
    devLog('Braze SDK initialized', 'info');
    
    // Process any queued events
    processEventQueue();
    
    // Update developer dialog
    updateDevUserStatus();
    
    return true;
  } catch (error) {
    console.error('[Braze] Initialization error:', error);
    devLog('Error: ' + error.message, 'error');
    return false;
  }
}

// Process queued events after SDK is ready
function processEventQueue() {
  if (eventQueue.length === 0) return;
  
  console.log(`[Braze] Processing ${eventQueue.length} queued events`);
  devLog(`Processing ${eventQueue.length} queued events`, 'info');
  
  while (eventQueue.length > 0) {
    const item = eventQueue.shift();
    
    if (item.type === 'event') {
      if (braze.logCustomEvent) {
        braze.logCustomEvent(item.eventName, item.properties);
        devLog(`Event: ${item.eventName}`, 'event');
      }
    } else if (item.type === 'purchase') {
      if (braze.logPurchase) {
        braze.logPurchase(item.productId, item.price, item.currency, item.quantity, item.properties);
        devLog(`Purchase: ${item.productId}`, 'purchase');
      }
    }
  }
}

// Load Braze SDK from CDN
(function() {
  // Create script element for Braze SDK
  const script = document.createElement('script');
  script.src = 'https://js.appboycdn.com/web-sdk/5.8/braze.min.js';
  script.async = true;
  script.onload = function() {
    console.log('[Braze] SDK script loaded');
    initializeBraze();
  };
  script.onerror = function() {
    console.error('[Braze] Failed to load SDK script');
    devLog('Failed to load Braze SDK from CDN', 'error');
  };
  document.head.appendChild(script);
})();

// ========================================
// Developer Console Logging
// ========================================

function devLog(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    fractionalSecondDigits: 2
  });
  
  const entry = { timestamp, message, type };
  consoleLog.push(entry);
  
  // Keep only last 100 entries
  if (consoleLog.length > 100) {
    consoleLog.shift();
  }
  
  // Update the console display if dialog is open
  updateDevConsole();
  
  // Also update the demo panel log
  logToDemo(message);
}

function updateDevConsole() {
  const logEl = document.getElementById('devConsoleLog');
  if (!logEl) return;
  
  logEl.innerHTML = consoleLog.map(entry => `
    <div class="dev-console-entry ${entry.type}">
      <span class="dev-console-time">${entry.timestamp}</span>
      <span class="dev-console-msg">${entry.message}</span>
    </div>
  `).join('');
  
  logEl.scrollTop = logEl.scrollHeight;
}

function clearDevConsole() {
  consoleLog.length = 0;
  updateDevConsole();
  devLog('Console cleared', 'info');
}

// ========================================
// Braze Tracking Functions
// Using Braze eCommerce Recommended Events
// See: ecommerce_events.md for full schema
// ========================================

const BrazeTracker = {
  // Get the source URL for ecommerce events
  getSource() {
    return window.location.origin;
  },

  // Generate a cart ID (persisted per session)
  getCartId() {
    let cartId = sessionStorage.getItem('braze_cart_id');
    if (!cartId) {
      cartId = 'cart_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('braze_cart_id', cartId);
    }
    return cartId;
  },

  // Track page view (custom event for general pages)
  trackPageView(pageName) {
    this.trackEvent('page_viewed', { page_name: pageName });
  },
  
  // ========================================
  // ecommerce.product_viewed
  // Triggered when a customer views a product detail page
  // ========================================
  trackProductView(product) {
    const eventProperties = {
      product_id: product.id.toString(),
      product_name: product.name,
      variant_id: product.id.toString(), // Using product ID as variant for simplicity
      image_url: window.location.origin + '/' + product.image,
      product_url: window.location.origin + '/product.html?id=' + product.id,
      price: product.price,
      currency: 'GBP',
      source: this.getSource(),
      metadata: {
        brand: product.brand,
        category: product.category,
        rrp: product.rrp || null,
        discount_percent: product.rrp ? Math.round((1 - product.price / product.rrp) * 100) : 0
      }
    };
    
    this.trackEvent('ecommerce.product_viewed', eventProperties);
  },
  
  // ========================================
  // ecommerce.cart_updated
  // Triggered when products are added, removed, or updated in the cart
  // ========================================
  trackCartUpdated() {
    const cartItems = Cart.getItems();
    const products = cartItems.map(item => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return {
        product_id: product.id.toString(),
        product_name: product.name,
        variant_id: product.id.toString(),
        image_url: window.location.origin + '/' + product.image,
        product_url: window.location.origin + '/product.html?id=' + product.id,
        quantity: item.quantity,
        price: product.price,
        metadata: {
          brand: product.brand,
          category: product.category
        }
      };
    }).filter(p => p !== null);

    const totalValue = cartItems.reduce((sum, item) => {
      const product = getProductById(item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    const eventProperties = {
      cart_id: this.getCartId(),
      currency: 'GBP',
      total_value: totalValue,
      products: products,
      source: this.getSource(),
      metadata: {}
    };
    
    this.trackEvent('ecommerce.cart_updated', eventProperties);
  },

  // Track add to cart (calls cart_updated with additional logging)
  trackAddToCart(product, quantity = 1) {
    devLog(`Added to cart: ${product.name} x${quantity}`, 'event');
    // Track the cart update event
    this.trackCartUpdated();
  },
  
  // ========================================
  // ecommerce.checkout_started
  // Triggered when a customer starts the checkout process
  // ========================================
  trackCheckoutStarted() {
    const cartItems = Cart.getItems();
    const products = cartItems.map(item => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return {
        product_id: product.id.toString(),
        product_name: product.name,
        variant_id: product.id.toString(),
        image_url: window.location.origin + '/' + product.image,
        product_url: window.location.origin + '/product.html?id=' + product.id,
        quantity: item.quantity,
        price: product.price,
        metadata: {
          brand: product.brand,
          category: product.category
        }
      };
    }).filter(p => p !== null);

    const totalValue = Cart.getTotal();
    const checkoutId = 'checkout_' + Date.now().toString(36);

    const eventProperties = {
      checkout_id: checkoutId,
      cart_id: this.getCartId(),
      total_value: totalValue,
      currency: 'GBP',
      products: products,
      source: this.getSource(),
      metadata: {
        checkout_url: window.location.href
      }
    };
    
    // Store checkout ID for order_placed event
    sessionStorage.setItem('braze_checkout_id', checkoutId);
    
    this.trackEvent('ecommerce.checkout_started', eventProperties);
  },
  
  // ========================================
  // ecommerce.order_placed
  // Triggered when a customer successfully places an order
  // ========================================
  trackOrderPlaced(orderId, cartItems, totalValue, discountCode = null) {
    const products = cartItems.map(item => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return {
        product_id: product.id.toString(),
        product_name: product.name,
        variant_id: product.id.toString(),
        image_url: window.location.origin + '/' + product.image,
        product_url: window.location.origin + '/product.html?id=' + product.id,
        quantity: item.quantity,
        price: product.price,
        metadata: {
          brand: product.brand,
          category: product.category
        }
      };
    }).filter(p => p !== null);

    const eventProperties = {
      order_id: orderId,
      cart_id: this.getCartId(),
      total_value: totalValue,
      currency: 'GBP',
      total_discounts: discountCode ? 10.00 : 0, // Example discount
      discounts: discountCode ? [{ code: discountCode, amount: 10.00 }] : [],
      products: products,
      source: this.getSource(),
      metadata: {
        order_status_url: window.location.origin + '/order-status.html?id=' + orderId,
        order_number: orderId
      }
    };
    
    this.trackEvent('ecommerce.order_placed', eventProperties);
    
    // Clear the cart ID for the next session
    sessionStorage.removeItem('braze_cart_id');
    sessionStorage.removeItem('braze_checkout_id');
  },

  // Track category view
  trackCategoryView(category) {
    this.trackEvent('category_viewed', { category_name: category });
  },
  
  // Track search
  trackSearch(query) {
    this.trackEvent('searched_products', { search_query: query });
  },
  
  // Legacy purchase tracking (still useful for revenue attribution)
  trackPurchase(product, quantity = 1, properties = {}) {
    const purchaseProps = {
      product_name: product.name,
      brand: product.brand,
      category: product.category,
      ...properties
    };
    
    if (typeof braze !== 'undefined' && braze.logPurchase && sdkEnabled && brazeInitialized) {
      braze.logPurchase(
        product.id.toString(),
        product.price,
        'GBP',
        quantity,
        purchaseProps
      );
      devLog(`Purchase: ${product.name} x${quantity} = £${(product.price * quantity).toFixed(2)}`, 'purchase');
    } else if (!brazeInitialized) {
      // Queue the purchase for when SDK is ready
      eventQueue.push({ 
        type: 'purchase', 
        productId: product.id.toString(),
        price: product.price,
        currency: 'GBP',
        quantity: quantity,
        properties: purchaseProps
      });
      console.log('[Braze] Queued purchase (SDK loading):', product.name);
      devLog(`Queued Purchase: ${product.name}`, 'info');
    } else {
      console.log('[Braze Mock] Purchase:', product.name, quantity, product.price);
      devLog(`[Mock] Purchase: ${product.name}`, 'purchase');
    }
  },
  
  // Track custom event
  trackEvent(eventName, properties = {}) {
    if (typeof braze !== 'undefined' && braze.logCustomEvent && sdkEnabled && brazeInitialized) {
      braze.logCustomEvent(eventName, properties);
      devLog(`Event: ${eventName}`, 'event');
    } else if (!brazeInitialized) {
      // Queue the event for when SDK is ready
      eventQueue.push({ type: 'event', eventName, properties });
      console.log('[Braze] Queued event (SDK loading):', eventName);
      devLog(`Queued: ${eventName}`, 'info');
    } else {
      console.log('[Braze Mock] Event:', eventName, properties);
      devLog(`[Mock] Event: ${eventName}`, 'event');
    }
  },
  
  // Identify user - returns a promise that resolves after changeUser sync completes
  async identifyUser(userId, attributes = {}) {
    if (typeof braze !== 'undefined' && braze.changeUser && sdkEnabled) {
      // changeUser returns a promise - we must await it before logging events
      // This ensures in-app message triggers are synced for the new user
      await braze.changeUser(userId);
      
      // Set user attributes
      const user = braze.getUser();
      if (user) {
        if (attributes.name) {
          const [firstName, ...lastNameParts] = attributes.name.split(' ');
          user.setFirstName(firstName);
          if (lastNameParts.length > 0) {
            user.setLastName(lastNameParts.join(' '));
          }
        }
        if (attributes.email) {
          user.setEmail(attributes.email);
        }
        if (attributes.favorite_category) {
          user.setCustomUserAttribute('favorite_category', attributes.favorite_category);
        }
      }
      
      devLog(`User identified: ${userId}`, 'user');
    } else {
      console.log('[Braze Mock] User identified:', userId, attributes);
      devLog(`[Mock] User: ${userId}`, 'user');
    }
    
    // Update developer dialog
    updateDevUserStatus();
  },
  
  // Clear user (logout)
  clearUser() {
    this.trackEvent('user_logged_out');
    devLog('User logged out', 'user');
    updateDevUserStatus();
  }
};

// ========================================
// Developer Dialog Functions
// ========================================

function openDevDialog() {
  const overlay = document.getElementById('devDialogOverlay');
  if (overlay) {
    overlay.classList.add('open');
    updateDevUserStatus();
    updateDevConsole();
    updateDevToggles();
  }
}

function closeDevDialog() {
  const overlay = document.getElementById('devDialogOverlay');
  if (overlay) {
    overlay.classList.remove('open');
  }
}

function updateDevUserStatus() {
  const statusEl = document.getElementById('devUserStatusValue');
  const userIdEl = document.getElementById('devUserIdValue');
  
  if (!statusEl || !userIdEl) return;
  
  const user = UserSession.getUser();
  
  if (user) {
    statusEl.textContent = 'Identified';
    statusEl.className = 'dev-user-status-value identified';
    userIdEl.textContent = user.id;
    userIdEl.className = 'dev-user-status-value';
  } else {
    statusEl.textContent = 'Anonymous';
    statusEl.className = 'dev-user-status-value anonymous';
    userIdEl.textContent = 'Not set';
    userIdEl.className = 'dev-user-status-value anonymous';
  }
}

function updateDevToggles() {
  const loggingToggle = document.getElementById('devToggleLogging');
  const sdkToggle = document.getElementById('devToggleSdk');
  
  if (loggingToggle) {
    loggingToggle.classList.toggle('active', loggingEnabled);
  }
  if (sdkToggle) {
    sdkToggle.classList.toggle('active', sdkEnabled);
  }
}

function toggleDevLogging() {
  loggingEnabled = !loggingEnabled;
  
  if (typeof braze !== 'undefined' && braze.toggleLogging) {
    braze.toggleLogging();
    devLog(`Braze logging ${loggingEnabled ? 'enabled' : 'disabled'}`, 'info');
  }
  
  updateDevToggles();
}

function toggleDevSdk() {
  sdkEnabled = !sdkEnabled;
  
  if (typeof braze !== 'undefined') {
    if (sdkEnabled) {
      braze.enableSDK();
      devLog('Braze SDK enabled', 'info');
    } else {
      braze.disableSDK();
      devLog('Braze SDK disabled', 'info');
    }
  }
  
  updateDevToggles();
}

function setDevUserId() {
  const input = document.getElementById('devUserIdInput');
  if (!input) return;
  
  const userId = input.value.trim();
  if (!userId) {
    showNotification('Please enter a user ID', 'error');
    return;
  }
  
  // Create a simple user object
  const user = {
    id: userId,
    name: userId.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    email: userId + '@demo.ariasports.com'
  };
  
  // Save to session
  UserSession.setUser(user);
  
  // Identify in Braze
  BrazeTracker.identifyUser(userId, user);
  
  // Clear input
  input.value = '';
  
  // Update status
  updateDevUserStatus();
  
  showNotification(`User set to: ${userId}`);
}

function resetDevToAnonymous() {
  // Clear local session
  UserSession.clearUser();
  
  // For Braze Web SDK, there's no true "logout" - we disable and re-enable to reset
  if (typeof braze !== 'undefined') {
    // Disable and re-enable SDK to reset session
    braze.disableSDK();
    
    // Small delay then re-enable
    setTimeout(() => {
      braze.enableSDK();
      braze.openSession();
      devLog('Session reset to anonymous', 'user');
      updateDevUserStatus();
    }, 100);
  }
  
  devLog('Resetting to anonymous user...', 'user');
  showNotification('Session reset to anonymous');
  
  // Reload page to ensure clean state
  setTimeout(() => {
    window.location.reload();
  }, 500);
}

function newDevSession() {
  if (typeof braze !== 'undefined' && braze.openSession) {
    braze.openSession();
    devLog('New session started', 'info');
    showNotification('New Braze session started');
  }
}

// ========================================
// Demo Panel Functions (kept for compatibility)
// ========================================

const BrazeDemo = {
  // Sample user data for demo
  sampleUsers: [
    { name: 'Alex Thompson', email: 'alex.thompson@demo.com' },
    { name: 'Sarah Chen', email: 'sarah.chen@demo.com' },
    { name: 'Marcus Williams', email: 'marcus.williams@demo.com' },
    { name: 'Emma Rodriguez', email: 'emma.rodriguez@demo.com' },
    { name: 'James Park', email: 'james.park@demo.com' },
    { name: 'Olivia Brown', email: 'olivia.brown@demo.com' }
  ],
  
  // Login as a random user
  loginRandomUser() {
    const user = this.sampleUsers[Math.floor(Math.random() * this.sampleUsers.length)];
    const userId = user.email.replace(/[^a-zA-Z0-9]/g, '_');
    const favoriteCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    
    // Save to session
    UserSession.setUser({
      id: userId,
      name: user.name,
      email: user.email,
      favoriteCategory: favoriteCategory
    });
    
    // Identify in Braze
    BrazeTracker.identifyUser(userId, {
      name: user.name,
      email: user.email,
      favorite_category: favoriteCategory
    });
    
    showNotification(`Logged in as ${user.name}`);
    updateDevUserStatus();
    
    // Refresh page if on account page
    if (window.location.pathname.includes('account.html')) {
      location.reload();
    }
  },
  
  // Logout
  logout() {
    resetDevToAnonymous();
  },
  
  // Log a test event
  logTestEvent(eventName) {
    const properties = {
      test: true,
      timestamp: new Date().toISOString(),
      page: window.location.pathname
    };
    
    BrazeTracker.trackEvent(eventName, properties);
    showNotification(`Event logged: ${eventName}`);
  },
  
  // Log a test purchase
  logTestPurchase() {
    // Get a random product
    const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    
    BrazeTracker.trackPurchase(product, 1, {
      test_purchase: true,
      timestamp: new Date().toISOString()
    });
    
    showNotification(`Test purchase logged: ${product.name}`);
  },
  
  // Log ecommerce.product_viewed event
  logTestProductViewed() {
    const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    BrazeTracker.trackProductView(product);
    showNotification(`ecommerce.product_viewed: ${product.name}`);
  },
  
  // Log ecommerce.cart_updated event
  logTestCartUpdated() {
    // Add a random product to cart first
    const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    Cart.addItem(product.id, 1);
    showNotification(`ecommerce.cart_updated: Added ${product.name}`);
  },
  
  // Log ecommerce.checkout_started event
  logTestCheckoutStarted() {
    // Make sure there's something in the cart
    if (Cart.getItemCount() === 0) {
      const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      Cart.addItem(product.id, 1);
    }
    BrazeTracker.trackCheckoutStarted();
    showNotification('ecommerce.checkout_started logged');
  },
  
  // Log ecommerce.order_placed event
  logTestOrderPlaced() {
    // Make sure there's something in the cart
    if (Cart.getItemCount() === 0) {
      const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      Cart.addItem(product.id, 1);
    }
    
    const orderId = 'TEST-' + Date.now().toString(36).toUpperCase();
    const items = Cart.getItems();
    const total = Cart.getTotal();
    
    BrazeTracker.trackOrderPlaced(orderId, items, total);
    showNotification(`ecommerce.order_placed: ${orderId}`);
  },
  
  // Request content cards
  requestContentCards() {
    if (typeof braze !== 'undefined' && braze.requestContentCardsRefresh) {
      braze.requestContentCardsRefresh();
      devLog('Content Cards refresh requested', 'info');
    } else {
      devLog('[Mock] Content Cards refresh', 'info');
    }
  }
};

// ========================================
// Helper Functions
// ========================================

// Log message to demo panel (legacy support)
function logToDemo(message) {
  const logEl = document.getElementById('demoLog');
  if (!logEl) return;
  
  const timestamp = new Date().toLocaleTimeString();
  const entry = document.createElement('div');
  entry.className = 'demo-log-entry';
  entry.textContent = `[${timestamp}] ${message}`;
  
  // Keep only last 20 entries
  while (logEl.children.length >= 20) {
    logEl.removeChild(logEl.firstChild);
  }
  
  logEl.appendChild(entry);
  logEl.scrollTop = logEl.scrollHeight;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  const user = UserSession.getUser();
  updateDevUserStatus();
  
  // Initial log entry
  devLog('Page loaded: ' + window.location.pathname, 'info');
});

// Create and inject the developer dialog HTML
function createDevDialog() {
  const dialogHTML = `
    <!-- Developer Cog Button -->
    <button class="dev-cog" onclick="openDevDialog()" aria-label="Developer Settings" title="Developer Settings">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    </button>

    <!-- Developer Dialog Overlay -->
    <div class="dev-dialog-overlay" id="devDialogOverlay" onclick="if(event.target === this) closeDevDialog()">
      <div class="dev-dialog">
        <div class="dev-dialog-header">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>
            Braze Developer Tools
          </h2>
          <button class="dev-dialog-close" onclick="closeDevDialog()" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
          </button>
        </div>
        
        <div class="dev-dialog-body">
          <!-- User Status -->
          <div class="dev-section">
            <div class="dev-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Current User
            </div>
            <div class="dev-user-status">
              <div class="dev-user-status-item">
                <span class="dev-user-status-label">Status</span>
                <span class="dev-user-status-value anonymous" id="devUserStatusValue">Anonymous</span>
              </div>
              <div class="dev-user-status-item">
                <span class="dev-user-status-label">User ID</span>
                <span class="dev-user-status-value anonymous" id="devUserIdValue">Not set</span>
              </div>
            </div>
          </div>
          
          <!-- Set User ID -->
          <div class="dev-section">
            <div class="dev-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Change User
            </div>
            <div class="dev-input-group">
              <input type="text" id="devUserIdInput" placeholder="Enter user_id (e.g. user_123)">
              <button class="btn btn-primary btn-sm" onclick="setDevUserId()">Set</button>
            </div>
            <div class="dev-actions">
              <button class="btn btn-secondary btn-sm" onclick="BrazeDemo.loginRandomUser()">
                Random User
              </button>
              <button class="btn btn-outline btn-sm" onclick="resetDevToAnonymous()">
                Reset to Anonymous
              </button>
            </div>
          </div>
          
          <!-- eCommerce Events -->
          <div class="dev-section">
            <div class="dev-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
              Test eCommerce Events
            </div>
            <div class="dev-actions" style="flex-direction: column;">
              <button class="btn btn-secondary btn-sm" onclick="BrazeDemo.logTestProductViewed()" style="width: 100%; font-size: 0.75rem;">
                ecommerce.product_viewed
              </button>
              <button class="btn btn-secondary btn-sm" onclick="BrazeDemo.logTestCartUpdated()" style="width: 100%; font-size: 0.75rem;">
                ecommerce.cart_updated
              </button>
              <button class="btn btn-secondary btn-sm" onclick="BrazeDemo.logTestCheckoutStarted()" style="width: 100%; font-size: 0.75rem;">
                ecommerce.checkout_started
              </button>
              <button class="btn btn-secondary btn-sm" onclick="BrazeDemo.logTestOrderPlaced()" style="width: 100%; font-size: 0.75rem;">
                ecommerce.order_placed
              </button>
            </div>
          </div>
          
          <!-- SDK Controls -->
          <div class="dev-section">
            <div class="dev-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              SDK Controls
            </div>
            <div class="dev-toggle-row">
              <span class="dev-toggle-label">Console Logging</span>
              <div class="dev-toggle active" id="devToggleLogging" onclick="toggleDevLogging()"></div>
            </div>
            <div class="dev-toggle-row">
              <span class="dev-toggle-label">SDK Enabled</span>
              <div class="dev-toggle active" id="devToggleSdk" onclick="toggleDevSdk()"></div>
            </div>
            <div style="margin-top: var(--spacing-md);">
              <button class="btn btn-outline btn-sm" onclick="newDevSession()" style="width: 100%;">
                Start New Session
              </button>
            </div>
          </div>
          
          <!-- Console -->
          <div class="dev-section">
            <div class="dev-section-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" x2="20" y1="19" y2="19"></line></svg>
              Event Console
            </div>
            <div class="dev-console">
              <div class="dev-console-header">
                <span class="dev-console-title">Braze Events</span>
                <button class="dev-console-clear" onclick="clearDevConsole()">Clear</button>
              </div>
              <div class="dev-console-log" id="devConsoleLog">
                <div class="dev-console-entry info">
                  <span class="dev-console-time">--:--:--</span>
                  <span class="dev-console-msg">Waiting for events...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Inject into page
  document.body.insertAdjacentHTML('beforeend', dialogHTML);
}

// Create the dialog when DOM is ready
document.addEventListener('DOMContentLoaded', createDevDialog);
