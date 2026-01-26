"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  X,
  Mail,
  Phone,
  ShoppingBag,
  Calendar,
  TrendingUp,
  User,
} from "lucide-react";
import { formatPrice, cn } from "@/app/lib/utils";
import { mockCustomers, mockOrders } from "../data/mockData";
import DataTable from "../components/DataTable";
import StatCard from "../components/StatCard";

function CustomerDetailsModal({ customer, onClose }) {
  if (!customer) return null;

  const customerOrders = mockOrders.filter(
    (order) => order.customer === customer.name
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Customer Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {customer.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold">{customer.name}</h3>
              <span
                className={cn(
                  "inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1",
                  customer.status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                )}
              >
                {customer.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-neutral-500" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Email</p>
                <p className="font-medium text-sm">{customer.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-neutral-500" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Phone</p>
                <p className="font-medium text-sm">{customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <p className="text-2xl font-bold">{customer.orders}</p>
              <p className="text-xs text-neutral-500 mt-1">Total Orders</p>
            </div>
            <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <p className="text-2xl font-bold">{formatPrice(customer.totalSpent)}</p>
              <p className="text-xs text-neutral-500 mt-1">Total Spent</p>
            </div>
            <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
              <p className="text-2xl font-bold">
                {formatPrice(Math.round(customer.totalSpent / customer.orders))}
              </p>
              <p className="text-xs text-neutral-500 mt-1">Avg. Order</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <h4 className="font-semibold mb-3">Recent Orders</h4>
            {customerOrders.length > 0 ? (
              <div className="space-y-2">
                {customerOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-neutral-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{order.id}</p>
                        <p className="text-xs text-neutral-500">
                          {new Date(order.date).toLocaleDateString("en-NG")}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 text-center py-4">
                No orders found
              </p>
            )}
          </div>

          {/* Last Order */}
          <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
            <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-neutral-500" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Last Order</p>
              <p className="font-medium text-sm">
                {new Date(customer.lastOrder).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CustomersPage() {
  const [customers] = useState(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const columns = [
    {
      key: "name",
      label: "Customer",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {value.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-sm">{value}</p>
            <p className="text-xs text-neutral-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (value) => <span className="text-sm">{value}</span>,
    },
    {
      key: "orders",
      label: "Orders",
      sortable: true,
      render: (value) => (
        <span className="font-medium">{value}</span>
      ),
    },
    {
      key: "totalSpent",
      label: "Total Spent",
      sortable: true,
      render: (value) => (
        <span className="font-medium">{formatPrice(value)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={cn(
            "inline-block px-2 py-1 rounded-full text-xs font-medium",
            value === "active"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
          )}
        >
          {value === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const avgOrderValue = Math.round(
    totalRevenue / customers.reduce((acc, c) => acc + c.orders, 0)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Customers</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          View and manage your customer base
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          icon={User}
          iconBg="bg-blue-500"
          delay={0}
        />
        <StatCard
          title="Active Customers"
          value={activeCustomers}
          change={`${Math.round((activeCustomers / totalCustomers) * 100)}% of total`}
          changeType="neutral"
          icon={TrendingUp}
          iconBg="bg-green-500"
          delay={0.1}
        />
        <StatCard
          title="Total Revenue"
          value={formatPrice(totalRevenue)}
          icon={ShoppingBag}
          iconBg="bg-purple-500"
          delay={0.2}
        />
        <StatCard
          title="Avg. Order Value"
          value={formatPrice(avgOrderValue)}
          icon={Calendar}
          iconBg="bg-orange-500"
          delay={0.3}
        />
      </div>

      {/* Customers Table */}
      <DataTable
        columns={columns}
        data={customers}
        searchPlaceholder="Search customers..."
        actions={(row) => (
          <button
            onClick={() => setSelectedCustomer(row)}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      />

      {/* Customer Details Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <CustomerDetailsModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
