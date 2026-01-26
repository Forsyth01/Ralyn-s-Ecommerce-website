"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "@/app/components/layout/Container";
import Button from "@/app/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-72 h-72 bg-neutral-200 dark:bg-neutral-800 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-neutral-100 dark:bg-neutral-900 rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm md:text-base font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-4"
          >
            Welcome to Raylns
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight leading-[1.1] mb-6"
          >
            Discover Your
            <br />
            <span className="font-semibold">Unique Style</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-xl mb-8 leading-relaxed"
          >
            Explore our curated collection of jewelry, beauty, and tech accessories.
            Quality meets style in every piece we offer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/shop">
              <Button size="lg" className="group">
                Shop Now
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
