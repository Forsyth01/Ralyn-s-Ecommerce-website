import { cn } from "@/app/lib/utils";

const variants = {
  default: "bg-black text-white dark:bg-white dark:text-black",
  secondary: "bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white",
  success: "bg-green-500 text-white",
  sale: "bg-red-500 text-white",
  new: "bg-blue-500 text-white",
};

export default function Badge({ children, variant = "default", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
