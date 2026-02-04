"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { formatPrice, cn } from "@/app/lib/utils";
import Badge from "@/app/components/ui/Badge";
import ProductQuickView from "./ProductQuickView";

export default function ProductCard({ product, index = 0 }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addItem: addToCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= (product.low_stock_threshold || 5);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group"
      >
        {/* Image Container */}
        <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-2xl overflow-hidden mb-4">
          {/* Clickable Image Link */}
          <Link href={`/product/${product.id}`} className="absolute inset-0 z-10">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20 pointer-events-none">
            {isOutOfStock ? (
              <Badge variant="sale">Out of Stock</Badge>
            ) : isLowStock ? (
              <Badge variant="new">Low Stock</Badge>
            ) : (
              <>
                {(product.is_new || product.isNew) && <Badge variant="new">New</Badge>}
                {(product.is_sale || product.isSale) && <Badge variant="sale">Sale</Badge>}
              </>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleItem(product)}
            className={cn(
              "absolute top-3 right-3 p-2 rounded-full transition-colors z-20",
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black"
            )}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn("w-5 h-5", isWishlisted && "fill-current")}
            />
          </motion.button>

          {/* Action Buttons - Always visible on mobile, hover on desktop */}
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 z-20">
            <div className="flex gap-1.5 sm:gap-2">
              <motion.button
                whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
                onClick={() => !isOutOfStock && addToCart(product)}
                disabled={isOutOfStock}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 rounded-full font-medium text-[10px] sm:text-sm transition-colors",
                  isOutOfStock
                    ? "bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                    : "bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200"
                )}
              >
                <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="sm:hidden">{isOutOfStock ? "Sold Out" : "Add"}</span>
                <span className="hidden sm:inline">{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsQuickViewOpen(true)}
                className="p-2 sm:p-3 bg-white dark:bg-black rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                aria-label="Quick view"
              >
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Product Info - Clickable */}
        <Link href={`/product/${product.id}`} className="block space-y-1">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            {product.category}
          </p>
          <h3 className="font-medium truncate hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{formatPrice(product.price)}</span>
            {(product.original_price || product.originalPrice) && (
              <span className="text-sm text-neutral-400 line-through">
                {formatPrice(product.original_price || product.originalPrice)}
              </span>
            )}
          </div>
        </Link>
      </motion.div>

      {/* Quick View Modal */}
      <ProductQuickView
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
