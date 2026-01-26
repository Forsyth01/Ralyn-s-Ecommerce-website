"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Star,
  Share2,
  ArrowLeft,
  Copy,
  Check,
  MessageCircle,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { formatPrice, cn } from "@/app/lib/utils";
import { getProductById, products } from "@/app/data/products";
import Container from "@/app/components/layout/Container";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import ProductCard from "@/app/components/products/ProductCard";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addItem: addToCart } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const productId = parseInt(params.id);
  const product = getProductById(productId);

  // Get related products from same category
  const relatedProducts = product
    ? products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4)
    : [];

  const isWishlisted = product ? isInWishlist(product.id) : false;
  const productUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
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
    if (!product) return;
    const text = `Check out this product: ${product.name} - ${formatPrice(product.price)}\n${productUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    setShowShareMenu(false);
  };

  const handleTwitterShare = () => {
    if (!product) return;
    const text = `Check out ${product.name} from Raylns!`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(productUrl)}`,
      "_blank"
    );
    setShowShareMenu(false);
  };

  // Product not found
  if (!product) {
    return (
      <main className="min-h-screen bg-white dark:bg-black pt-24 pb-16">
        <Container>
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              The product you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Button onClick={() => router.push("/shop")}>Browse Products</Button>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-24 pb-16">
      <Container>
        {/* Back Link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-3xl overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.isNew && <Badge variant="new">New Arrival</Badge>}
                {product.isSale && (
                  <Badge variant="sale">
                    {product.originalPrice &&
                      `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`}
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
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
                        <span className="text-sm font-medium">WhatsApp</span>
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
                        <span className="text-sm font-medium">Twitter/X</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold mt-3 leading-tight">
              {product.name}
            </h1>

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
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mt-6">
              <span className="text-4xl font-bold">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
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
              <Button onClick={handleAddToCart} className="flex-1" size="lg">
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
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart
                  className={cn("w-6 h-6", isWishlisted && "fill-current")}
                />
              </motion.button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-6 mt-6 text-sm">
              {product.inStock ? (
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
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Free Delivery
                  <br />
                  Over {formatPrice(50000)}
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Secure
                  <br />
                  Payment
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Easy
                  <br />
                  Returns
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}
