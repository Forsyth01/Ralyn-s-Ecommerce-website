"use server";

import { createAdminClient } from "@/app/lib/supabase/admin";
import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `ORD-${timestamp}${random}`;
}

export async function createOrder(orderData) {
  // Use admin client to bypass RLS for order creation
  const supabase = createAdminClient();

  try {
    // First, find or create customer
    let customerId = null;

    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id, orders_count, total_spent")
      .eq("email", orderData.email)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;

      // Update existing customer stats
      await supabase
        .from("customers")
        .update({
          orders_count: existingCustomer.orders_count + 1,
          total_spent: parseFloat(existingCustomer.total_spent) + orderData.total,
        })
        .eq("id", customerId);
    } else {
      // Create new customer
      const { data: newCustomer, error: customerError } = await supabase
        .from("customers")
        .insert({
          email: orderData.email,
          name: `${orderData.firstName} ${orderData.lastName}`,
          phone: orderData.phone,
          orders_count: 1,
          total_spent: orderData.total,
        })
        .select("id")
        .single();

      if (customerError) {
        console.error("Error creating customer:", customerError);
        return { error: "Failed to create customer" };
      }

      customerId = newCustomer.id;
    }

    // Check stock availability for all items
    for (const item of orderData.items) {
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("stock_quantity, name")
        .eq("id", item.id)
        .single();

      if (productError) {
        console.error("Error fetching product:", productError);
        return { error: `Failed to verify stock for ${item.name}` };
      }

      if (product.stock_quantity < item.quantity) {
        return {
          error: `Insufficient stock for ${product.name}. Only ${product.stock_quantity} available.`,
        };
      }
    }

    // Create the order
    const orderNumber = generateOrderNumber();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_id: customerId,
        customer_name: `${orderData.firstName} ${orderData.lastName}`,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
        state: orderData.state,
        items: orderData.items,
        items_count: orderData.itemsCount,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        total: orderData.total,
        payment_method: orderData.paymentMethod,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return { error: "Failed to create order" };
    }

    // Decrement stock for each item
    for (const item of orderData.items) {
      const { error: stockError } = await supabase.rpc("update_product_stock", {
        product_id: item.id,
        quantity_sold: item.quantity,
      });

      if (stockError) {
        console.error("Error updating stock:", stockError);
        // Log the error but don't fail the order since it's already created
        // In production, you might want to implement a rollback mechanism
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
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error("Error updating order status:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");

  return { data };
}

export async function getRecentOrders(limit = 6) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent orders:", error);
    return [];
  }

  return data || [];
}
