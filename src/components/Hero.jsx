import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Clock, MapPin, CheckCircle2, Flame, Volume2, VolumeX } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Hero = () => {
  const { businessConfig, setIsCartOpen, itemCount } = useCart();
  
  // Video States & Controls
  const [isMuted, setIsMuted] = useState(true);
  const bgVideoRef = useRef(null);
  const cardVideoRef = useRef(null);

  // Guarantee autoplay in Chrome/Chromium without user-interaction block
  useEffect(() => {
    if (bgVideoRef.current) {
      bgVideoRef.current.defaultMuted = true;
      bgVideoRef.current.muted = true;
      const p = bgVideoRef.current.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    }
    if (cardVideoRef.current) {
      cardVideoRef.current.defaultMuted = true;
      cardVideoRef.current.muted = true;
      const p2 = cardVideoRef.current.play();
      if (p2 !== undefined) {
        p2.catch(() => {});
      }
    }
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (cardVideoRef.current) {
      cardVideoRef.current.muted = nextMuted;
    }
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }
    }
  };

  return (
    <section id="hero" className="relative bg-cream-100 border-b border-cream-200 overflow-hidden min-h-[160px] sm:min-h-[340px] md:min-h-[560px] flex items-center">
      
      {/* ========================================================================= */}
      {/* 1. BACKGROUND VIDEO LAYER: High Visibility & Vibrant Culinary Motion      */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <video
          ref={bgVideoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/hero-poster.jpg"
          className="w-full h-full object-cover object-center opacity-80 sm:opacity-85 filter contrast-105 saturate-115 scale-105"
          src="/videos/Preparing_South_Indian_food_dishes_20261011000234.mp4"
        />

        {/* Directional Soft Tint: preserves high text contrast on left while keeping right/center 80%+ clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream-100 via-cream-100/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream-100/90 via-transparent to-cream-100/40" />
        <div className="absolute inset-0 bg-forest-950/5 mix-blend-multiply" />
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN HERO CONTENT CONTAINER                                            */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 md:py-16 lg:py-20 relative z-10 w-full">
        {/* MOBILE VIEW (< sm): Sleek, high-impact app hero banner */}
        <div className="sm:hidden text-left space-y-2 py-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/90 backdrop-blur-xs border border-cream-300 rounded text-[10px] font-bold text-charcoal-700 shadow-2xs">
            <Flame className="w-3 h-3 text-terracotta-500" />
            <span>A-One Shawarma Spot</span>
            <span className="text-cream-300">|</span>
            <span className="text-forest-700">25–35 mins</span>
          </div>

          <h1 className="text-lg font-heading font-extrabold text-forest-950 leading-snug">
            Fresh Charcoal Grills, Shawarma & Hyderabad Dum Biryani
          </h1>

          <p className="text-[11px] text-charcoal-600 leading-normal">
            Direct kitchen rates · Takeaway & delivery in Nagercoil.
          </p>
        </div>

        {/* DESKTOP VIEW (>= sm): Full spacious presentation */}
        <div className="hidden sm:grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Clean text layout directly on background (No glass box) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6 text-left"
          >
            
            {/* Location & Status Tag */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-cream-300 rounded text-xs text-charcoal-700 font-medium shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                <span>Nagercoil, Tamil Nadu</span>
                <span className="text-cream-300">|</span>
                <span className="text-forest-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified WhatsApp Catalogue</span>
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-forest-900 text-cream-50 rounded text-[11px] font-semibold shadow-2xs">
                <Flame className="w-3 h-3 text-terracotta-400" />
                <span>Live Kitchen Stream</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-hero-headline text-forest-950"
            >
              Fresh Shawarma, Charcoal Grills & Biryani Ordered Directly on WhatsApp.
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base md:text-lg text-charcoal-700 leading-relaxed font-normal"
            >
              Welcome to <strong className="font-semibold text-forest-950">{businessConfig.shopName}</strong>
              {businessConfig.brandSubtitle ? ` (${businessConfig.brandSubtitle})` : ''}. Browse our verified daily menu of Hot Garlic Chicken, Whole Grill Chicken, AFC Fried Chicken, and Hyderabad Dum Biryani with direct kitchen rates.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToMenu}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-forest-900 hover:bg-forest-800 active:bg-forest-950 text-cream-50 font-bold text-sm rounded-lg transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-forest-700 cursor-pointer"
              >
                <span>Explore Menu</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (itemCount > 0) {
                    setIsCartOpen(true);
                  } else {
                    scrollToMenu();
                  }
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-cream-100 text-forest-900 font-bold text-sm rounded-lg border border-forest-800/25 transition-all focus:outline-none focus:ring-2 focus:ring-forest-700 shadow-2xs cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-forest-700" />
                <span>Order on WhatsApp</span>
              </motion.button>
            </motion.div>

            {/* Ordering Reassurance Grid */}
            <motion.div
              variants={itemVariants}
              className="pt-5 border-t border-cream-300/70 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-charcoal-700"
            >
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-forest-700 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-forest-950">Daily Kitchen Hours</div>
                  <div className="text-charcoal-500 font-normal">12:00 PM – 4:00 PM, 5:30 PM – 11:00 PM</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-forest-700 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-forest-950">Fast WhatsApp Checkout</div>
                  <div className="text-charcoal-500 font-normal">Direct transmission to shop counter</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest-700 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-forest-950">Direct Catalogue Rates</div>
                  <div className="text-charcoal-500 font-normal">Official discounted pricing verified</div>
                </div>
              </div>
            </motion.div>

          </motion.div>

          {/* ========================================================================= */}
          {/* Right Column: Clean Video Showcase Card (No header switcher)              */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative bg-white border border-cream-300 rounded-2xl p-4 sm:p-5 shadow-xl text-left">
              
              {/* Media Display Container (Stream directly without header switcher) */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-charcoal-900 shadow-inner group">
                {/* Live HD Video Stream */}
                <video
                  ref={cardVideoRef}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  poster="/videos/hero-poster.jpg"
                  className="w-full h-full object-cover"
                  src="/videos/Preparing_South_Indian_food_dishes_20261011000234.mp4"
                />

                {/* Badge Overlay */}
                <div className="absolute top-2.5 left-2.5 bg-forest-950/90 text-cream-100 px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>Live South Indian Kitchen Prep</span>
                </div>

                {/* Top-Right Mute/Unmute Control */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className="absolute top-2.5 right-2.5 z-10 p-1.5 text-cream-100 hover:text-white bg-forest-950/80 hover:bg-forest-950 rounded-lg transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                  aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-terracotta-300" />}
                </button>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-forest-950/90 text-cream-100 px-3 py-1.5 rounded-lg text-xs text-left shadow-xs flex items-center justify-between">
                  <span className="font-semibold text-terracotta-300">Authentic Nagercoil Preparation</span>
                  <span className="text-[11px] text-cream-200 font-mono">1080p Stream</span>
                </div>
              </div>

              {/* Caption & Shop Details */}
              <div className="mt-3.5 text-left space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-forest-950">{businessConfig.shopName}</span>
                  <span className="text-terracotta-600 font-semibold">Pickup & Delivery in Nagercoil</span>
                </div>
                <p className="text-[11px] text-charcoal-500 font-normal">
                  Fresh dishes prepared daily with verified catalogue pricing.
                </p>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
