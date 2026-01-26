"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Container from "@/app/components/layout/Container";
import ProductGrid from "@/app/components/products/ProductGrid";
import CategoryFilter from "@/app/components/products/CategoryFilter";
import SearchBar from "@/app/components/products/SearchBar";
import { products, getProductsByCategory, searchProducts } from "@/app/data/products";

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    let result = getProductsByCategory(activeCategory);

    if (searchQuery) {
      const searchResults = searchProducts(searchQuery);
      result = result.filter((product) =>
        searchResults.some((sr) => sr.id === product.id)
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

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
            Explore our collection of jewelry, lipgloss, and gadgets. Find the perfect piece to complement your style.
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
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
          {activeCategory !== "all" && ` in ${activeCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </motion.p>

        {/* Products Grid */}
        <ProductGrid products={filteredProducts} columns={4} />
      </Container>
    </section>
  );
}
