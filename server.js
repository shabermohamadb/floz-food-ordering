import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'floz_tech_secret_2026_nagercoil_secure_key';

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Helpers for reading/writing data safely
const readJson = (filePath, fallback = []) => {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
};

const writeJson = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanName}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowed.test(ext) || allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WEBP, and GIF images are allowed.'));
    }
  }
});

// Authentication Middleware
export const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Token expired or invalid' });
  }
};

// ==================== AUTH ROUTES ====================

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const users = readJson(USERS_FILE, []);
  const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    }
  });
});

app.get('/api/auth/me', requireAdmin, (req, res) => {
  return res.json({ user: req.user });
});

// ==================== MENU ROUTES ====================

// Public: Get all menu items
app.get('/api/menu', (req, res) => {
  const items = readJson(MENU_FILE, []);
  return res.json(items);
});

// Admin: Create new food item
app.post('/api/menu', requireAdmin, (req, res) => {
  const { name, category, categoryLabel, price, originalPrice, description, isVeg, isBestseller, isAvailable, image } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Food item name is required' });
  }
  const numPrice = Number(price);
  if (isNaN(numPrice) || numPrice <= 0) {
    return res.status(400).json({ error: 'Valid price in INR is required' });
  }

  const items = readJson(MENU_FILE, []);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = `${slug}-${Date.now().toString().slice(-4)}`;

  const newItem = {
    id,
    name: name.trim(),
    category: category || 'starters-chicken',
    categoryLabel: categoryLabel || 'Starters & Chicken',
    price: numPrice,
    originalPrice: originalPrice ? Number(originalPrice) : numPrice,
    description: description ? description.trim() : '',
    isVeg: Boolean(isVeg),
    isBestseller: Boolean(isBestseller),
    isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
    isCatalogueVerified: true,
    image: image || '/images/dishes/hot_garlic_chicken.jpg',
    createdAt: new Date().toISOString()
  };

  items.unshift(newItem);
  writeJson(MENU_FILE, items);

  return res.status(201).json(newItem);
});

// Admin: Update food item
app.put('/api/menu/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const items = readJson(MENU_FILE, []);
  const index = items.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Food item not found' });
  }

  const current = items[index];
  const { name, category, categoryLabel, price, originalPrice, description, isVeg, isBestseller, isAvailable, image } = req.body;

  const updatedItem = {
    ...current,
    name: name !== undefined ? name.trim() : current.name,
    category: category !== undefined ? category : current.category,
    categoryLabel: categoryLabel !== undefined ? categoryLabel : current.categoryLabel,
    price: price !== undefined ? Number(price) : current.price,
    originalPrice: originalPrice !== undefined ? Number(originalPrice) : current.originalPrice,
    description: description !== undefined ? description.trim() : current.description,
    isVeg: isVeg !== undefined ? Boolean(isVeg) : current.isVeg,
    isBestseller: isBestseller !== undefined ? Boolean(isBestseller) : current.isBestseller,
    isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : current.isAvailable,
    image: image !== undefined ? image : current.image,
    updatedAt: new Date().toISOString()
  };

  items[index] = updatedItem;
  writeJson(MENU_FILE, items);

  return res.json(updatedItem);
});

// Admin: Delete food item
app.delete('/api/menu/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  let items = readJson(MENU_FILE, []);
  const exists = items.some(i => i.id === id);

  if (!exists) {
    return res.status(404).json({ error: 'Food item not found' });
  }

  items = items.filter(i => i.id !== id);
  writeJson(MENU_FILE, items);

  return res.json({ success: true, id });
});

// ==================== CATEGORIES ROUTES ====================

// Public: Get categories
app.get('/api/categories', (req, res) => {
  const categories = readJson(CATEGORIES_FILE, []);
  return res.json(categories);
});

// Admin: Create category
app.post('/api/categories', requireAdmin, (req, res) => {
  const { label } = req.body;
  if (!label || !label.trim()) {
    return res.status(400).json({ error: 'Category label is required' });
  }

  const categories = readJson(CATEGORIES_FILE, []);
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  if (categories.some(c => c.id === id)) {
    return res.status(400).json({ error: 'A category with this name already exists' });
  }

  const newCat = {
    id,
    label: label.trim(),
    order: categories.length
  };

  categories.push(newCat);
  writeJson(CATEGORIES_FILE, categories);

  return res.status(201).json(newCat);
});

// Admin: Update category
app.put('/api/categories/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { label, order } = req.body;

  const categories = readJson(CATEGORIES_FILE, []);
  const index = categories.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }

  if (label) categories[index].label = label.trim();
  if (order !== undefined) categories[index].order = Number(order);

  writeJson(CATEGORIES_FILE, categories);
  return res.json(categories[index]);
});

// Admin: Delete category with safety check
app.delete('/api/categories/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  if (id === 'all') {
    return res.status(400).json({ error: 'Cannot delete default "All Items" category' });
  }

  // Safety check: ensure no menu items are assigned to this category
  const items = readJson(MENU_FILE, []);
  const itemsInCat = items.filter(i => i.category === id);

  if (itemsInCat.length > 0) {
    return res.status(400).json({
      error: `Cannot delete category: ${itemsInCat.length} dish(es) are currently assigned to it. Please reassign or delete these items first.`
    });
  }

  let categories = readJson(CATEGORIES_FILE, []);
  categories = categories.filter(c => c.id !== id);
  writeJson(CATEGORIES_FILE, categories);

  return res.json({ success: true, id });
});

// ==================== IMAGE UPLOAD ROUTE ====================

app.post('/api/upload', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const publicUrl = `/uploads/${req.file.filename}`;
  return res.json({
    success: true,
    url: publicUrl,
    filename: req.file.filename,
    size: req.file.size
  });
});

// ==================== COD ORDERS API ROUTES ====================

// Public/Checkout: Place a verified Cash on Delivery (COD) order
app.post('/api/orders', (req, res) => {
  const {
    customerName,
    phone,
    fulfillmentType = 'delivery',
    address,
    locality,
    landmark,
    deliveryInstructions,
    items
  } = req.body;

  // 1. Validate customer details
  if (!customerName || !customerName.trim() || customerName.trim().length < 2) {
    return res.status(400).json({ error: 'Please provide a valid full name' });
  }

  const cleanPhone = phone ? phone.toString().replace(/[^\d]/g, '').slice(-10) : '';
  if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
    return res.status(400).json({
      error: 'Please provide a valid 10-digit Indian mobile number (e.g., 9876543210)'
    });
  }

  const isDelivery = fulfillmentType === 'delivery';
  if (isDelivery && (!address || !address.trim() || address.trim().length < 5)) {
    return res.status(400).json({
      error: 'Please provide your complete delivery street address in Nagercoil'
    });
  }

  // 2. Validate items array
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Your cart is empty' });
  }

  // 3. Authoritative product validation against database (data/menu.json)
  const menu = readJson(MENU_FILE, []);
  const menuMap = new Map(menu.map(m => [m.id, m]));

  const validatedItems = [];
  let calculatedSubtotal = 0;

  for (const item of items) {
    const dbItem = menuMap.get(item.id);
    if (!dbItem) {
      return res.status(400).json({
        error: `Dish "${item.name || item.id}" is no longer on our menu. Please refresh your cart.`
      });
    }

    if (dbItem.isAvailable === false) {
      return res.status(400).json({
        error: `Sorry, "${dbItem.name}" is currently out of stock. Please remove it from your cart to proceed.`
      });
    }

    const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
    const itemPrice = Number(dbItem.price);
    const itemSubtotal = itemPrice * qty;

    calculatedSubtotal += itemSubtotal;

    // Snapshot item details at time of order
    validatedItems.push({
      id: dbItem.id,
      name: dbItem.name,
      price: itemPrice,
      quantity: qty,
      subtotal: itemSubtotal,
      image: dbItem.image || '',
      category: dbItem.category || ''
    });
  }

  // 4. Calculate delivery fee securely (Free for Pickup, Flat Rs 30 for Nagercoil Delivery)
  const deliveryFee = isDelivery ? 30 : 0;
  const calculatedTotal = calculatedSubtotal + deliveryFee;

  // 5. Generate unique Order ID
  const now = new Date();
  const timestampSuffix = now.getTime().toString().slice(-6);
  const randSuffix = Math.floor(100 + Math.random() * 900);
  const orderId = `COD-${timestampSuffix}-${randSuffix}`;

  // 6. Build persistent order object
  const newOrder = {
    id: orderId,
    orderNumber: orderId,
    customerName: customerName.trim(),
    phone: cleanPhone,
    fulfillmentType: isDelivery ? 'delivery' : 'pickup',
    address: isDelivery ? address.trim() : 'Store Pickup / Takeaway',
    locality: locality ? locality.trim() : (isDelivery ? 'Nagercoil' : 'A-One Shawarma Spot'),
    landmark: landmark ? landmark.trim() : '',
    deliveryInstructions: deliveryInstructions ? deliveryInstructions.trim() : '',
    items: validatedItems,
    subtotal: calculatedSubtotal,
    deliveryFee,
    total: calculatedTotal,
    paymentMethod: 'COD',
    paymentStatus: 'Unpaid',
    orderStatus: 'Pending',
    statusHistory: [
      {
        status: 'Pending',
        timestamp: now.toISOString(),
        note: 'Order placed by customer via Cash on Delivery'
      }
    ],
    paymentHistory: [
      {
        status: 'Unpaid',
        timestamp: now.toISOString(),
        note: 'Initial payment status upon order creation'
      }
    ],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };

  // 7. Save to persistent storage
  const orders = readJson(ORDERS_FILE, []);
  orders.unshift(newOrder);

  // Keep up to 250 orders
  if (orders.length > 250) orders.length = 250;
  
  const saved = writeJson(ORDERS_FILE, orders);
  if (!saved) {
    return res.status(500).json({
      error: 'Failed to record your order due to a storage issue. Please try again.'
    });
  }

  return res.status(201).json({
    success: true,
    order: newOrder
  });
});

// Public: Get single order for customer confirmation/tracking
app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const orders = readJson(ORDERS_FILE, []);
  const order = orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  return res.json(order);
});

// Admin: Get all orders with search, status, and payment filters
app.get('/api/orders', requireAdmin, (req, res) => {
  const { status, paymentStatus, q } = req.query;
  let orders = readJson(ORDERS_FILE, []);

  if (status && status !== 'all') {
    orders = orders.filter(o => o.orderStatus === status);
  }

  if (paymentStatus && paymentStatus !== 'all') {
    orders = orders.filter(o => o.paymentStatus === paymentStatus);
  }

  if (q && q.trim()) {
    const query = q.trim().toLowerCase();
    orders = orders.filter(o =>
      o.id.toLowerCase().includes(query) ||
      o.customerName.toLowerCase().includes(query) ||
      o.phone.includes(query)
    );
  }

  return res.json(orders);
});

// Admin: Update order status with audit log
app.patch('/api/orders/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  const validStatuses = [
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready for delivery',
    'Out for delivery',
    'Delivered',
    'Cancelled'
  ];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Allowed values: ${validStatuses.join(', ')}`
    });
  }

  const orders = readJson(ORDERS_FILE, []);
  const orderIndex = orders.findIndex(o => o.id === id);

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = orders[orderIndex];
  const previousStatus = order.orderStatus;
  const now = new Date().toISOString();

  order.orderStatus = status;
  order.updatedAt = now;

  if (!order.statusHistory) order.statusHistory = [];
  order.statusHistory.push({
    from: previousStatus,
    status,
    timestamp: now,
    note: note ? note.trim() : `Status updated to ${status} by admin`,
    updatedBy: req.user?.username || 'admin'
  });

  writeJson(ORDERS_FILE, orders);
  return res.json(order);
});

// Admin: Update COD payment status independently from delivery status
app.patch('/api/orders/:id/payment', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { paymentStatus, note } = req.body;

  const validPaymentStatuses = ['Unpaid', 'Paid'];
  if (!paymentStatus || !validPaymentStatuses.includes(paymentStatus)) {
    return res.status(400).json({
      error: `Invalid payment status. Allowed values: ${validPaymentStatuses.join(', ')}`
    });
  }

  const orders = readJson(ORDERS_FILE, []);
  const orderIndex = orders.findIndex(o => o.id === id);

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = orders[orderIndex];
  const now = new Date().toISOString();

  order.paymentStatus = paymentStatus;
  order.updatedAt = now;
  if (paymentStatus === 'Paid') {
    order.paidAt = now;
  } else {
    delete order.paidAt;
  }

  if (!order.paymentHistory) order.paymentHistory = [];
  order.paymentHistory.push({
    paymentStatus,
    timestamp: now,
    note: note ? note.trim() : `Payment marked as ${paymentStatus} by admin`,
    updatedBy: req.user?.username || 'admin'
  });

  writeJson(ORDERS_FILE, orders);
  return res.json(order);
});

// Export app for Vite middleware or standalone listen
export default app;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FLOZ Tech Backend API running on http://0.0.0.0:${PORT}`);
  });
}
