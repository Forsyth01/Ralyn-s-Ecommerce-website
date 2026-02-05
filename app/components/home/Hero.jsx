"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "@/app/components/layout/Container";
import Button from "@/app/components/ui/Button";

const heroSlides = [
  {
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop",
    alt: "Fashion collection",
    subtitle: "New Arrivals",
    title: "Elevate Your",
    highlight: "Wardrobe",
    description: "Discover trendy fashion pieces curated just for you.",
  },
  {
    src: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=1080&fit=crop",
    alt: "Clothing store",
    subtitle: "Premium Quality",
    title: "Style Meets",
    highlight: "Comfort",
    description: "Authentic products sourced from trusted brands worldwide.",
  },
  {
    src: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&h=1080&fit=crop",
    alt: "Beauty and cosmetics",
    subtitle: "Glow Up",
    title: "Beauty That",
    highlight: "Shines",
    description: "Premium lipgloss and skincare for your daily glam.",
  },
  {
    src: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&h=1080&fit=crop",
    alt: "Jewelry collection",
    subtitle: "Timeless Elegance",
    title: "Jewelry That",
    highlight: "Speaks",
    description: "Elegant accessories to complete every outfit.",
  },
  {
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop",
    alt: "Shopping lifestyle",
    subtitle: "Shop With Confidence",
    title: "Your Style",
    highlight: "Destination",
    description: "Fast delivery across Nigeria. Quality guaranteed.",
  },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = heroSlides[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[65vh] flex items-center overflow-hidden">
      {/* Slideshow Background */}
      {heroSlides.map((slide, index) => (
        <motion.div
          key={index}
          initial={false}
          animate={{
            opacity: index === currentIndex ? 1 : 0,
            scale: index === currentIndex ? 1 : 1.1,
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
        </motion.div>
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Bottom Fade Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />

      <Container className="relative z-10">
        <div className="max-w-3xl">
          <motion.p
            key={`subtitle-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm md:text-base font-medium text-white/80 uppercase tracking-widest mb-4"
          >
            {currentSlide.subtitle}
          </motion.p>

          <motion.h1
            key={`title-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-5xl lg:text-7xl font-light tracking-tight leading-[1.1] mb-6 text-white"
          >
            {currentSlide.title}
            <br />
            <span className="font-black">{currentSlide.highlight}</span>
          </motion.h1>

          <motion.p
            key={`desc-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 max-w-xl mb-8 leading-relaxed"
          >
            {currentSlide.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/shop">
              <Button size="lg" className="group cursor-pointer bg-white hover:bg-white/90">
              <p className="text-black  dark:text-black text-center">
                Shop Now
                </p>
                <ArrowRight className="w-5 h-5 text-black transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            {/* <Link href="/about">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </Link> */}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
