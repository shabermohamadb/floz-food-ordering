import React, { useState, useMemo } from 'react';
import {
  Utensils,
  Plus,
  Layers,
  ShoppingBag,
  Settings,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  ArrowLeft,
  LogOut,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { AdminItemModal } from './AdminItemModal';
import { AdminCategoriesModal } from './AdminCategoriesModal';
import { AdminOrdersView } from './AdminOrdersView';

export const AdminDashboard = () => {
  const {
    adminUser,
    logoutAdmin,
    navigateTo,
    businessConfig,
    updateBusinessConfig,
    categories,
    menuItems,
    deleteMenuItem,
    toggleItemAvailability
  } = useCart();

  // Active view tab in dashboard: 'menu' | 'orders' | 'categories' | 'settings'
  const [activeTab, setActiveTab] = useState('menu');
  
  // Menu table filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all' | 'available' | 'unavailable'

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Shop settings form state
  const [settingsShopName, setSettingsShopName] = useState(businessConfig.shopName);
  const [settingsPhone, setSettingsPhone] = useState(businessConfig.whatsAppOrderingNumber);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchAvail =
        availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && item.isAvailable) ||
        (availabilityFilter === 'unavailable' && !item.isAvailable);
      const matchSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchCat && matchAvail && matchSearch;
    });
  }, [menuItems, selectedCategory, availabilityFilter, searchQuery]);

  // Metrics
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter(i => i.isAvailable).length;
  const unavailableItems = totalItems - availableItems;
  const totalCategories = categories.filter(c => c.id !== 'all').length;

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      await deleteMenuItem(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateBusinessConfig({
      shopName: settingsShopName.trim(),
      whatsAppOrderingNumber: settingsPhone.trim()
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col text-charcoal-900">
      
      {/* Admin Top Navigation Bar */}
      <header className="bg-forest-950 text-cream-100 border-b border-forest-900 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Title & Brand */}
            <div className="flex items-center gap-3">
              <span className="font-heading text-lg sm:text-xl font-extrabold tracking-tight text-white">
                {businessConfig.shopName}
              </span>
              <span className="text-[11px] font-semibold bg-forest-800 text-cream-200 px-2 py-0.5 rounded tracking-wide uppercase">
                Admin Panel
              </span>
            </div>

            {/* User & Navigation Actions */}
            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={() => navigateTo('customer')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest-900 hover:bg-forest-800 text-cream-100 rounded transition-colors"
                title="View customer site"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Website</span>
              </button>

              <button
                onClick={logoutAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-cream-300 hover:text-white transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* Metrics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-white border border-cream-200 rounded-lg shadow-xs text-left">
            <div className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">
              Total Menu Items
            </div>
            <div className="mt-1 text-2xl font-extrabold font-heading text-forest-950 tabular-nums">
              {totalItems}
            </div>
          </div>

          <div className="p-4 bg-white border border-cream-200 rounded-lg shadow-xs text-left">
            <div className="text-[11px] font-semibold text-green-700 uppercase tracking-wider">
              Active & Available
            </div>
            <div className="mt-1 text-2xl font-extrabold font-heading text-green-800 tabular-nums">
              {availableItems}
            </div>
          </div>

          <div className="p-4 bg-white border border-cream-200 rounded-lg shadow-xs text-left">
            <div className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">
              Out of Stock
            </div>
            <div className="mt-1 text-2xl font-extrabold font-heading text-charcoal-700 tabular-nums">
              {unavailableItems}
            </div>
          </div>

          <div className="p-4 bg-white border border-cream-200 rounded-lg shadow-xs text-left">
            <div className="text-[11px] font-semibold text-terracotta-600 uppercase tracking-wider">
              Categories
            </div>
            <div className="mt-1 text-2xl font-extrabold font-heading text-terracotta-700 tabular-nums">
              {totalCategories}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-cream-300 pb-2 overflow-x-auto gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'menu'
                  ? 'bg-forest-900 text-cream-50'
                  : 'text-charcoal-700 hover:bg-cream-200'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Menu Items</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-forest-900 text-cream-50'
                  : 'text-charcoal-700 hover:bg-cream-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>WhatsApp Orders</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-forest-900 text-cream-50'
                  : 'text-charcoal-700 hover:bg-cream-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Shop Setup</span>
            </button>
          </div>

          {activeTab === 'menu' && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsCategoriesModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-cream-50 hover:bg-white text-forest-900 border border-forest-900/30 text-xs font-semibold rounded-md shadow-xs transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Manage</span> Categories
              </button>

              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-forest-900 hover:bg-forest-800 text-cream-50 text-xs font-semibold rounded-md shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Food Item</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: Menu Items Table */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            
            {/* Filter Toolbar */}
            <div className="p-4 bg-white border border-cream-200 rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dish by name..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-cream-50 border border-cream-300 rounded focus:outline-none focus:ring-1 focus:ring-forest-700"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto text-xs">
                {/* Category selector */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-2.5 py-1.5 bg-cream-50 border border-cream-300 rounded text-xs text-charcoal-800 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>

                {/* Availability selector */}
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-cream-50 border border-cream-300 rounded text-xs text-charcoal-800 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available Only</option>
                  <option value="unavailable">Out of Stock Only</option>
                </select>
              </div>
            </div>

            {/* Menu Items Table */}
            <div className="bg-white border border-cream-200 rounded-lg overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-cream-200 text-left text-xs">
                  <thead className="bg-cream-100/70 text-charcoal-700 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th scope="col" className="px-4 py-3">Photo & Dish Name</th>
                      <th scope="col" className="px-4 py-3">Category</th>
                      <th scope="col" className="px-4 py-3">Selling Price</th>
                      <th scope="col" className="px-4 py-3">Status</th>
                      <th scope="col" className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-cream-50/50 transition-colors">
                        
                        {/* Name & Photo */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt=""
                              className="w-12 h-10 object-cover rounded bg-cream-200 shrink-0"
                              onError={(e) => { e.target.src = '/images/dishes/hot_garlic_chicken.jpg'; }}
                            />
                            <div>
                              <div className="font-semibold text-forest-950 flex items-center gap-1.5">
                                <span>{item.name}</span>
                                {item.isVeg ? (
                                  <span className="w-2 h-2 rounded-full bg-green-600 inline-block" title="Vegetarian" />
                                ) : (
                                  <span className="w-2 h-2 rounded-full bg-red-700 inline-block" title="Non-Vegetarian" />
                                )}
                              </div>
                              <div className="text-[11px] text-charcoal-500 line-clamp-1 max-w-xs">
                                {item.description}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3 text-charcoal-600 font-medium">
                          {item.categoryLabel}
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3 font-semibold text-forest-950 tabular-nums">
                          ₹{item.price}
                          {item.originalPrice > item.price && (
                            <span className="ml-1 text-[10px] text-charcoal-400 line-through">
                              ₹{item.originalPrice}
                            </span>
                          )}
                        </td>

                        {/* Availability Toggle */}
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => toggleItemAvailability(item.id)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                              item.isAvailable
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'
                            }`}
                          >
                            {item.isAvailable ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-green-700" />
                                <span>Available</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-charcoal-500" />
                                <span>Out of Stock</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="p-1.5 text-charcoal-600 hover:text-forest-900 hover:bg-cream-100 rounded"
                              title="Edit item"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setItemToDelete(item)}
                              className="p-1.5 text-charcoal-400 hover:text-red-700 hover:bg-cream-100 rounded"
                              title="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredItems.length === 0 && (
                <div className="p-8 text-center text-xs text-charcoal-500">
                  No food items match the current filters.
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Orders Log */}
        {activeTab === 'orders' && (
          <AdminOrdersView />
        )}

        {/* Tab 3: Shop Setup */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto bg-white border border-cream-200 rounded-lg p-6 text-left space-y-5">
            <div>
              <h3 className="font-heading text-lg font-bold text-forest-950">
                Kitchen Information & WhatsApp Settings
              </h3>
              <p className="text-xs text-charcoal-500">
                Update business details displayed to customers across the site
              </p>
            </div>

            {settingsSaved && (
              <div className="p-3 bg-forest-50 border border-forest-600 rounded text-xs text-forest-950 font-medium">
                Shop settings updated successfully!
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Shop Name
                </label>
                <input
                  type="text"
                  value={settingsShopName}
                  onChange={(e) => setSettingsShopName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-cream-50 border border-cream-300 rounded focus:outline-none focus:ring-1 focus:ring-forest-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Kitchen WhatsApp Ordering Mobile Number
                </label>
                <input
                  type="text"
                  value={settingsPhone}
                  onChange={(e) => setSettingsPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-cream-50 border border-cream-300 rounded focus:outline-none focus:ring-1 focus:ring-forest-700 font-mono"
                  placeholder="+91 94420 12345"
                />
                <p className="mt-1 text-[11px] text-charcoal-500">
                  Customer WhatsApp orders will open a chat with this phone number.
                </p>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-forest-900 hover:bg-forest-800 text-cream-50 text-xs font-semibold rounded-md shadow-xs"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

      </main>

      {/* Item Modal (Add / Edit) */}
      <AdminItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        editingItem={editingItem}
      />

      {/* Categories Modal */}
      <AdminCategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-xs"
            onClick={() => setItemToDelete(null)}
          />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-lg shadow-xl border border-cream-200 p-6 text-left space-y-4">
              <h4 className="font-heading text-base font-bold text-forest-950">
                Confirm Dish Deletion
              </h4>
              <p className="text-xs text-charcoal-600">
                Are you sure you want to permanently delete <strong>{itemToDelete.name}</strong> from the kitchen menu?
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-charcoal-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded"
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
