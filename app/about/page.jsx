"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/app/components/layout/Container";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black pt-24 pb-16">
      <Container>
        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-4">
            Our Story
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8">
            About <span className="font-semibold">Ralyn&apos;s</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
                alt="Ralyn's store"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-5 text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg">
              <p>
                Ralyn&apos;s was founded with a passion for quality, reliability,
                and style. We are committed to connecting our customers with
                carefully sourced products and dependable logistics solutions
                that make everyday life easier and more enjoyable.
              </p>
              <p>
                From fashion and beauty essentials to gadgets and electronics, we
                focus on delivering authentic products, seamless procurement, and
                timely delivery — both locally and internationally.
              </p>
              <p>
                At Ralyn&apos;s, customer satisfaction is at the heart of
                everything we do. We don&apos;t just sell products — we provide
                solutions you can trust.
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </main>
  );
}
