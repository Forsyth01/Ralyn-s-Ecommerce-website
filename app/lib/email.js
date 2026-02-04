import emailjs from "@emailjs/browser";

// Initialize EmailJS with your public key
emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const ADMIN_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID;
const CUSTOMER_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_CUSTOMER_TEMPLATE_ID;

/**
 * Format order items for email display
 */
function formatOrderItems(items) {
  return items
    .map(
      (item) =>
        `${item.name} (x${item.quantity}) - ₦${item.price.toLocaleString()}`
    )
    .join("\n");
}

/**
 * Send order notification email to admin
 */
export async function sendAdminNotification(orderData) {
  try {
    const templateParams = {
      order_number: orderData.orderNumber,
      customer_name: `${orderData.firstName} ${orderData.lastName}`,
      customer_email: orderData.email,
      customer_phone: orderData.phone,
      delivery_address: `${orderData.address}, ${orderData.city}, ${orderData.state}`,
      order_items: formatOrderItems(orderData.items),
      items_count: orderData.itemsCount,
      subtotal: `₦${orderData.subtotal.toLocaleString()}`,
      shipping: orderData.shipping === 0 ? "Free" : `₦${orderData.shipping.toLocaleString()}`,
      total: `₦${orderData.total.toLocaleString()}`,
      payment_method: orderData.paymentMethod === "card" ? "Card Payment" : "Bank Transfer",
      order_date: new Date().toLocaleString("en-NG", {
        dateStyle: "full",
        timeStyle: "short",
      }),
    };

    const response = await emailjs.send(
      SERVICE_ID,
      ADMIN_TEMPLATE_ID,
      templateParams
    );

    console.log("Admin notification sent:", response.status);
    return { success: true };
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send order confirmation email to customer
 */
export async function sendCustomerConfirmation(orderData) {
  try {
    const templateParams = {
      to_email: orderData.email,
      to_name: orderData.firstName,
      order_number: orderData.orderNumber,
      customer_name: `${orderData.firstName} ${orderData.lastName}`,
      delivery_address: `${orderData.address}, ${orderData.city}, ${orderData.state}`,
      order_items: formatOrderItems(orderData.items),
      items_count: orderData.itemsCount,
      subtotal: `₦${orderData.subtotal.toLocaleString()}`,
      shipping: orderData.shipping === 0 ? "Free" : `₦${orderData.shipping.toLocaleString()}`,
      total: `₦${orderData.total.toLocaleString()}`,
      payment_method: orderData.paymentMethod === "card" ? "Card Payment" : "Bank Transfer",
      order_date: new Date().toLocaleString("en-NG", {
        dateStyle: "full",
        timeStyle: "short",
      }),
    };

    const response = await emailjs.send(
      SERVICE_ID,
      CUSTOMER_TEMPLATE_ID,
      templateParams
    );

    console.log("Customer confirmation sent:", response.status);
    return { success: true };
  } catch (error) {
    console.error("Failed to send customer confirmation:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send both admin notification and customer confirmation
 */
export async function sendOrderEmails(orderData) {
  const results = await Promise.allSettled([
    sendAdminNotification(orderData),
    sendCustomerConfirmation(orderData),
  ]);

  return {
    adminEmail: results[0].status === "fulfilled" ? results[0].value : { success: false },
    customerEmail: results[1].status === "fulfilled" ? results[1].value : { success: false },
  };
}
