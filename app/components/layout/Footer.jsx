"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import { SITE_NAME, SOCIAL_LINKS, CONTACT_INFO } from "@/app/lib/constants";
import Container from "./Container";

const footerLinks = {
  shop: [
    { name: "All Products", href: "/shop" },
    { name: "Jewelry", href: "/shop?category=jewelry" },
    { name: "Lipgloss", href: "/shop?category=lipgloss" },
    { name: "Gadgets", href: "/shop?category=gadgets" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block">
                <span className="text-2xl font-semibold tracking-tight">
                  {SITE_NAME}
                </span>
              </Link>
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Discover your style with our curated collection of jewelry, beauty, and tech accessories.
              </p>
              <div className="flex gap-4 mt-6">
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-neutral-200 dark:bg-neutral-800 rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-neutral-200 dark:bg-neutral-800 rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                  aria-label="TikTok"
                  title="@ralyns_limited"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.28a8.18 8.18 0 0 0 4.76 1.52V6.35a4.89 4.89 0 0 1-1-.15z" />
                  </svg>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href={SOCIAL_LINKS.tiktok2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-neutral-200 dark:bg-neutral-800 rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                  aria-label="TikTok Lip Care"
                  title="@ralyns_lipcare"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.28a8.18 8.18 0 0 0 4.76 1.52V6.35a4.89 4.89 0 0 1-1-.15z" />
                  </svg>
                </motion.a>
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Shop
              </h3>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Contact
              </h3>
              <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                <li>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    {CONTACT_INFO.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${CONTACT_INFO.phone}`}
                    className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    {CONTACT_INFO.phone}
                  </a>
                </li>
                {CONTACT_INFO.phone2 && (
                  <li>
                    <a
                      href={`tel:${CONTACT_INFO.phone2}`}
                      className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <Phone className="w-4 h-4 shrink-0" />
                      {CONTACT_INFO.phone2}
                    </a>
                  </li>
                )}
                <li className="flex items-center gap-2 leading-relaxed">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {CONTACT_INFO.address}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-center text-neutral-500 dark:text-neutral-400">
            &copy; {currentYear} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
