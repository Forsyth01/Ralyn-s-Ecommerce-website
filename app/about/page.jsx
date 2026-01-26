"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Star, Shield, Truck } from "lucide-react";
import Container from "@/app/components/layout/Container";

const values = [
  {
    icon: Heart,
    title: "Quality First",
    description: "We carefully curate every product to ensure it meets our high standards of quality and craftsmanship.",
  },
  {
    icon: Star,
    title: "Customer Focused",
    description: "Your satisfaction is our priority. We go above and beyond to provide exceptional service.",
  },
  {
    icon: Shield,
    title: "Authenticity Guaranteed",
    description: "Every item we sell is 100% authentic. We stand behind the quality of our products.",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "We process and ship orders quickly so you can enjoy your new items as soon as possible.",
  },
];

export default function AboutPage() {
  return (
    <section className="py-8 md:py-12">
      <Container>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-4">
            Our Story
          </p>
          <h1 className="text-4xl md:text-5xl font-light mb-6">
            About <span className="font-semibold">Raylns</span>
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Founded with a passion for style and quality, Raylns is your destination for curated jewelry, beauty products, and tech accessories that help you express your unique personality.
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
                alt="Our store"
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
            <h2 className="text-3xl font-light mb-4">
              Our <span className="font-semibold">Journey</span>
            </h2>
            <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              <p>
                Raylns started as a small passion project with a simple goal: to bring beautiful, quality products to people who appreciate the finer things in life.
              </p>
              <p>
                What began as a curated collection of jewelry pieces has grown into a comprehensive lifestyle brand, featuring everything from stunning accessories to innovative gadgets.
              </p>
              <p>
                We believe that everyone deserves access to quality products that make them feel confident and stylish. That&apos;s why we carefully select each item in our collection, ensuring it meets our standards for quality, design, and value.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Meet the Owner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-neutral-50 dark:bg-neutral-900 rounded-3xl p-8 md:p-12 mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-square max-w-sm mx-auto lg:mx-0 rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
                alt="Business owner"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-2">
                Meet the Founder
              </p>
              <h2 className="text-3xl font-semibold mb-4">Sarah Johnson</h2>
              <div className="space-y-4 text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <p>
                  &quot;I started Raylns because I wanted to create a place where people could find unique, quality products that truly reflect their personal style.&quot;
                </p>
                <p>
                  With over 10 years of experience in fashion and retail, Sarah has built Raylns from the ground up, hand-selecting each product and building relationships with artisans and suppliers around the world.
                </p>
                <p>
                  Her vision is simple: to help everyone discover products that make them feel confident, beautiful, and connected to their personal style.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-2">
              What We Stand For
            </p>
            <h2 className="text-3xl md:text-4xl font-light">
              Our <span className="font-semibold">Values</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center bg-black dark:bg-white text-white dark:text-black rounded-3xl p-8 md:p-12"
        >
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            Ready to <span className="font-semibold">Explore?</span>
          </h2>
          <p className="text-neutral-300 dark:text-neutral-700 mb-6 max-w-xl mx-auto">
            Discover our curated collection and find the perfect pieces to complement your style.
          </p>
          <a
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-3 bg-white dark:bg-black text-black dark:text-white rounded-full font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            Shop Now
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
