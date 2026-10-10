import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Flame,
  Sparkles,
  Store,
  Layers,
  Loader2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const AdminLogin = () => {
  const { loginAdmin, navigateTo, businessConfig } = useCart();

  // Local form state
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('floz_admin_remember_user') || 'admin';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('floz_admin_remember_pref') === 'true';
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Synchronize remember-me state to localStorage
  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem('floz_admin_remember_pref', 'true');
      localStorage.setItem('floz_admin_remember_user', username);
    } else {
      localStorage.removeItem('floz_admin_remember_pref');
      localStorage.removeItem('floz_admin_remember_user');
    }
  }, [rememberMe, username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please provide both username and password.');
      return;
    }

    setIsLoading(true);
    const result = await loginAdmin(username.trim(), password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Invalid credentials. Please verify your username and password.');
    } else {
      setLoginSuccess(true);
      if (rememberMe) {
        localStorage.setItem('floz_admin_remember_user', username.trim());
      }
    }
  };

  const handleFillDemoCredentials = () => {
    setUsername('admin');
    setPassword('floz@nagercoil2026');
    setError('');
  };

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 selection:bg-forest-100 selection:text-forest-900">
      
      {/* Outer Card Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-cream-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]"
      >
        
        {/* ========================================================= */}
        {/* LEFT PANEL: Culinary Brand Showcase & Context            */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 relative bg-forest-950 text-cream-50 p-8 sm:p-10 flex flex-col justify-between overflow-hidden">
          
          {/* Ambient Background Food Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 transform hover:scale-110 transition-transform duration-1000"
            style={{
              backgroundImage: `url('/images/dishes/shawarma_roll.jpg')`
            }}
            aria-hidden="true"
          />

          {/* Deep Forest Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-forest-950/95 via-forest-950/85 to-forest-900/95" />
          <div className="absolute inset-0 bg-radial-at-t from-forest-800/30 to-transparent" />

          {/* Top Section: Brand Emblem */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-forest-900/80 border border-forest-700/60 rounded-full text-[11px] font-semibold text-terracotta-300 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-terracotta-400" />
              <span>FLOZ Tech Client Portal</span>
            </div>

            <div>
              <div className="text-[11px] font-semibold tracking-wider uppercase text-cream-200/70">
                Official Business Console
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-cream-50 mt-1 leading-tight tracking-tight">
                {businessConfig.shopName}
              </h1>
              <p className="text-xs text-cream-200/80 font-medium mt-1">
                {businessConfig.registeredBusinessName}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs text-cream-200/90 bg-forest-900/60 px-2.5 py-1 rounded-md border border-forest-800">
              <MapPin className="w-3.5 h-3.5 text-terracotta-400 shrink-0" />
              <span>Nagercoil, Kanyakumari District, TN</span>
            </div>
          </div>

          {/* Middle Section: Value Proposition & Feature Highlights */}
          <div className="relative z-10 my-8 space-y-4">
            <p className="text-xs sm:text-sm text-cream-100/90 leading-relaxed font-normal">
              Direct kitchen administration portal for authentic Arabian Shawarmas, Charcoal BBQ, and fresh fast food orders.
            </p>

            <ul className="space-y-2.5 text-xs text-cream-200/85">
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-forest-800/80 border border-forest-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-terracotta-400" />
                </div>
                <span>Live Menu Prices & Stock Toggles</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-forest-800/80 border border-forest-700 flex items-center justify-center shrink-0">
                  <Flame className="w-3 h-3 text-terracotta-400" />
                </div>
                <span>Real-Time WhatsApp Order Dispatch Log</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-forest-800/80 border border-forest-700 flex items-center justify-center shrink-0">
                  <Layers className="w-3 h-3 text-terracotta-400" />
                </div>
                <span>Category & Culinary Asset Management</span>
              </li>
            </ul>
          </div>

          {/* Bottom Section: Security & System Badge */}
          <div className="relative z-10 pt-4 border-t border-forest-800/80 flex items-center justify-between text-[11px] text-cream-200/70">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-forest-400" />
              <span>Role-Based Secure JWT</span>
            </div>
            <span>v2.4 Production</span>
          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT PANEL: Choreographed 7-Step Login Form             */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 bg-cream-50/70 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          
          <div>
            {/* Step 1 & 2: Top Navigation & Portal Badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex items-center justify-between mb-8"
            >
              <button
                type="button"
                onClick={() => navigateTo('customer')}
                className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-600 hover:text-forest-900 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                <span>Return to Customer Menu</span>
              </button>

              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cream-200/70 rounded-md text-[11px] font-semibold text-charcoal-700 border border-cream-300">
                <Store className="w-3.5 h-3.5 text-forest-800" />
                <span>Kitchen Console</span>
              </div>
            </motion.div>

            {/* Step 3: Header Title */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="mb-6 space-y-1"
            >
              <div className="w-10 h-10 bg-forest-900 text-cream-50 rounded-lg flex items-center justify-center mb-3 shadow-xs">
                <Lock className="w-5 h-5 text-terracotta-300" />
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-forest-950 tracking-tight">
                Kitchen Admin Sign In
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-600">
                Authenticate to manage live dishes, prices, and store configurations.
              </p>
            </motion.div>

            {/* Non-destructive Inline Error Display */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -6 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="mb-5 p-3.5 bg-red-50/90 border border-red-300 rounded-lg text-xs text-red-800 flex items-start gap-2.5 shadow-xs"
                >
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{error}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Step 4: Username Input */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5 uppercase tracking-wider">
                  Admin Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (error) setError('');
                    }}
                    disabled={isLoading}
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-800 focus:border-forest-800 transition-all shadow-xs disabled:opacity-60"
                    placeholder="e.g. admin"
                    required
                  />
                </div>
              </motion.div>

              {/* Step 5: Password Input with Show/Hide Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
              >
                <label className="block text-xs font-bold text-charcoal-800 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    disabled={isLoading}
                    autoComplete="current-password"
                    className="w-full pl-10 pr-11 py-2.5 text-xs sm:text-sm bg-white border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-800 focus:border-forest-800 transition-all shadow-xs disabled:opacity-60"
                    placeholder="Enter admin password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-charcoal-400 hover:text-charcoal-700 transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Step 6: Remember Me & Security Note */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="flex items-center justify-between text-xs pt-1"
              >
                <label className="inline-flex items-center gap-2 text-charcoal-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-forest-900 border-cream-300 focus:ring-forest-700 focus:ring-1"
                  />
                  <span className="font-medium">Remember my username</span>
                </label>

                <button
                  type="button"
                  onClick={handleFillDemoCredentials}
                  className="text-terracotta-700 hover:text-terracotta-800 font-semibold underline underline-offset-2 transition-colors"
                >
                  Fill Demo Credentials
                </button>
              </motion.div>

              {/* Step 7: Submit Button with Micro-Press Scale & Loading Spinner */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.3 }}
                className="pt-2"
              >
                <motion.button
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-forest-900 hover:bg-forest-800 active:bg-forest-950 text-cream-50 font-bold text-xs sm:text-sm rounded-lg transition-all shadow-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-forest-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-terracotta-300" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : loginSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span>Opening Dashboard...</span>
                    </>
                  ) : (
                    <span>Sign In to Kitchen Dashboard</span>
                  )}
                </motion.button>
              </motion.div>

            </form>
          </div>

          {/* Quick Demo Access Bar */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="mt-8 pt-5 border-t border-cream-200"
          >
            <div className="p-3.5 bg-cream-100/90 rounded-xl border border-cream-300 text-xs text-charcoal-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-forest-950">Pre-Configured Client Demo Credentials</div>
                  <div className="text-[11px] text-charcoal-600 font-mono">
                    User: <strong className="text-forest-900">admin</strong> &bull; Pass: <strong className="text-forest-900">floz@nagercoil2026</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFillDemoCredentials}
                className="self-start sm:self-auto px-3 py-1.5 bg-white hover:bg-cream-200 text-forest-900 border border-cream-300 rounded-md text-xs font-bold transition-colors shrink-0"
              >
                1-Click Auto Fill
              </button>
            </div>
          </motion.div>

        </div>

      </motion.div>

    </div>
  );
};
