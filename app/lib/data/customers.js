import { createClient } from "@/app/lib/supabase/server";

export async function getCustomers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching customers:", error);
    return [];
  }

  return data || [];
}

export async function getCustomerById(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching customer:", error);
    return null;
  }

  return data;
}

export async function getCustomerByEmail(email) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function getCustomerOrders(customerId) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching customer orders:", error);
    return [];
  }

  return data || [];
}

export async function getCustomerStats() {
  const supabase = await createClient();
  const { data: customers } = await supabase.from("customers").select("*");

  const totalCustomers = customers?.length || 0;
  const activeCustomers = customers?.filter(c => c.status === "active").length || 0;
  const totalRevenue = customers?.reduce((sum, c) => sum + parseFloat(c.total_spent || 0), 0) || 0;
  const avgOrderValue = totalCustomers > 0
    ? totalRevenue / customers?.reduce((sum, c) => sum + (c.orders_count || 0), 0) || 0
    : 0;

  return {
    totalCustomers,
    activeCustomers,
    totalRevenue,
    avgOrderValue,
  };
}
