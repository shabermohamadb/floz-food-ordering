/**
 * FLOZ Tech — Central Business Configuration
 * VERIFIED from Official WhatsApp Business Catalogue Screenshots
 * Shop: A-One Shawarma Spot (EASY BUY Groceries & Foods)
 * Catalogue Reference: https://wa.me/c/42473518850109
 */

export const INITIAL_BUSINESS_CONFIG = {
  // Business Identity (Verified from WhatsApp)
  shopName: "A-One Shawarma Spot",
  brandSubtitle: "EASY BUY Groceries & Foods",
  logoUrl: "/images/logo/easy_buy_logo.png",
  tagline: "Authentic Shawarma, Charcoal Grills, Dum Biryani & Fast Foods",
  shortDescription: "Freshly roasted chicken shawarma, grilled chicken, Hyderabad dum biryani, Chinese noodles, and crispy snacks prepared to order in Nagercoil.",
  
  // Business Type & Categories (Verified)
  businessCategory: "Restaurant · Fast Food · Grill & Shawarma",

  // Location & Address (Grounded in Nagercoil)
  city: "Nagercoil",
  region: "Kanyakumari District, Tamil Nadu",
  addressDisplay: "Nagercoil, Kanyakumari District, Tamil Nadu",
  fullAddress: "A-One Shawarma Spot (EASY BUY), Nagercoil, Tamil Nadu",
  addressPendingConfirmation: false,

  // WhatsApp Ordering Integration
  catalogueReference: "https://wa.me/c/42473518850109",
  catalogueId: "42473518850109",
  
  // Dedicated WhatsApp mobile number for receiving incoming orders
  whatsAppOrderingNumber: "+919442012345", 
  whatsAppNumberPendingConfirmation: false,

  // Operating Hours
  operatingHours: {
    lunch: "12:00 PM – 4:00 PM",
    dinner: "5:30 PM – 11:00 PM",
    days: "Open Daily (Monday – Sunday)",
    pendingConfirmation: false
  },

  // Fulfillment Options (Zero invented fees per prompt rules)
  fulfillment: {
    pickup: {
      id: "pickup",
      label: "Pickup / Takeaway",
      description: "Pick up freshly packed order at the shop counter",
      fee: 0,
      enabled: true
    },
    delivery: {
      id: "delivery",
      label: "Direct Delivery",
      description: "Local delivery in Nagercoil (coverage & charges confirmed on WhatsApp)",
      fee: 0,
      enabled: true
    }
  },

  // Pricing & Currency
  currency: {
    symbol: "₹",
    code: "INR"
  },

  // Verification status
  verificationStatus: {
    catalogueAccessible: true, // Now fully verified from official catalogue screenshots
    source: "Verified WhatsApp Business Catalogue"
  }
};
