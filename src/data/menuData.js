/**
 * VERIFIED MENU CATALOGUE
 * Source: Official WhatsApp Business Catalogue (wa.me/c/42473518850109)
 * Shop: A-One Shawarma Spot (EASY BUY Groceries & Foods), Nagercoil
 */

export const MENU_CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "starters-chicken", label: "Starters & Chicken" },
  { id: "shawarma-spot", label: "Shawarma Specials" },
  { id: "gravy-variety", label: "Gravy Variety" },
  { id: "indian-variety", label: "Indian & Biryani" },
  { id: "chinese-variety", label: "Chinese & Noodles" },
  { id: "sandwich-snacks", label: "Sandwich & Snacks" }
];

export const INITIAL_MENU_ITEMS = [
  // 1. STARTERS CHICKEN VARIETY (Verified from WhatsApp)
  {
    id: "hot-garlic-chicken",
    name: "HOT GARLIC CHICKEN",
    category: "starters-chicken",
    categoryLabel: "Starters Chicken Variety",
    price: 160,
    originalPrice: 180,
    description: "Crispy chicken tossed in fiery hot garlic sauce with scallions and oriental seasonings.",
    isVeg: false,
    isBestseller: true,
    isAvailable: true,
    isCatalogueVerified: true,
    image: "/images/dishes/hot_garlic_chicken.jpg"
  },
  {
    id: "grill-chicken-full",
    name: "Grill chicken full",
    category: "starters-chicken",
    categoryLabel: "Starters Chicken Variety",
    price: 480,
    originalPrice: 520,
    description: "Grill chicken 8pcs, mayonnaise 1 box, mint chutney, kubboos.", // Exact from WhatsApp!
    isVeg: false,
    isBestseller: true,
    isAvailable: true,
    isCatalogueVerified: true,
    image: "/images/dishes/grill_chicken_full.jpg"
  },
  {
    id: "afc-fried-chicken",
    name: "AFC FRIED CHICKEN 4 pcs",
    category: "starters-chicken",
    categoryLabel: "Starters Chicken Variety",
    price: 280,
    originalPrice: 320,
    description: "Crispy golden fried chicken 4 pieces, seasoned with special spices.",
    isVeg: false,
    isBestseller: true,
    isAvailable: true,
    isCatalogueVerified: true,
    image: "/images/dishes/afc_fried_chicken.jpg"
  },

  // 2. SHAWARMA SPECIALS (A-One Signature Item)
  {
    id: "a-one-chicken-shawarma",
    name: "A-One Special Chicken Shawarma",
    category: "shawarma-spot",
    categoryLabel: "Shawarma Specials",
    price: 100,
    originalPrice: 120,
    description: "Slow roasted spit-grilled juicy chicken in soft roll with garlic toum mayonnaise and pickled salad.",
    isVeg: false,
    isBestseller: true,
    isAvailable: true,
    isCatalogueVerified: true,
    image: "/images/dishes/shawarma_roll.jpg"
  },

  // 3. GRAVY VARIETY (Verified from WhatsApp)
  {
    id: "pepper-chicken",
    name: "PEPPER CHICKEN",
    category: "gravy-variety",
    categoryLabel: "Gravy Variety",
    price: 140,
    originalPrice: 150,
    description: "Spicy and peppery chicken gravy prepared with freshly roasted black peppercorns and curry leaves.",
    isVeg: false,
    isBestseller: false,
    isAvailable: true,
    isCatalogueVerified: true,
    image: "/images/dishes/pepper_chicken.jpg"
  },
  {
    id: "sweet-sour-chicken",
    name: "SWEET & SOUR CHICKEN",
    category: "gravy-variety",
    categoryLabel: "Gravy Variety",
    price: 170,
    originalPrice: 180,
    description: "Crispy battered chicken chunks tossed in sweet and tangy Cantonese style glaze with capsicum.",
    isVeg: false,
    isBestseller: false,
    isAvailable: true,
    isCatalogueVerified: true,
    image: "/images/dishes/sweet_sour_chicken.jpg"
  },

  // 4. INDIAN FOOD VARIETY (Verified from WhatsApp)
  {
    id: "hyderabad-egg-dum-biryani",
    name: "Hyderabad EGG DUM BIRYANI",
    category: "indian-variety",
    categoryLabel: "Indian Food Variety",
    price: 130,
    originalPrice: 140,
    description: "Aromatic basmati rice cooked on slow dum with royal spices and seasoned boiled eggs. Served with raita.",
    isVeg: false,
    isBestseller: false,
    isAvailable: true,
    isCatalogueVerified: true,
    image: "/images/dishes/egg_dum_biryani.jpg"
  },
  {
    id: "beef-kothu-porota",
    name: "Beef kothu porota",
    category: "indian-variety",
    categoryLabel: "Indian Food Variety",
    price: 180,
    originalPrice: 200,
    description: "Shredded layered parotta beaten on iron tawa with spiced beef chunks, onion, and rich salna.",
    isVeg: false,
    isBestseller: true,
    isAvailable: true,
    isCatalogueVerified: true,
    image: "/images/dishes/beef_kothu_porota.jpg"
  },
  {
    id: "hyderabad-chicken-dum-biryani",
    name: "Hyderabad CHICKEN DUM BIRYANI",
    category: "indian-variety",
    categoryLabel: "Indian Food Variety",
    price: 170,
    originalPrice: 180,
    description: "Rich Hyderabad dum biryani layered with succulent marinated chicken, whole spices, and fried onions.",
    isVeg: false,
    isBestseller: true,
    isAvailable: true,
    isCatalogueVerified: true,
    image: "/images/dishes/chicken_dum_biryani.jpg"
  },

  // 5. CHINESE FOOD VARIETY (Verified from WhatsApp)
  {
    id: "schezwan-egg-noodles",
    name: "Schezwan egg noodles",
    category: "chinese-variety",
    categoryLabel: "Chinese Food Variety",
    price: 130,
    originalPrice: 140,
    description: "Spicy Schezwan tossed wok noodles with shredded eggs, cabbage, carrots, and spring onions.",
    isVeg: false,
    isBestseller: false,
    isAvailable: true,
    isCatalogueVerified: true,
    image: "/images/dishes/schezwan_egg_noodles.jpg"
  },
  {
    id: "chicken-noodles-normal",
    name: "Chicken noodles normal",
    category: "chinese-variety",
    categoryLabel: "Chinese Food Variety",
    price: 120,
    originalPrice: 130,
    description: "Stir-fried noodles with chicken shreds, fresh vegetables, and savory sauce.",
    isVeg: false,
    isBestseller: false,
    isAvailable: true,
    isCatalogueVerified: true,
    image: "/images/dishes/chicken_noodles_normal.jpg"
  },

  // 6. SANDWICH & BURGER & PIZZA (Verified from WhatsApp)
  {
    id: "veg-sandwich",
    name: "Veg Sandwich",
    category: "sandwich-snacks",
    categoryLabel: "Sandwich & Burger & Pizza",
    price: 100,
    originalPrice: 120,
    description: "Crispy grilled bread packed with fresh cucumber, tomatoes, green chutney, and mild cheese.",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    isCatalogueVerified: true,
    image: "/images/dishes/veg_sandwich.jpg"
  },
  {
    id: "chicken-sandwich",
    name: "Chicken sandwich",
    category: "sandwich-snacks",
    categoryLabel: "Sandwich & Burger & Pizza",
    price: 120,
    originalPrice: 140,
    description: "Toasted club sandwich stuffed with seasoned shredded chicken and creamy spread.",
    isVeg: false,
    isBestseller: true,
    isAvailable: true,
    isCatalogueVerified: true,
    image: "/images/dishes/chicken_sandwich.jpg"
  },
  {
    id: "crispy-sandwich",
    name: "Crispy Sandwich",
    category: "sandwich-snacks",
    categoryLabel: "Sandwich & Burger & Pizza",
    price: 140,
    originalPrice: 150,
    description: "Double grilled extra crispy sandwich loaded with savoury filling and seasoning.",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    isCatalogueVerified: true,
    image: "/images/dishes/crispy_sandwich.jpg"
  },

  // 7. SNACKS (Verified from WhatsApp)
  {
    id: "peri-peri-french-fries",
    name: "Peri peri french fries",
    category: "sandwich-snacks",
    categoryLabel: "Snacks",
    price: 110,
    originalPrice: 130,
    description: "Crispy golden fried potato batons dusted in spicy tangy peri-peri seasoning.",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    isCatalogueVerified: true,
    image: "/images/dishes/peri_peri_fries.jpg"
  },
  {
    id: "chicken-momos",
    name: "Chicken momos",
    category: "sandwich-snacks",
    categoryLabel: "Snacks",
    price: 120,
    originalPrice: 140,
    description: "Steamed chicken dumplings served hot with spicy chilli-garlic chutney.",
    isVeg: false,
    isBestseller: false,
    isAvailable: true,
    isCatalogueVerified: true,
    image: "/images/dishes/chicken_momos.jpg"
  }
];
