# Braze Web SDK Integration Learnings

This document captures key learnings from building the Aria Sports demo e-commerce site with Braze Web SDK integration.

---

## 1. SDK Initialization & Async Loading

### Problem
The Braze Web SDK loads asynchronously. Events fired before the SDK is fully initialized will be lost.

### Solution
Implement an **event queue** that stores events until the SDK is ready:

```javascript
const eventQueue = [];
let brazeInitialized = false;

function trackEvent(eventName, properties) {
  if (brazeInitialized && braze.isInitialized()) {
    braze.logCustomEvent(eventName, properties);
  } else {
    // Queue for later
    eventQueue.push({ eventName, properties });
  }
}

function processEventQueue() {
  while (eventQueue.length > 0) {
    const event = eventQueue.shift();
    braze.logCustomEvent(event.eventName, event.properties);
  }
}
```

Call `processEventQueue()` after `braze.initialize()` completes.

---

## 2. changeUser() Must Be Awaited

### Problem
When calling `changeUser()`, Braze syncs with the backend to fetch in-app message triggers for that user. Events logged *during* this sync won't trigger IAMs:

```
Braze: Trigger sync is currently in progress, awaiting sync completion before firing trigger event.
Braze: Trigger event custom_event did not match any trigger conditions.
```

### Solution
`changeUser()` returns a **Promise**. You must `await` it before logging events:

```javascript
// ❌ BAD - event fires before sync completes
braze.changeUser(userId);
braze.logCustomEvent("ecommerce.order_placed", properties);

// ✅ GOOD - event fires after sync completes
await braze.changeUser(userId);
braze.logCustomEvent("ecommerce.order_placed", properties);
```

This is critical for checkout flows where you identify the user and immediately log a purchase event.

---

## 3. Don't Call changeUser() on Every Page Load

### Problem
It's tempting to "restore" the user session on every page load:

```javascript
// In SDK initialization
const user = getStoredUser();
if (user) {
  braze.changeUser(user.id); // Called on EVERY page load!
}
```

This causes unnecessary backend syncs and can interfere with IAM trigger timing.

### Solution
**Don't restore users manually.** The Braze SDK persists user identity in IndexedDB automatically.

Only call `changeUser()` when:
- User explicitly logs in
- User provides identity during checkout
- User ID is set via developer/debug controls

```javascript
// On page load - let Braze handle it
braze.openSession(); // Braze restores user from IndexedDB

// Only call changeUser on explicit user actions
async function handleLogin(userId) {
  await braze.changeUser(userId);
  braze.logCustomEvent("user_logged_in");
}
```

---

## 4. Service Worker for Push Notifications

### Problem
Braze SDK tries to register a service worker for push notifications. If the file doesn't exist, you'll see:

```
A bad HTTP response code (404) was received when fetching the script.
Braze SDK Error: ServiceWorker registration failed
```

### Solution
Create a basic `service-worker.js` at the root:

```javascript
self.addEventListener('push', function(event) {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
```

Configure in Braze initialization:
```javascript
braze.initialize(apiKey, {
  baseUrl: endpoint,
  serviceWorkerLocation: '/service-worker.js',
  manageServiceWorkerExternally: false
});
```

---

## 5. Braze eCommerce Recommended Events

Braze has specific recommended event schemas for e-commerce. Use these for best compatibility with Braze's e-commerce features:

| Event | When to Fire |
|-------|--------------|
| `ecommerce.product_viewed` | User views a product detail page |
| `ecommerce.cart_updated` | Items added/removed/quantity changed |
| `ecommerce.checkout_started` | User begins checkout flow |
| `ecommerce.order_placed` | Order successfully completed |

### Event Property Structure

```javascript
// ecommerce.product_viewed
braze.logCustomEvent("ecommerce.product_viewed", {
  products: [{
    product_id: "123",
    product_name: "Running Shoes",
    price: 99.99,
    currency: "USD",
    brand: "Nike",
    category: "Footwear"
  }]
});

// ecommerce.order_placed
braze.logCustomEvent("ecommerce.order_placed", {
  order_id: "ORD-12345",
  currency: "USD",
  total: 149.99,
  products: [/* array of product objects */]
});
```

### Also Log Purchases for Revenue

The eCommerce events are for analytics and triggers. For **revenue tracking**, also call `logPurchase()`:

```javascript
// Log the event for triggers/segmentation
braze.logCustomEvent("ecommerce.order_placed", orderProperties);

// Log purchases for revenue attribution
items.forEach(item => {
  braze.logPurchase(item.productId, item.price, "USD", item.quantity, {
    order_id: orderId
  });
});
```

---

## 6. In-App Message Trigger Timing

### Key Insight
IAMs are triggered based on events, but the triggers must be **synced from the backend** first. This sync happens:
- After `changeUser()` 
- After `openSession()`
- Periodically during the session

### Best Practice Order
```javascript
// 1. Initialize
braze.initialize(apiKey, options);

// 2. Enable IAM display
braze.automaticallyShowInAppMessages();

// 3. Change user (if known) - AWAIT this!
if (userId) {
  await braze.changeUser(userId);
}

// 4. Open session (this also triggers sync)
braze.openSession();

// 5. NOW log events - triggers are synced
braze.logCustomEvent("page_viewed");
```

---

## 7. Developer/Debug Panel Best Practices

For demo sites, include a developer panel that allows:

1. **View logged events** - Console showing all Braze events
2. **Set/change user ID** - For testing different user scenarios
3. **Reset to anonymous** - Clear user identity for fresh demos
4. **Toggle SDK logging** - Enable `braze.toggleLogging()`
5. **Force new session** - Call `braze.openSession()`
6. **Test event buttons** - Quick-fire test events

### Resetting to Anonymous
There's no true "logout" in Braze Web SDK. To reset:

```javascript
function resetToAnonymous() {
  braze.disableSDK();
  setTimeout(() => {
    braze.enableSDK();
    braze.openSession();
    // Optionally reload page for clean state
    window.location.reload();
  }, 100);
}
```

---

## 8. Common Console Messages Explained

| Message | Meaning |
|---------|---------|
| `Current user is already X. Doing nothing.` | `changeUser()` called with same ID - no action taken |
| `Trigger sync is currently in progress` | Waiting for backend sync before evaluating triggers |
| `Trigger event X did not match any trigger conditions` | Event fired but no IAM campaign matches it |
| `Generating session start event` | New session started |

---

## 9. LocalStorage vs Braze Persistence

- **Your app's localStorage**: Store user preferences, cart, session data
- **Braze's IndexedDB**: Stores user identity, event queue, IAM state

These are separate! Don't assume syncing localStorage means Braze is synced. Trust Braze's own persistence for user identity.

---

## 10. Testing IAM Campaigns

1. Ensure the user is identified **before** the trigger event
2. Wait for `changeUser()` to complete (await the promise)
3. Check console for "Trigger sync" messages
4. Verify campaign is active and targeting the test user
5. Check segment/filter conditions match the test user

---

## Summary Checklist

- [ ] Queue events until SDK is initialized
- [ ] `await changeUser()` before logging events
- [ ] Don't call `changeUser()` on every page load
- [ ] Create service-worker.js for push support
- [ ] Use Braze eCommerce recommended event schemas
- [ ] Log both custom events AND purchases for orders
- [ ] Include developer controls for demos
- [ ] Test IAM timing with new users

