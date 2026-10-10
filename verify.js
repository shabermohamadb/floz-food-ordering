import { sanitizePhoneNumber, formatOrderMessage, generateWhatsAppOrderLink } from './src/utils/whatsappFormatter.js';
import { INITIAL_BUSINESS_CONFIG } from './src/config/businessConfig.js';
import fs from 'fs';
import path from 'path';

console.log('--- 1. Testing Phone Sanitization ---');
const testNumbers = [
  { input: '+91 94420 12345', expected: '919442012345' },
  { input: '9442012345', expected: '919442012345' },
  { input: '+91-94420-12345', expected: '919442012345' },
  { input: '   +91 9876543210   ', expected: '919876543210' }
];

for (const t of testNumbers) {
  const result = sanitizePhoneNumber(t.input);
  if (result !== t.expected) {
    console.error(`FAIL: ${t.input} -> got ${result}, expected ${t.expected}`);
    process.exit(1);
  }
}
console.log('PASS: All phone sanitization tests passed.');

console.log('\n--- 2. Testing WhatsApp Message Formatting with Verified Shop ---');
const sampleCart = [
  { id: 'hot-garlic-chicken', name: 'HOT GARLIC CHICKEN', price: 160, quantity: 1 },
  { id: 'grill-chicken-full', name: 'Grill chicken full', price: 480, quantity: 1 }
];

const subtotal = 160 + 480; // 640
const total = subtotal;

// Test Pickup
const pickupMsg = formatOrderMessage({
  shopName: INITIAL_BUSINESS_CONFIG.shopName,
  cartItems: sampleCart,
  subtotal,
  deliveryFee: 0,
  total,
  fulfillmentType: 'pickup',
  customerDetails: { name: 'Karthik Raja', phone: '9442011111', notes: 'Extra mayonnaise please' }
});

if (!pickupMsg.includes('HOT GARLIC CHICKEN') ||
    !pickupMsg.includes('Grill chicken full') ||
    !pickupMsg.includes('Rs. 640') ||
    !pickupMsg.includes('Store Pickup / Takeaway') ||
    !pickupMsg.includes('Extra mayonnaise please')) {
  console.error('FAIL: Pickup message content missing required fields:\n', pickupMsg);
  process.exit(1);
}
console.log('PASS: Pickup message formatted successfully.');

// Test URL link generation
const linkRes = generateWhatsAppOrderLink({
  phoneNumber: '+91 94420 12345',
  shopName: INITIAL_BUSINESS_CONFIG.shopName,
  cartItems: sampleCart,
  subtotal,
  deliveryFee: 0,
  total,
  fulfillmentType: 'pickup',
  customerDetails: { name: 'Karthik Raja' }
});

if (!linkRes.success || !linkRes.url.startsWith('https://wa.me/919442012345?text=')) {
  console.error('FAIL: WhatsApp link generation failed:', linkRes);
  process.exit(1);
}
console.log('PASS: WhatsApp link generation passed.');

console.log('\n--- 3. Testing Persistent Data Files & Images on Disk ---');
const menuFile = './data/menu.json';
if (!fs.existsSync(menuFile)) {
  console.error('FAIL: data/menu.json does not exist');
  process.exit(1);
}

const menuItems = JSON.parse(fs.readFileSync(menuFile, 'utf8'));
if (!Array.isArray(menuItems) || menuItems.length === 0) {
  console.error('FAIL: Menu items array is empty');
  process.exit(1);
}

for (const item of menuItems) {
  if (!item.id || !item.name || typeof item.price !== 'number' || item.price <= 0 || !item.category) {
    console.error('FAIL: Invalid item schema:', item);
    process.exit(1);
  }
  // Check image exists on disk
  const imgPath = path.join('./public', item.image);
  if (!fs.existsSync(imgPath)) {
    console.error(`FAIL: Image does not exist on disk: ${imgPath} for item ${item.name}`);
    process.exit(1);
  }
}
console.log(`PASS: Validated all ${menuItems.length} menu items and their high-res images on disk.`);

console.log('\n--- 4. Checking for Emojis in Source Code (Strict Rule) ---');
const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u;
function checkDirForEmojis(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      checkDirForEmojis(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.html') || file.endsWith('.css')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const match = content.match(emojiRegex);
      if (match) {
        console.error(`FAIL: Found forbidden emoji in ${fullPath}: "${match[0]}"`);
        process.exit(1);
      }
    }
  }
}
checkDirForEmojis('./src');
console.log('PASS: Zero emojis found anywhere in frontend or admin source files.');

console.log('\n--- 5. Testing Cash on Delivery (COD) Order Workflow & Server Security ---');

async function verifyCODWorkflow() {
  try {
    // 5a. Test order creation with price tampering protection
    const tamperRes = await fetch('http://localhost:5173/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Karthik Raja',
        phone: '9442011111',
        fulfillmentType: 'delivery',
        address: '42 Asambu Road, Vadasery',
        locality: 'Vadasery',
        items: [{ id: 'grill-chicken-full', price: 10, quantity: 2 }] // Attempting to tamper price to 10
      })
    });

    if (tamperRes.status !== 201) {
      console.error('FAIL: Expected 201 Created from /api/orders, got', tamperRes.status);
      process.exit(1);
    }

    const orderData = await tamperRes.json();
    const order = orderData.order;

    // Check DB price enforcement: grill-chicken-full is 480 each, qty 2 = 960, delivery = 30, total = 990
    if (order.subtotal !== 960 || order.deliveryFee !== 30 || order.total !== 990) {
      console.error('FAIL: Server-side price calculation failed or trusted client price:', order);
      process.exit(1);
    }

    if (order.paymentMethod !== 'COD' || order.paymentStatus !== 'Unpaid' || order.orderStatus !== 'Pending') {
      console.error('FAIL: Initial COD order states incorrect:', order);
      process.exit(1);
    }
    console.log(`PASS: Created order ${order.id} with secure server price calculation (Rs. 990 total).`);

    // 5b. Test rejection of invalid phone numbers
    const invalidPhoneRes = await fetch('http://localhost:5173/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Karthik Raja',
        phone: '12345',
        fulfillmentType: 'delivery',
        address: '42 Asambu Road',
        items: [{ id: 'grill-chicken-full', quantity: 1 }]
      })
    });

    if (invalidPhoneRes.status !== 400) {
      console.error('FAIL: Expected 400 Bad Request for invalid phone number, got', invalidPhoneRes.status);
      process.exit(1);
    }
    console.log('PASS: Rejected order with invalid 5-digit phone number.');

    // 5c. Test Admin Authentication & Status Transition
    const authRes = await fetch('http://localhost:5173/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'floz@nagercoil2026' })
    });
    const authData = await authRes.json();
    const token = authData.token;

    // Update status to 'Preparing'
    const statusRes = await fetch(`http://localhost:5173/api/orders/${order.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: 'Preparing' })
    });
    const updatedStatusOrder = await statusRes.json();
    if (updatedStatusOrder.orderStatus !== 'Preparing') {
      console.error('FAIL: Order status update failed:', updatedStatusOrder);
      process.exit(1);
    }
    console.log('PASS: Admin updated order status to "Preparing".');

    // 5d. Test COD Payment Status Update (Independent of status)
    const payRes = await fetch(`http://localhost:5173/api/orders/${order.id}/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ paymentStatus: 'Paid' })
    });
    const updatedPayOrder = await payRes.json();
    if (updatedPayOrder.paymentStatus !== 'Paid' || !updatedPayOrder.paidAt) {
      console.error('FAIL: COD payment status update failed:', updatedPayOrder);
      process.exit(1);
    }
    console.log('PASS: Admin marked COD cash as "Paid" with recorded timestamp.');

    console.log('\nALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('FAIL: Workflow test error:', err);
    process.exit(1);
  }
}

verifyCODWorkflow();

