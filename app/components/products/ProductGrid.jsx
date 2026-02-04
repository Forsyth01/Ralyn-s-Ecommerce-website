"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, columns = 4 }) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium mb-2">No products found</p>
        <p className="text-neutral-500 dark:text-neutral-400">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`grid ${gridCols[columns] || gridCols[4]} gap-6 md:gap-8`}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </motion.div>
  );
}
