"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPrice, cn } from "@/app/lib/utils";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function RecentOrders({ orders }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
    >
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <h3 className="font-semibold">Recent Orders</h3>
        <Link
          href="/admin/orders"
          className="text-sm text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {order.customer.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{order.customer}</p>
                  <p className="text-xs text-neutral-500">#{order.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">{formatPrice(order.total)}</p>
                <span
                  className={cn(
                    "inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1",
                    statusColors[order.status]
                  )}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
