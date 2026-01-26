"use client";

import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

export default function StatCard({
  title,
  value,
  change,
  changeType = "increase",
  icon: Icon,
  iconBg = "bg-blue-500",
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            {title}
          </p>
          <h3 className="text-2xl lg:text-3xl font-bold mt-2">{value}</h3>
          {change && (
            <p
              className={cn(
                "text-sm font-medium mt-2 flex items-center gap-1",
                changeType === "increase"
                  ? "text-green-500"
                  : changeType === "decrease"
                  ? "text-red-500"
                  : "text-neutral-500"
              )}
            >
              <span>
                {changeType === "increase" ? "↑" : changeType === "decrease" ? "↓" : ""}
              </span>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              iconBg
            )}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
