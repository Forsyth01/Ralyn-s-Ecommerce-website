"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Container from "@/app/components/layout/Container";
import ProductGrid from "@/app/components/products/ProductGrid";
import CategoryFilter from "@/app/components/products/CategoryFilter";
import SearchBar from "@/app/components/products/SearchBar";
import { createClient } from "@/app/lib/supabase/client";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    return result;
  }, [products, activeCategory, searchQuery]);

  return (
    <section className="py-8 md:py-12">
      <Container>
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-light mb-4">
            Our <span className="font-semibold">Products</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Explore our collection of jewelry, lipgloss, gadgets, and fashion. Find the perfect piece to complement your style.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <div className="w-full md:w-72">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-sm text-neutral-500 dark:text-neutral-400 mb-6"
        >
          {loading
            ? "Loading products..."
            : `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"}${activeCategory !== "all" ? ` in ${activeCategory}` : ""}${searchQuery ? ` matching "${searchQuery}"` : ""}`}
        </motion.p>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-neutral-300 border-t-black dark:border-neutral-600 dark:border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <ProductGrid products={filteredProducts} columns={4} />
        )}
      </Container>
    </section>
  );
}
