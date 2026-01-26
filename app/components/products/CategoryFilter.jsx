"use client";

import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { CATEGORIES } from "@/app/lib/constants";

export default function CategoryFilter({ activeCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCategoryChange(category.slug)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-full transition-colors",
            activeCategory === category.slug
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          )}
        >
          {category.name}
        </motion.button>
      ))}
    </div>
  );
}
