"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, AlertTriangle } from "lucide-react";
import { useWishlist } from "@/app/context/WishlistContext";
import Button from "@/app/components/ui/Button";
import WishlistItem from "./WishlistItem";

export default function WishlistDrawer() {
  const { items, isOpen, closeWishlist, itemCount, clearWishlist } = useWishlist();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearWishlist = () => {
    clearWishlist();
    setShowConfirm(false);
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

            {/* Footer - Clear Wishlist */}
            {items.length > 0 && (
              <div className="border-t border-neutral-200 dark:border-neutral-800 p-4">
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
                >
                  Clear Wishlist
                </button>
              </div>
            )}

            {/* Clear Wishlist Confirmation Modal */}
            <AnimatePresence>
              {showConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center p-6"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-neutral-900 rounded-2xl p-6 w-full max-w-sm shadow-xl"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Clear Wishlist?</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                        Are you sure you want to remove all {itemCount} item{itemCount !== 1 ? "s" : ""} from your wishlist? This action cannot be undone.
                      </p>
                      <div className="flex gap-3 w-full">
                        <button
                          onClick={() => setShowConfirm(false)}
                          className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleClearWishlist}
                          className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
