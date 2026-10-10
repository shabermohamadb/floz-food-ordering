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
  shopName = "Nanjil Traditional Kitchen",
  cartItems = [],
  subtotal = 0,
  deliveryFee = 0,
  total = 0,
  fulfillmentType = "pickup",
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

  // Header (Using WhatsApp markdown *bold* and delimiters)
  lines.push(`*NEW FOOD ORDER — ${shopName.toUpperCase()}*`);
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
  
  // Financial Summary
  lines.push(`*FINANCIAL SUMMARY:*`);
  lines.push(`Items Subtotal: Rs. ${subtotal}`);
  if (fulfillmentType === "delivery") {
    lines.push(`Delivery Charges: Rs. 0 (To be confirmed by shop owner)`);
  } else {
    lines.push(`Fulfillment: Self-Pickup (Free)`);
  }
  lines.push(`*TOTAL AMOUNT PAYABLE: Rs. ${total}*`);
  
  lines.push(`----------------------------------------`);

  // Customer Information
  lines.push(`*CUSTOMER DETAILS:*`);
  lines.push(`Name: ${customerDetails.name ? customerDetails.name.trim() : "Valued Customer"}`);
  lines.push(`Order Type: ${fulfillmentType === "delivery" ? "Home Delivery (Nagercoil)" : "Store Pickup / Takeaway"}`);

  if (customerDetails.phone && customerDetails.phone.trim()) {
    lines.push(`Contact Number: ${customerDetails.phone.trim()}`);
  }

  if (fulfillmentType === "delivery") {
    lines.push(`Delivery Address: ${customerDetails.address ? customerDetails.address.trim() : "Not provided"}`);
  }

  if (customerDetails.notes && customerDetails.notes.trim()) {
    lines.push(`Special Instructions: ${customerDetails.notes.trim()}`);
  }

  lines.push(`----------------------------------------`);
  lines.push(`*NEXT STEP:*`);
  lines.push(`Please review and reply to this message to confirm order acceptance, preparation time, and delivery confirmation.`);

  return lines.join("\n");
};

export const generateWhatsAppOrderLink = ({
  phoneNumber,
  shopName,
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
