"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Star,
  Share2,
  X,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { formatPrice, cn } from "@/app/lib/utils";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";

export default function ProductQuickView({ product, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addItem: addToCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);
  const productUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/product/${product.id}`
      : "";

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onClose();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Check out this product: ${product.name} - ${formatPrice(product.price)}\n${productUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    setShowShareMenu(false);
  };

  const handleTwitterShare = () => {
    const text = `Check out ${product.name} from Ralyn's Limited!`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(productUrl)}`,
      "_blank"
    );
    setShowShareMenu(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          >
            <div
              className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:bg-white dark:hover:bg-black rounded-full transition-all z-20 shadow-lg"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Desktop Layout */}
              <div className="hidden md:grid md:grid-cols-2 h-full max-h-[85vh]">
                {/* Left - Large Product Image */}
                <div className="relative bg-neutral-100 dark:bg-neutral-800">
                  <div className="relative h-full min-h-[500px]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="50vw"
                      priority
                    />
                  </div>
                  {/* Badges */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {(product.is_new || product.isNew) && <Badge variant="new">New Arrival</Badge>}
                    {(product.is_sale || product.isSale) && (
                      <Badge variant="sale">
                        {(product.original_price || product.originalPrice) &&
                          `${Math.round((((product.original_price || product.originalPrice) - product.price) / (product.original_price || product.originalPrice)) * 100)}% OFF`}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Right - Product Details */}
                <div className="flex flex-col p-8 lg:p-12 overflow-y-auto">
                  {/* Category & Share */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-medium">
                      {product.category}
                    </p>
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                        aria-label="Share product"
                      >
                        <Share2 className="w-5 h-5" />
                      </motion.button>

                      {/* Share Menu */}
                      <AnimatePresence>
                        {showShareMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 top-12 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-2 min-w-[180px] z-30"
                          >
                            <button
                              onClick={handleCopyLink}
                              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                            >
                              {copied ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                              <span className="text-sm font-medium">
                                {copied ? "Copied!" : "Copy Link"}
                              </span>
                            </button>
                            <button
                              onClick={handleWhatsAppShare}
                              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                            >
                              <MessageCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium">
                                WhatsApp
                              </span>
                            </button>
                            <button
                              onClick={handleTwitterShare}
                              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                            >
                              <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                              </svg>
                              <span className="text-sm font-medium">
                                Twitter/X
                              </span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Product Name */}
                  <h2 className="text-3xl lg:text-4xl font-bold mt-3 leading-tight">
                    {product.name}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center gap-3 mt-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-5 h-5",
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-neutral-300 dark:text-neutral-600"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      {product.rating || 0} ({product.reviews_count || product.reviews || 0} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-4 mt-6">
                    <span className="text-4xl font-bold">
                      {formatPrice(product.price)}
                    </span>
                    {(product.original_price || product.originalPrice) && (
                      <span className="text-xl text-neutral-400 line-through">
                        {formatPrice(product.original_price || product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-neutral-600 dark:text-neutral-400 mt-6 leading-relaxed text-lg">
                    {product.description}
                  </p>

                  {/* Divider */}
                  <div className="border-t border-neutral-200 dark:border-neutral-800 my-8" />

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-semibold uppercase tracking-wider">
                      Quantity
                    </span>
                    <div className="flex items-center gap-4 bg-neutral-100 dark:bg-neutral-800 rounded-full px-4 py-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="w-12 text-center text-lg font-semibold">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 mt-8">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1"
                      size="lg"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart - {formatPrice(product.price * quantity)}
                    </Button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleItem(product)}
                      className={cn(
                        "p-4 rounded-full transition-all",
                        isWishlisted
                          ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                          : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      )}
                      aria-label={
                        isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      <Heart
                        className={cn("w-6 h-6", isWishlisted && "fill-current")}
                      />
                    </motion.button>
                  </div>

                  {/* Stock Status & Info */}
                  <div className="flex items-center gap-6 mt-8 text-sm">
                    {(product.in_stock !== undefined ? product.in_stock : product.inStock) ? (
                      <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        In Stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-red-500">
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                        Out of Stock
                      </span>
                    )}
                    <span className="text-neutral-400">|</span>
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Free delivery on orders over {formatPrice(50000)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden overflow-y-auto max-h-[85vh]">
                {/* Product Image */}
                <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {(product.is_new || product.isNew) && <Badge variant="new">New</Badge>}
                    {(product.is_sale || product.isSale) && <Badge variant="sale">Sale</Badge>}
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      {product.category}
                    </p>
                    <div className="relative">
                      <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                        aria-label="Share product"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      {/* Mobile Share Menu */}
                      <AnimatePresence>
                        {showShareMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 top-12 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-2 min-w-[160px] z-30"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={handleCopyLink}
                              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                            >
                              {copied ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                              <span className="text-sm">
                                {copied ? "Copied!" : "Copy Link"}
                              </span>
                            </button>
                            <button
                              onClick={handleWhatsAppShare}
                              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                            >
                              <MessageCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm">WhatsApp</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <h2 className="text-2xl font-semibold mt-2">{product.name}</h2>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-neutral-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-neutral-500">
                      ({product.reviews_count || product.reviews || 0})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-2xl font-bold">
                      {formatPrice(product.price)}
                    </span>
                    {(product.original_price || product.originalPrice) && (
                      <span className="text-lg text-neutral-400 line-through">
                        {formatPrice(product.original_price || product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-neutral-600 dark:text-neutral-400 mt-4 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-4 mt-6">
                    <span className="text-sm font-medium">Quantity:</span>
                    <div className="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-800 rounded-full px-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1"
                      size="lg"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart
                    </Button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleItem(product)}
                      className={cn(
                        "p-4 rounded-full transition-colors",
                        isWishlisted
                          ? "bg-red-500 text-white"
                          : "bg-neutral-100 dark:bg-neutral-800"
                      )}
                    >
                      <Heart
                        className={cn("w-5 h-5", isWishlisted && "fill-current")}
                      />
                    </motion.button>
                  </div>

                  {/* Stock Status */}
                  <p className="text-sm mt-4">
                    {(product.in_stock !== undefined ? product.in_stock : product.inStock) ? (
                      <span className="text-green-600">In Stock</span>
                    ) : (
                      <span className="text-red-500">Out of Stock</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
