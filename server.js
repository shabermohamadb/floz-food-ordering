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

// ==================== ORDERS LOG ROUTES ====================

// Public/Checkout: Log an order when WhatsApp is initiated
app.post('/api/orders', (req, res) => {
  const { customerName, phone, fulfillmentType, address, notes, items, total } = req.body;

  const orders = readJson(ORDERS_FILE, []);
  const orderId = `ORD-${Date.now().toString().slice(-6)}`;

  const newOrder = {
    id: orderId,
    customerName: customerName || 'Valued Customer',
    phone: phone || '',
    fulfillmentType: fulfillmentType || 'pickup',
    address: address || '',
    notes: notes || '',
    items: items || [],
    total: total || 0,
    timestamp: new Date().toISOString()
  };

  orders.unshift(newOrder);
  // Keep last 100 orders
  if (orders.length > 100) orders.length = 100;
  writeJson(ORDERS_FILE, orders);

  return res.status(201).json({ success: true, orderId });
});

// Admin: Get recent orders
app.get('/api/orders', requireAdmin, (req, res) => {
  const orders = readJson(ORDERS_FILE, []);
  return res.json(orders);
});

// Export app for Vite middleware or standalone listen
export default app;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FLOZ Tech Backend API running on http://0.0.0.0:${PORT}`);
  });
}
