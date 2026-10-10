/**
 * WhatsApp Order Message Formatter & URL Generator
 * Formats cart items, subtotal, transparent charges, and customer details.
 * Strictly adheres to WhatsApp URL encoding standards without emojis.
 */

export const sanitizePhoneNumber = (phone) => {
  if (!phone) return "";
  // Remove all non-digit characters except leading plus
  let cleaned = phone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }
  // If a 10 digit Indian number is entered without country code, add 91
  if (cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) {
    cleaned = "91" + cleaned;
  }
  return cleaned;
};

export const formatOrderMessage = ({
  shopName = "A-One Shawarma Spot",
  orderId = "",
  cartItems = [],
  subtotal = 0,
  deliveryFee = 0,
  total = 0,
  fulfillmentType = "delivery",
  customerDetails = {}
}) => {
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const timeStr = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const lines = [];

  // Header
  lines.push(`*NEW CASH ON DELIVERY ORDER — ${shopName.toUpperCase()}*`);
  if (orderId) {
    lines.push(`*Order Reference:* ${orderId}`);
  }
  lines.push(`Date: ${dateStr} at ${timeStr}`);
  lines.push(`----------------------------------------`);

  // Order Items
  lines.push(`*ORDER ITEMS:*`);
  cartItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    lines.push(`${index + 1}. ${item.name}`);
    lines.push(`   Qty: ${item.quantity} x Rs. ${item.price} = Rs. ${itemTotal}`);
  });

  lines.push(`----------------------------------------`);
  
  // Financial Summary & COD
  lines.push(`*PAYMENT & FINANCIAL SUMMARY:*`);
  lines.push(`Payment Method: Cash on Delivery (COD)`);
  lines.push(`Payment Status: Unpaid (Cash collected upon delivery)`);
  lines.push(`Items Subtotal: Rs. ${subtotal}`);
  if (fulfillmentType === "delivery") {
    lines.push(`Delivery Fee: Rs. ${deliveryFee}`);
  } else {
    lines.push(`Fulfillment: Self-Pickup (Free)`);
  }
  lines.push(`*TOTAL PAYABLE IN CASH: Rs. ${total}*`);
  
  lines.push(`----------------------------------------`);

  // Customer Information
  lines.push(`*CUSTOMER & DELIVERY DETAILS:*`);
  lines.push(`Name: ${customerDetails.name ? customerDetails.name.trim() : "Valued Customer"}`);
  if (customerDetails.phone && customerDetails.phone.trim()) {
    lines.push(`Contact Number: ${customerDetails.phone.trim()}`);
  }
  lines.push(`Fulfillment: ${fulfillmentType === "delivery" ? "Home Delivery (Nagercoil)" : "Store Pickup / Takeaway"}`);

  if (fulfillmentType === "delivery") {
    lines.push(`Address: ${customerDetails.address ? customerDetails.address.trim() : "Not provided"}`);
    if (customerDetails.locality && customerDetails.locality.trim()) {
      lines.push(`Area / Locality: ${customerDetails.locality.trim()}`);
    }
    if (customerDetails.landmark && customerDetails.landmark.trim()) {
      lines.push(`Landmark: ${customerDetails.landmark.trim()}`);
    }
  }

  if (customerDetails.notes && customerDetails.notes.trim()) {
    lines.push(`Kitchen Instructions: ${customerDetails.notes.trim()}`);
  }

  lines.push(`----------------------------------------`);
  lines.push(`*ORDER STATUS:* Pending kitchen acceptance`);
  lines.push(`This order is saved in the shop system. Please confirm order dispatch.`);

  return lines.join("\n");
};

export const generateWhatsAppOrderLink = ({
  phoneNumber,
  shopName,
  orderId,
  cartItems,
  subtotal,
  deliveryFee,
  total,
  fulfillmentType,
  customerDetails
}) => {
  const cleanNumber = sanitizePhoneNumber(phoneNumber);
  
  if (!cleanNumber || cleanNumber.length < 8) {
    return {
      success: false,
      error: "WhatsApp ordering number has not been configured yet. Please configure the verified shop mobile number in Demo Settings.",
      messageText: formatOrderMessage({
        shopName,
        orderId,
        cartItems,
        subtotal,
        deliveryFee,
        total,
        fulfillmentType,
        customerDetails
      })
    };
  }

  const messageText = formatOrderMessage({
    shopName,
    orderId,
    cartItems,
    subtotal,
    deliveryFee,
    total,
    fulfillmentType,
    customerDetails
  });

  const encodedMessage = encodeURIComponent(messageText);
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  return {
    success: true,
    url: waUrl,
    messageText,
    cleanNumber
  };
};
