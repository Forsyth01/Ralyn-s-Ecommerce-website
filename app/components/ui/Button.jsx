"use client";

import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

const variants = {
  primary: "bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200",
  secondary: "bg-neutral-100 text-black hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700",
  outline: "border border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black",
  ghost: "text-black hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-8 py-3 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  onClick,
  type = "button",
  fullWidth = false,
  ...props
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:focus:ring-white",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
