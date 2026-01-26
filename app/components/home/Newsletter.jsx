"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { toast } from "react-toastify";
import Container from "@/app/components/layout/Container";
import Button from "@/app/components/ui/Button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Thanks for subscribing!");
    setEmail("");
    setIsLoading(false);
  };

  return (
    <section className="py-16 md:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-2">
            Newsletter
          </p>
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            Stay <span className="font-semibold">Updated</span>
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Subscribe to our newsletter to receive updates on new arrivals, special offers, and style tips.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
            <Button type="submit" disabled={isLoading} size="lg">
              {isLoading ? (
                "Subscribing..."
              ) : (
                <>
                  Subscribe
                  <Send className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
