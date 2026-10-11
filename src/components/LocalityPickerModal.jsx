import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const NAGERCOIL_LOCALITIES = [
  'Vadasery',
  'Kottar',
  'Asambu Road',
  'Chettikulam',
  'Meenakshipuram',
  'Ramavarmapuram',
  'Tower Junction',
  'Ozhuginasery',
  'Veerapathiran Street',
  'Derrick Junction',
  'Kollancode Road',
  'Nagercoil Central',
  'Other Area in Nagercoil'
];

export const LocalityPickerModal = () => {
  const { isLocalityPickerOpen, setIsLocalityPickerOpen, selectedLocality, updateLocality } = useCart();

  if (!isLocalityPickerOpen) return null;

  const handleSelect = (loc) => {
    updateLocality(loc);
    setIsLocalityPickerOpen(false);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Select Delivery Locality"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-xs"
          onClick={() => setIsLocalityPickerOpen(false)}
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[85vh] flex flex-col border border-cream-200"
        >
          <div className="px-5 py-4 bg-cream-100 border-b border-cream-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-terracotta-500" />
              <div className="text-left">
                <h3 className="font-heading text-base font-bold text-forest-950">
                  Select Delivery Locality
                </h3>
                <span className="text-[11px] text-charcoal-500">Nagercoil, Kanyakumari District</span>
              </div>
            </div>
            <button
              onClick={() => setIsLocalityPickerOpen(false)}
              className="p-1.5 text-charcoal-500 hover:text-charcoal-900 rounded-md"
              aria-label="Close locality picker"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-1.5 text-left">
            {NAGERCOIL_LOCALITIES.map((loc) => {
              const isSelected = selectedLocality === loc;
              return (
                <button
                  key={loc}
                  onClick={() => handleSelect(loc)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-forest-900 text-cream-50 font-bold shadow-xs'
                      : 'hover:bg-cream-100 text-charcoal-800'
                  }`}
                >
                  <span>{loc}</span>
                  {isSelected && <Check className="w-4 h-4 text-cream-100" />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
