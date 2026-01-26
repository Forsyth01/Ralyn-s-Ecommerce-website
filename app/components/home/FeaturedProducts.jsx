"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "@/app/components/layout/Container";
import ProductGrid from "@/app/components/products/ProductGrid";
import { getFeaturedProducts } from "@/app/data/products";

export default function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts().slice(0, 4);

  return (
    <section className="py-16 md:py-24">
      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
          <div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-2">
              Featured
            </p>
            <h2 className="text-3xl md:text-4xl font-light">
              Our Best <span className="font-semibold">Sellers</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            View All Products
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <ProductGrid products={featuredProducts} columns={4} />
      </Container>
    </section>
  );
}
