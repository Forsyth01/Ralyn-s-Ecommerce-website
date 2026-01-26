"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";
import { useWishlist } from "@/app/context/WishlistContext";
import Button from "@/app/components/ui/Button";
import WishlistItem from "./WishlistItem";

export default function WishlistDrawer() {
  const { items, isOpen, closeWishlist, itemCount } = useWishlist();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWishlist}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-black z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Wishlist ({itemCount})</h2>
              </div>
              <button
                onClick={closeWishlist}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                aria-label="Close wishlist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Heart className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mb-4" />
                  <p className="text-lg font-medium mb-2">Your wishlist is empty</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                    Save items you love to your wishlist
                  </p>
                  <Button onClick={closeWishlist}>Start Shopping</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <WishlistItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
