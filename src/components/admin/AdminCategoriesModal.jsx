import React, { useState } from 'react';
import { X, FolderPlus, Trash2, Layers, AlertCircle, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const AdminCategoriesModal = ({ isOpen, onClose }) => {
  const { categories, menuItems, addCategory, deleteCategory } = useCart();
  const [newLabel, setNewLabel] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newLabel.trim()) {
      setError('Please provide a category label');
      return;
    }

    setIsSubmitting(true);
    const res = await addCategory(newLabel.trim());
    setIsSubmitting(false);

    if (res.success) {
      setNewLabel('');
      setSuccess('Category created successfully');
      setTimeout(() => setSuccess(''), 2000);
    } else {
      setError(res.error || 'Failed to create category');
    }
  };

  const handleDelete = async (id, label) => {
    setError('');
    setSuccess('');

    // Pre-check if items exist in category
    const itemsInCat = menuItems.filter(i => i.category === id);
    if (itemsInCat.length > 0) {
      setError(`Cannot delete "${label}": It currently has ${itemsInCat.length} dish(es) assigned. Please reassign or delete those dishes first.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the category "${label}"?`)) {
      return;
    }

    const res = await deleteCategory(id);
    if (res.success) {
      setSuccess(`Category "${label}" removed.`);
      setTimeout(() => setSuccess(''), 2000);
    } else {
      setError(res.error || 'Failed to delete category');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4 text-center">
        <div className="w-full max-w-lg bg-cream-50 rounded-lg shadow-2xl border border-cream-200 overflow-hidden text-left my-8 transform transition-all">
          
          {/* Header */}
          <div className="px-6 py-4 bg-cream-100 border-b border-cream-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-forest-900" />
              <h3 className="font-heading text-lg font-bold text-forest-950">
                Manage Menu Categories
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-charcoal-500 hover:text-charcoal-900 rounded-md focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-300 rounded text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-forest-50 border border-forest-600 rounded text-xs text-forest-950 flex items-center gap-2">
                <Check className="w-4 h-4 text-forest-700" />
                <span>{success}</span>
              </div>
            )}

            {/* Add Category Form */}
            <form onSubmit={handleAdd} className="flex gap-2">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Seafood & Fish Specials"
                className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white border border-cream-300 rounded-md focus:outline-none focus:ring-1 focus:ring-forest-700"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-forest-900 hover:bg-forest-800 text-cream-50 font-semibold text-xs rounded-md transition-all shrink-0"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </form>

            {/* Existing Categories List */}
            <div className="border border-cream-200 rounded-md overflow-hidden bg-white">
              <div className="px-4 py-2.5 bg-cream-100 text-xs font-semibold text-charcoal-700 border-b border-cream-200 flex justify-between">
                <span>Category Name</span>
                <span>Assigned Dishes</span>
              </div>
              <ul className="divide-y divide-cream-200">
                {categories.map((cat) => {
                  const count = cat.id === 'all'
                    ? menuItems.length
                    : menuItems.filter(i => i.category === cat.id).length;

                  return (
                    <li key={cat.id} className="px-4 py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-forest-950">{cat.label}</span>
                        <span className="text-[10px] text-charcoal-400 font-mono ml-2">id: {cat.id}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-cream-100 rounded text-charcoal-700 font-medium tabular-nums">
                          {count} {count === 1 ? 'dish' : 'dishes'}
                        </span>

                        {cat.id !== 'all' && (
                          <button
                            type="button"
                            onClick={() => handleDelete(cat.id, cat.label)}
                            className="p-1 text-charcoal-400 hover:text-red-700 transition-colors"
                            title={`Delete category ${cat.label}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

          </div>

          <div className="px-6 py-3 bg-cream-100 border-t border-cream-200 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold bg-forest-900 text-cream-50 rounded-md hover:bg-forest-800"
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
