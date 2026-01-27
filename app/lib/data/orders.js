import { createClient } from "@/app/lib/supabase/server";

export async function getOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data || [];
}

export async function getOrderById(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching order:", error);
    return null;
  }

  return data;
}

export async function getOrderByNumber(orderNumber) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  if (error) {
    console.error("Error fetching order:", error);
    return null;
  }

  return data;
}

export async function getOrdersByStatus(status) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders by status:", error);
    return [];
  }

  return data || [];
}

export async function getOrderStats() {
  const supabase = await createClient();

  // Get total revenue
  const { data: orders } = await supabase.from("orders").select("total, status");

  const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total || 0), 0) || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(o => o.status === "pending").length || 0;
  const processingOrders = orders?.filter(o => o.status === "processing").length || 0;
  const shippedOrders = orders?.filter(o => o.status === "shipped").length || 0;
  const deliveredOrders = orders?.filter(o => o.status === "delivered").length || 0;

  return {
    totalRevenue,
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
  };
}
