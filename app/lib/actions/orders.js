"use server";

import { createAdminClient } from "@/app/lib/supabase/admin";
import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

// ---------- helpers ----------

function generateOrderNumber() {
  const hex = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `ORD-${hex}`;
}

const SHIPPING_COST = 2500;
const FREE_SHIPPING_THRESHOLD = 50000;
const VALID_ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const VALID_PAYMENT_METHODS = ["card", "transfer"];

function sanitize(str, maxLen = 200) {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, maxLen);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUUID(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

/** Verify the caller is an authenticated admin. Returns the admin user or throws. */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!adminUser) {
    throw new Error("Forbidden");
  }

  return user;
}

// ---------- actions ----------

export async function createOrder(orderData) {
  const supabase = createAdminClient();

  try {
    // ---- Input validation ----
    const email = sanitize(orderData.email, 254);
    const firstName = sanitize(orderData.firstName, 100);
    const lastName = sanitize(orderData.lastName, 100);
    const phone = sanitize(orderData.phone, 30);
    const address = sanitize(orderData.address, 500);
    const city = sanitize(orderData.city, 100);
    const state = sanitize(orderData.state, 100);
    const paymentMethod = sanitize(orderData.paymentMethod, 20);

    if (!email || !isValidEmail(email)) {
      return { error: "Valid email is required" };
    }
    if (!firstName || !lastName) {
      return { error: "First and last name are required" };
    }
    if (!phone) {
      return { error: "Phone number is required" };
    }
    if (!address || !city || !state) {
      return { error: "Complete address is required" };
    }
    if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
      return { error: "Invalid payment method" };
    }

    // ---- Validate items & recalculate prices server-side ----
    const items = orderData.items;
    if (!Array.isArray(items) || items.length === 0) {
      return { error: "Cart is empty" };
    }

    let serverSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      if (!item.id || !isValidUUID(item.id)) {
        return { error: "Invalid item in cart" };
      }

      const qty = parseInt(item.quantity, 10);
      if (!Number.isInteger(qty) || qty < 1 || qty > 100) {
        return { error: `Invalid quantity for ${sanitize(item.name, 50)}` };
      }

      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id, name, price, stock_quantity, image")
        .eq("id", item.id)
        .single();

      if (productError || !product) {
        return { error: `Product not found: ${sanitize(item.name, 50)}` };
      }

      if (product.stock_quantity < qty) {
        return {
          error: `Insufficient stock for ${product.name}. Only ${product.stock_quantity} available.`,
        };
      }

      serverSubtotal += product.price * qty;

      verifiedItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        image: product.image,
        selectedSize: sanitize(item.selectedSize || "", 10) || null,
      });
    }

    // Recalculate totals server-side (never trust client values)
    const serverShipping = serverSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const serverTotal = serverSubtotal + serverShipping;

    // ---- Find or create customer ----
    let customerId = null;

    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id, orders_count, total_spent")
      .eq("email", email)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;

      await supabase
        .from("customers")
        .update({
          orders_count: existingCustomer.orders_count + 1,
          total_spent: parseFloat(existingCustomer.total_spent) + serverTotal,
        })
        .eq("id", customerId);
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from("customers")
        .insert({
          email,
          name: `${firstName} ${lastName}`,
          phone,
          orders_count: 1,
          total_spent: serverTotal,
        })
        .select("id")
        .single();

      if (customerError) {
        console.error("Error creating customer:", customerError);
        return { error: "Failed to create customer" };
      }

      customerId = newCustomer.id;
    }

    // ---- Create the order ----
    const orderNumber = generateOrderNumber();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_id: customerId,
        customer_name: `${firstName} ${lastName}`,
        email,
        phone,
        address,
        city,
        state,
        items: verifiedItems,
        items_count: verifiedItems.reduce((sum, i) => sum + i.quantity, 0),
        subtotal: serverSubtotal,
        shipping: serverShipping,
        total: serverTotal,
        payment_method: paymentMethod,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return { error: "Failed to create order" };
    }

    // ---- Decrement stock ----
    for (const item of verifiedItems) {
      const { error: stockError } = await supabase.rpc("update_product_stock", {
        product_id: item.id,
        quantity_sold: item.quantity,
      });

      if (stockError) {
        console.error("Error updating stock:", stockError);
      }
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin/customers");
    revalidatePath("/admin");
    revalidatePath("/admin/products");

    return { data: order };
  } catch (error) {
    console.error("Order creation error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function updateOrderStatus(orderId, status) {
  // Only admins can update order status
  await requireAdmin();

  if (!isValidUUID(orderId)) {
    return { error: "Invalid order ID" };
  }

  if (!VALID_ORDER_STATUSES.includes(status)) {
    return { error: "Invalid order status" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error("Error updating order status:", error);
    return { error: "Failed to update order status" };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");

  return { data };
}

export async function getRecentOrders(limit = 6) {
  const supabase = await createClient();

  const safeLimit = Math.min(Math.max(1, parseInt(limit, 10) || 6), 50);

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(safeLimit);

  if (error) {
    console.error("Error fetching recent orders:", error);
    return [];
  }

  return data || [];
}
