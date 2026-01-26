"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/app/lib/utils";

export default function SearchBar({ onSearch, placeholder = "Search products..." }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative flex items-center gap-3 px-4 py-3 rounded-full border-2 transition-colors",
        isFocused
          ? "border-black dark:border-white"
          : "border-neutral-200 dark:border-neutral-700"
      )}
    >
      <Search className="w-5 h-5 text-neutral-400" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm placeholder:text-neutral-400"
      />
      {query && (
        <button
          onClick={handleClear}
          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}
