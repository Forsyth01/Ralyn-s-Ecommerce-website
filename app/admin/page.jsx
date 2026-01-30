"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  Truck,
  Eye,
} from "lucide-react";
import { formatPrice, cn } from "@/app/lib/utils";
import { createClient } from "@/app/lib/supabase/client";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function StatCard({ title, value, icon: Icon, iconBg, href, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Link
        href={href}
        className="block bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconBg)}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function QuickAction({ title, description, icon: Icon, href, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Link
        href={href}
        className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-all group"
      >
        <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white transition-colors">
          <Icon className="w-5 h-5 group-hover:text-white dark:group-hover:text-black transition-colors" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-neutral-500">{description}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
      </Link>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ordersCount: 0,
    customersCount: 0,
    productsCount: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      const supabase = createClient();

      const [productsRes, ordersRes, customersRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("customers").select("id", { count: "exact", head: true }),
      ]);

      const orders = ordersRes.data || [];
      const totalRevenue = orders.reduce((acc, o) => acc + Number(o.total || 0), 0);

      setStats({
        totalRevenue,
        ordersCount: orders.length,
        customersCount: customersRes.count || 0,
        productsCount: productsRes.count || 0,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
        processingOrders: orders.filter((o) => o.status === "processing").length,
        shippedOrders: orders.filter((o) => o.status === "shipped").length,
        deliveredOrders: orders.filter((o) => o.status === "delivered").length,
      });

      setRecentOrders(orders.slice(0, 6));
      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-neutral-300 border-t-black dark:border-neutral-600 dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          Here&apos;s an overview of your store
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={DollarSign}
          iconBg="bg-green-500"
          href="/admin/orders"
          delay={0}
        />
        <StatCard
          title="Orders"
          value={stats.ordersCount}
          icon={ShoppingCart}
          iconBg="bg-blue-500"
          href="/admin/orders"
          delay={0.05}
        />
        <StatCard
          title="Customers"
          value={stats.customersCount}
          icon={Users}
          iconBg="bg-purple-500"
          href="/admin/customers"
          delay={0.1}
        />
        <StatCard
          title="Products"
          value={stats.productsCount}
          icon={Package}
          iconBg="bg-orange-500"
          href="/admin/products"
          delay={0.15}
        />
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 space-y-3"
        >
          <h2 className="font-semibold text-lg">Quick Actions</h2>
          <div className="space-y-2">
            <QuickAction
              title="Add Product"
              description="Add a new product to your store"
              icon={Plus}
              href="/admin/products"
              delay={0.25}
            />
            <QuickAction
              title="View Orders"
              description={`${stats.pendingOrders} pending, ${stats.processingOrders} processing`}
              icon={ShoppingCart}
              href="/admin/orders"
              delay={0.3}
            />
            <QuickAction
              title="Manage Customers"
              description={`${stats.customersCount} total customers`}
              icon={Users}
              href="/admin/customers"
              delay={0.35}
            />
          </div>

          {/* Order Status Summary */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 mt-4">
            <h3 className="font-medium text-sm mb-3">Order Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span>Pending</span>
                </div>
                <span className="font-medium">{stats.pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-500" />
                  <span>Processing</span>
                </div>
                <span className="font-medium">{stats.processingOrders}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-purple-500" />
                  <span>Shipped</span>
                </div>
                <span className="font-medium">{stats.shippedOrders}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Delivered</span>
                </div>
                <span className="font-medium">{stats.deliveredOrders}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 dark:text-neutral-400">
                <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                        Order
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.03 }}
                        className="border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm">{order.order_number}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-xs font-medium">
                              {order.customer_name?.charAt(0) || "?"}
                            </div>
                            <span className="text-sm">{order.customer_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-sm">{formatPrice(order.total)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-block px-2 py-1 rounded-full text-xs font-medium capitalize",
                              statusColors[order.status] || statusColors.pending
                            )}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href="/admin/orders"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
