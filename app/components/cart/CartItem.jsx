"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { formatPrice } from "@/app/lib/utils";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-4 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl"
    >
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm truncate">{product.name}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 capitalize">
          {product.category}
        </p>
        <p className="text-sm font-semibold mt-1">{formatPrice(product.price)}</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium w-8 text-center">{quantity}</span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeItem(product.id)}
        className="self-start p-2 text-neutral-400 hover:text-red-500 transition-colors"
        aria-label="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
