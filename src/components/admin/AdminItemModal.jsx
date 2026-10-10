import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, AlertCircle, CheckCircle2, Utensils } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const AdminItemModal = ({ isOpen, onClose, editingItem }) => {
  const { categories, addMenuItem, updateMenuItem, uploadDishImage } = useCart();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('starters-chicken');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isVeg, setIsVeg] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  
  // Image handling
  const [imageTab, setImageTab] = useState('upload'); // 'upload' | 'url'
  const [imagePreview, setImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Populate data when editing
  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || '');
      setCategory(editingItem.category || 'starters-chicken');
      setPrice(editingItem.price || '');
      setOriginalPrice(editingItem.originalPrice || '');
      setDescription(editingItem.description || '');
      setIsVeg(Boolean(editingItem.isVeg));
      setIsAvailable(editingItem.isAvailable !== undefined ? editingItem.isAvailable : true);
      setIsBestseller(Boolean(editingItem.isBestseller));
      setImageUrl(editingItem.image || '');
      setImagePreview(editingItem.image || '');
      setImageTab('url');
    } else {
      setName('');
      setCategory(categories.find(c => c.id !== 'all')?.id || 'starters-chicken');
      setPrice('');
      setOriginalPrice('');
      setDescription('');
      setIsVeg(false);
      setIsAvailable(true);
      setIsBestseller(false);
      setImageUrl('/images/dishes/hot_garlic_chicken.jpg');
      setImagePreview('/images/dishes/hot_garlic_chicken.jpg');
      setSelectedFile(null);
      setImageTab('upload');
    }
    setErrorMessage('');
  }, [editingItem, categories, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size exceeds 5MB limit.');
        return;
      }
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please provide a dish name.');
      return;
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setErrorMessage('Please enter a valid price in INR.');
      return;
    }

    setIsSubmitting(true);
    let finalImageUrl = imagePreview;

    // If a new local file was selected, upload it first
    if (selectedFile) {
      const uploadRes = await uploadDishImage(selectedFile);
      if (!uploadRes.success) {
        setIsSubmitting(false);
        setErrorMessage(`Image upload failed: ${uploadRes.error}`);
        return;
      }
      finalImageUrl = uploadRes.url;
    } else if (imageTab === 'url' && imageUrl.trim()) {
      finalImageUrl = imageUrl.trim();
    }

    const categoryObj = categories.find(c => c.id === category);
    const categoryLabel = categoryObj ? categoryObj.label : 'Specialties';

    const itemPayload = {
      name: name.trim(),
      category,
      categoryLabel,
      price: numPrice,
      originalPrice: originalPrice ? Number(originalPrice) : numPrice,
      description: description.trim(),
      isVeg,
      isAvailable,
      isBestseller,
      image: finalImageUrl
    };

    let result;
    if (editingItem) {
      result = await updateMenuItem(editingItem.id, itemPayload);
    } else {
      result = await addMenuItem(itemPayload);
    }

    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.error || 'Failed to save food item.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4 text-center">
        <div className="w-full max-w-xl bg-cream-50 rounded-lg shadow-2xl border border-cream-200 overflow-hidden text-left my-8 transform transition-all">
          
          {/* Header */}
          <div className="px-6 py-4 bg-cream-100 border-b border-cream-200 flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-forest-950">
              {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-charcoal-500 hover:text-charcoal-900 rounded-md focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-300 rounded text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                Dish Name <span className="text-terracotta-600">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Special Pepper Chicken Shawarma"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-cream-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-700"
                required
              />
            </div>

            {/* Category & Dietary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Category <span className="text-terracotta-600">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-cream-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-700"
                >
                  {categories.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Dietary Classification
                </label>
                <div className="flex items-center gap-4 pt-1.5">
                  <label className="inline-flex items-center gap-1.5 text-xs text-charcoal-700 cursor-pointer">
                    <input
                      type="radio"
                      name="dietary"
                      checked={!isVeg}
                      onChange={() => setIsVeg(false)}
                      className="text-forest-900 focus:ring-forest-700"
                    />
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 border border-red-700 flex items-center justify-center">
                        <span className="w-1 h-1 rounded-full bg-red-700" />
                      </span>
                      <span>Non-Veg</span>
                    </span>
                  </label>

                  <label className="inline-flex items-center gap-1.5 text-xs text-charcoal-700 cursor-pointer">
                    <input
                      type="radio"
                      name="dietary"
                      checked={isVeg}
                      onChange={() => setIsVeg(true)}
                      className="text-forest-900 focus:ring-forest-700"
                    />
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 border border-green-600 flex items-center justify-center">
                        <span className="w-1 h-1 rounded-full bg-green-600" />
                      </span>
                      <span>Veg</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Price & Original Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Selling Price (₹) <span className="text-terracotta-600">*</span>
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="160"
                  min="1"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-cream-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-700 tabular-nums"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Original MRP (₹) <span className="text-charcoal-400 font-normal">(Optional for discount tag)</span>
                </label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="180"
                  min="1"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-cream-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-700 tabular-nums"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief, mouth-watering description of ingredients and preparation"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-cream-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-700"
              />
            </div>

            {/* Image Upload / URL Selector */}
            <div className="space-y-2 border border-cream-200 p-3.5 rounded-md bg-cream-100/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-charcoal-800">
                  Dish Photograph
                </label>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setImageTab('upload')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      imageTab === 'upload' ? 'bg-forest-900 text-white font-semibold' : 'text-charcoal-600 hover:text-black'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab('url')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      imageTab === 'url' ? 'bg-forest-900 text-white font-semibold' : 'text-charcoal-600 hover:text-black'
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {imageTab === 'upload' ? (
                <div>
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-cream-300 rounded-md cursor-pointer hover:bg-cream-100 transition-colors">
                    <Upload className="w-6 h-6 text-forest-700 mb-1" />
                    <span className="text-xs font-medium text-charcoal-800">
                      Click to choose an image from device
                    </span>
                    <span className="text-[10px] text-charcoal-500 mt-0.5">
                      JPEG, PNG, WEBP up to 5MB
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="e.g. /images/dishes/shawarma_roll.jpg"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-cream-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-700 font-mono"
                  />
                </div>
              )}

              {/* Image Preview Box */}
              {imagePreview && (
                <div className="mt-2 flex items-center gap-3 p-2 bg-white rounded border border-cream-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-12 object-cover rounded bg-cream-200"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="text-[11px] text-charcoal-600 truncate">
                    <span>Active Preview</span>
                    <div className="text-charcoal-400 font-mono text-[10px] truncate">{imagePreview}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Availability & Bestseller Toggles */}
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="rounded text-forest-900 focus:ring-forest-700"
                />
                <span>Currently Available to Order</span>
              </label>

              <label className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="rounded text-forest-900 focus:ring-forest-700"
                />
                <span>Highlight as Popular</span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-cream-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-charcoal-700 hover:text-charcoal-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-forest-900 hover:bg-forest-800 text-cream-50 font-semibold text-xs sm:text-sm rounded-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : editingItem ? 'Update Dish' : 'Add to Menu'}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};
