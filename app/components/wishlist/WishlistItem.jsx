"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { formatPrice } from "@/app/lib/utils";

export default function WishlistItem({ item }) {
  const { addItem: addToCart } = useCart();
  const { removeItem } = useWishlist();

  const handleAddToCart = () => {
    addToCart(item);
  };

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
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm truncate">{item.name}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 capitalize">
          {item.category}
        </p>
        <p className="text-sm font-semibold mt-1">{formatPrice(item.price)}</p>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="flex items-center gap-1 mt-2 text-sm font-medium hover:underline"
        >
          <ShoppingBag className="w-4 h-4" />
          Add to Cart
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeItem(item.id)}
        className="self-start p-2 text-neutral-400 hover:text-red-500 transition-colors"
        aria-label="Remove from wishlist"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
