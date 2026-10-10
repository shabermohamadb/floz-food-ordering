# FLOZ Tech — Food Ordering Website & Kitchen Admin Platform

A production-quality food ordering platform and administrative dashboard built by **FLOZ Tech** for **A-One Shawarma Spot (EASY BUY Groceries & Foods)** in **Nagercoil, Tamil Nadu**.

---

## 1. Verified Business & Catalogue Integration
- **Business Identity:** A-One Shawarma Spot (EASY BUY Groceries & Foods), Nagercoil
- **Official Catalogue Reference:** `https://wa.me/c/42473518850109`
- **Verified Dishes & Pricing:** 16 verified catalogue items with high-resolution food photography, discounted pricing, and crossed-out MRP matching the official WhatsApp Business catalogue.

---

## 2. Key Architecture & Features

### A. High-Resolution Exact-Match Food Photography
- Every dish card features an authentic, high-resolution (800×600+) culinary photograph that accurately depicts the specific food item.
- Support for real image file uploads directly via the Admin Dashboard.
- Uploaded files are validated (MIME type and 5MB limit), saved to `public/uploads/`, and linked persistently in the database.

### B. Upgraded Human-Designed Visual Experience
- **Palette:** Warm cream (`#FAF8F5`, `#F5F1EB`), deep forest green (`#142E22`), and warm terracotta (`#C35E2D`).
- **Typography:** Refined modern hierarchy (*Manrope* for bold, confident headings + *Inter* for body, buttons, and prices) with tabular figures for rupee amounts (`₹`).
- **Strictly Zero Emojis:** Standardized line icons (Lucide SVG) and authentic Indian dietary markers (green veg square / red non-veg square).
- **Interactive Menu:** Dynamic category filter tabs with dish counts, dietary filter (*All / Veg / Non-Veg*), price sorting (*Low to High / High to Low*), and live instant search.

### C. Persistent Backend & Database
- **API Server:** Integrated Express backend running seamlessly with Vite middleware or standalone (`server.js`).
- **Persistent Storage:** `data/menu.json`, `data/categories.json`, `data/users.json`, `data/orders.json`.
- **Changes Persist:** Adding dishes, editing prices, toggling availability, or uploading photos persists across browser refreshes and server restarts.

### D. Kitchen Admin Portal (`/admin` or top banner button)
- **Secure Authentication:** JWT token authentication with bcrypt password hashing.
- **Demo Admin Credentials:**
  - **Username:** `admin`
  - **Password:** `floz@nagercoil2026`
- **Dashboard Overview:** Live counts for total dishes, active items, out-of-stock items, categories, and incoming WhatsApp orders.
- **Menu Management (CRUD):** Add, edit, delete dishes, toggle availability (*Available / Out of Stock*), and upload photos.
- **Category Management:** Create, rename, and delete categories with safety checks preventing deletion of categories containing dishes.
- **Recent Orders Tracker:** Displays incoming WhatsApp order dispatches with customer name, phone, fulfillment type, delivery address, item list, and total amount.
- **Shop Settings:** Live configuration of shop name and WhatsApp ordering phone number.

### E. WhatsApp Ordering Workflow
- Customer reviews cart with Takeaway Pickup vs. Home Delivery in Nagercoil.
- Real-time WhatsApp order message generator and URI encoder.
- Order submission is automatically logged in the backend order history for kitchen tracking.

---

## 3. Quick Start & Development

```bash
# Navigate to the project directory
cd /home/shaber/.gemini/antigravity/scratch/floz-food-ordering

# Install dependencies (already installed)
npm install

# Start development server (serves frontend + backend on port 5173)
npm run dev

# Run automated verification suite
node verify.js

# Build production bundle
npm run build
```

---

## 4. Live Server Endpoints

- **Customer Website:** `http://localhost:5173/`
- **Admin Portal:** `http://localhost:5173/#admin` (or click "Admin Portal" in the top banner)
- **Local Network / Mobile Wi-Fi Preview:** `http://10.151.26.116:5173/`
