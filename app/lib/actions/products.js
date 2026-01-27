"use server";

import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(productData) {
  const supabase = await createClient();

  const slug = generateSlug(productData.name);

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: productData.name,
      slug: slug,
      price: productData.price,
      original_price: productData.originalPrice || null,
      image: productData.image,
      images: productData.images || [],
      category: productData.category.toLowerCase(),
      description: productData.description,
      is_featured: productData.isFeatured || false,
      is_new: productData.isNew || false,
      is_sale: productData.isSale || false,
      in_stock: productData.inStock ?? true,
      rating: productData.rating || 0,
      reviews_count: productData.reviewsCount || 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    return { error: error.message };
  }

  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath("/");

  return { data };
}

export async function updateProduct(id, productData) {
  const supabase = await createClient();

  const updateData = {
    name: productData.name,
    price: productData.price,
    original_price: productData.originalPrice || null,
    image: productData.image,
    images: productData.images || [],
    category: productData.category.toLowerCase(),
    description: productData.description,
    is_featured: productData.isFeatured || false,
    is_new: productData.isNew || false,
    is_sale: productData.isSale || false,
    in_stock: productData.inStock ?? true,
  };

  // Update slug if name changed
  if (productData.name) {
    updateData.slug = generateSlug(productData.name);
  }

  const { data, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating product:", error);
    return { error: error.message };
  }

  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath(`/product/${data.slug}`);
  revalidatePath("/");

  return { data };
}

export async function deleteProduct(id) {
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    return { error: error.message };
  }

  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath("/");

  return { success: true };
}

export async function toggleProductStock(id, inStock) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .update({ in_stock: inStock })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error toggling product stock:", error);
    return { error: error.message };
  }

  revalidatePath("/shop");
  revalidatePath("/admin/products");

  return { data };
}

export async function toggleProductFeatured(id, isFeatured) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .update({ is_featured: isFeatured })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error toggling product featured:", error);
    return { error: error.message };
  }

  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath("/");

  return { data };
}
