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

console.log('\nALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
