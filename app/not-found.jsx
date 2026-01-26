"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ShoppingBag, ArrowLeft } from "lucide-react";
import Container from "@/app/components/layout/Container";
import Button from "@/app/components/ui/Button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
      <Container>
        <div className="max-w-lg mx-auto text-center">
          {/* 404 Text */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-[150px] md:text-[200px] font-bold leading-none text-neutral-100 dark:text-neutral-800">
              404
            </h1>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="-mt-16 md:-mt-20 relative z-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Page Not Found
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Oops! The page you&apos;re looking for doesn&apos;t exist or has
              been moved. Let&apos;s get you back on track.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/">
              <Button size="lg">
                <Home className="w-5 h-5" />
                Back to Home
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" size="lg">
                <ShoppingBag className="w-5 h-5" />
                Browse Shop
              </Button>
            </Link>
          </motion.div>

          {/* Go Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8"
          >
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back to previous page
            </button>
          </motion.div>
        </div>
      </Container>
    </main>
  );
}
