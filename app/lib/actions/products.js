"use server";

import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ---------- helpers ----------

const VALID_CATEGORIES = ["jewelry", "lipgloss", "gadgets", "fashion"];

function sanitize(str, maxLen = 200) {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, maxLen);
}

function isValidUUID(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Verify the caller is an authenticated admin. */
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

function validateProductData(productData) {
  const name = sanitize(productData.name, 200);
  if (!name) return { error: "Product name is required" };

  const price = parseFloat(productData.price);
  if (isNaN(price) || price < 0) return { error: "Valid price is required" };

  const category = sanitize(productData.category, 50).toLowerCase();
  if (!VALID_CATEGORIES.includes(category)) return { error: "Invalid category" };

  const originalPrice = productData.originalPrice ? parseFloat(productData.originalPrice) : null;
  if (originalPrice !== null && (isNaN(originalPrice) || originalPrice < 0)) {
    return { error: "Invalid original price" };
  }

  const image = sanitize(productData.image, 2000);
  const description = sanitize(productData.description, 5000);

  return {
    data: {
      name,
      slug: generateSlug(name),
      price,
      original_price: originalPrice,
      image,
      images: Array.isArray(productData.images)
        ? productData.images.filter((url) => typeof url === "string").map((url) => url.slice(0, 2000))
        : [],
      category,
      description,
      is_featured: Boolean(productData.isFeatured),
      is_new: Boolean(productData.isNew),
      is_sale: Boolean(productData.isSale),
      in_stock: productData.inStock ?? true,
      rating: 0,
      reviews_count: 0,
    },
  };
}

// ---------- actions ----------

export async function createProduct(productData) {
  await requireAdmin();

  const validated = validateProductData(productData);
  if (validated.error) return validated;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .insert(validated.data)
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    return { error: "Failed to create product" };
  }

  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath("/");

  return { data };
}

export async function updateProduct(id, productData) {
  await requireAdmin();

  if (!isValidUUID(id)) return { error: "Invalid product ID" };

  const validated = validateProductData(productData);
  if (validated.error) return validated;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .update(validated.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating product:", error);
    return { error: "Failed to update product" };
  }

  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath(`/product/${data.slug}`);
  revalidatePath("/");

  return { data };
}

export async function deleteProduct(id) {
  await requireAdmin();

  if (!isValidUUID(id)) return { error: "Invalid product ID" };

  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    return { error: "Failed to delete product" };
  }

  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath("/");

  return { success: true };
}

export async function toggleProductStock(id, inStock) {
  await requireAdmin();

  if (!isValidUUID(id)) return { error: "Invalid product ID" };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .update({ in_stock: Boolean(inStock) })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error toggling product stock:", error);
    return { error: "Failed to update product" };
  }

  revalidatePath("/shop");
  revalidatePath("/admin/products");

  return { data };
}

export async function toggleProductFeatured(id, isFeatured) {
  await requireAdmin();

  if (!isValidUUID(id)) return { error: "Invalid product ID" };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .update({ is_featured: Boolean(isFeatured) })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error toggling product featured:", error);
    return { error: "Failed to update product" };
  }

  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath("/");

  return { data };
}
