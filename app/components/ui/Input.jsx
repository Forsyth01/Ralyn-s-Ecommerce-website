"use client";

import { cn } from "@/app/lib/utils";

export default function Input({
  label,
  error,
  className,
  type = "text",
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "w-full px-4 py-3 text-base rounded-lg border border-neutral-200 dark:border-neutral-700",
          "bg-white dark:bg-neutral-800",
          "text-black dark:text-white",
          "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
          "focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent",
          "transition-all duration-200",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
