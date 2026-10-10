import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_BUSINESS_CONFIG } from '../config/businessConfig';
import { INITIAL_MENU_ITEMS, MENU_CATEGORIES } from '../data/menuData';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Business Config state
  const [businessConfig, setBusinessConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('floz_demo_business_config');
      return saved ? JSON.parse(saved) : INITIAL_BUSINESS_CONFIG;
    } catch {
      return INITIAL_BUSINESS_CONFIG;
    }
  });

  // Categories & Menu Items state from persistent backend
  const [categories, setCategories] = useState(MENU_CATEGORIES);
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  // Cart Items: array of { id, name, price, quantity, category, image }
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('floz_demo_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Navigation & View State ('customer' | 'admin')
  const [currentView, setCurrentView] = useState(() => {
    return window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')
      ? 'admin'
      : 'customer';
  });

  // Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Admin Authentication State
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('floz_admin_token') || null;
  });
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('floz_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Fulfillment preference ('delivery' | 'pickup')
  const [fulfillmentType, setFulfillmentType] = useState('delivery');

  // Customer checkout form
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
    locality: 'Nagercoil',
    landmark: '',
    notes: ''
  });

  // COD Order Placement State
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else if (window.location.hash === '' || window.location.hash === '#menu') {
        setCurrentView('customer');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view) => {
    setCurrentView(view);
    if (view === 'admin') {
      window.location.hash = 'admin';
    } else {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch Menu & Categories from Backend
  const fetchMenuData = useCallback(async () => {
    try {
      setIsLoadingMenu(true);
      const [menuRes, catRes] = await Promise.all([
        fetch('/api/menu').then(r => r.ok ? r.json() : null),
        fetch('/api/categories').then(r => r.ok ? r.json() : null)
      ]);

      if (menuRes && Array.isArray(menuRes) && menuRes.length > 0) {
        setMenuItems(menuRes);
      }
      if (catRes && Array.isArray(catRes) && catRes.length > 0) {
        setCategories(catRes);
      }
    } catch (err) {
      console.warn('Backend API fetch error, using local data:', err);
    } finally {
      setIsLoadingMenu(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('floz_demo_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [cartItems]);

  // Cart operations
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemQuantity = (productId) => {
    const item = cartItems.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  // Calculations
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = fulfillmentType === 'delivery' ? 30 : 0;
  const total = subtotal + deliveryFee;

  // Cash on Delivery (COD) Order Placement Action
  const placeCODOrder = async (overrideDetails = {}) => {
    try {
      setIsPlacingOrder(true);
      setOrderError(null);

      const details = { ...customerDetails, ...overrideDetails };

      const payload = {
        customerName: details.name,
        phone: details.phone,
        fulfillmentType,
        address: details.address,
        locality: details.locality,
        landmark: details.landmark,
        deliveryInstructions: details.notes,
        items: cartItems.map(i => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order. Please try again.');
      }

      setPlacedOrder(data.order);
      // Important: clear cart ONLY upon verified database save!
      clearCart();
      return { success: true, order: data.order };
    } catch (err) {
      setOrderError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const resetCheckout = () => {
    setIsCheckoutOpen(false);
    setPlacedOrder(null);
    setOrderError(null);
  };

  // Admin Authentication Actions
  const loginAdmin = async (username, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setAdminToken(data.token);
      setAdminUser(data.user);
      localStorage.setItem('floz_admin_token', data.token);
      localStorage.setItem('floz_admin_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('floz_admin_token');
    localStorage.removeItem('floz_admin_user');
  };

  // Admin Menu CRUD Actions (Connecting to persistent backend)
  const addMenuItem = async (itemData) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(itemData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add item');
      
      setMenuItems(prev => [data, ...prev]);
      return { success: true, item: data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateMenuItem = async (id, updates) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update item');

      setMenuItems(prev => prev.map(item => (item.id === id ? data : item)));
      // Also update cart if this item was in cart and its price or name changed
      setCartItems(prev =>
        prev.map(item => (item.id === id ? { ...item, name: data.name, price: data.price, image: data.image } : item))
      );
      return { success: true, item: data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteMenuItem = async (id) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete item');

      setMenuItems(prev => prev.filter(item => item.id !== id));
      removeFromCart(id);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const toggleItemAvailability = async (id) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    return updateMenuItem(id, { isAvailable: !item.isAvailable });
  };

  // Image Upload Action
  const uploadDishImage = async (file) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload image');
      return { success: true, url: data.url };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Category Actions
  const addCategory = async (label) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ label })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add category');
      setCategories(prev => [...prev, data]);
      return { success: true, category: data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteCategory = async (id) => {
    if (!adminToken) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete category');
      setCategories(prev => prev.filter(c => c.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Order Logger (Records WhatsApp order dispatches to backend)
  const logWhatsAppOrder = async (orderPayload) => {
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
    } catch (e) {
      console.warn('Failed to log order to backend:', e);
    }
  };

  // Config Updater
  const updateBusinessConfig = (newValues) => {
    setBusinessConfig(prev => {
      const updated = { ...prev, ...newValues };
      try {
        localStorage.setItem('floz_demo_business_config', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetBusinessConfig = () => {
    setBusinessConfig(INITIAL_BUSINESS_CONFIG);
    try {
      localStorage.removeItem('floz_demo_business_config');
    } catch {}
  };

  return (
    <CartContext.Provider
      value={{
        businessConfig,
        updateBusinessConfig,
        resetBusinessConfig,
        categories,
        menuItems,
        isLoadingMenu,
        fetchMenuData,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        itemCount,
        subtotal,
        deliveryFee,
        total,
        fulfillmentType,
        setFulfillmentType,
        customerDetails,
        setCustomerDetails,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        currentView,
        navigateTo,
        adminToken,
        adminUser,
        loginAdmin,
        logoutAdmin,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        uploadDishImage,
        addCategory,
        deleteCategory,
        logWhatsAppOrder,
        placedOrder,
        setPlacedOrder,
        isPlacingOrder,
        orderError,
        setOrderError,
        placeCODOrder,
        resetCheckout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
