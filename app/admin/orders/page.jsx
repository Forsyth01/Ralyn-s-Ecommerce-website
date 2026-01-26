"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  X,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { toast } from "react-toastify";
import { formatPrice, cn } from "@/app/lib/utils";
import { mockOrders } from "../data/mockData";
import DataTable from "../components/DataTable";
import Button from "@/app/components/ui/Button";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: XCircle,
  },
};

const statusFlow = ["pending", "processing", "shipped", "delivered"];

function OrderDetailsModal({ order, onClose, onUpdateStatus }) {
  if (!order) return null;

  const currentStatusIndex = statusFlow.indexOf(order.status);
  const StatusIcon = statusConfig[order.status].icon;

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
          <div>
            <h2 className="text-xl font-bold">Order {order.id}</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Placed on {new Date(order.date).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", statusConfig[order.status].color)}>
                  <StatusIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Order Status</p>
                  <p className="text-sm text-neutral-500">
                    {statusConfig[order.status].label}
                  </p>
                </div>
              </div>
              {order.status !== "delivered" && order.status !== "cancelled" && (
                <div className="flex gap-2">
                  {currentStatusIndex < statusFlow.length - 1 && (
                    <Button
                      size="sm"
                      onClick={() =>
                        onUpdateStatus(order.id, statusFlow[currentStatusIndex + 1])
                      }
                    >
                      Mark as {statusConfig[statusFlow[currentStatusIndex + 1]].label}
                    </Button>
                  )}
                  <button
                    onClick={() => onUpdateStatus(order.id, "cancelled")}
                    className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Progress */}
            {order.status !== "cancelled" && (
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex justify-between">
                  {statusFlow.map((status, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const Icon = statusConfig[status].icon;
                    return (
                      <div key={status} className="flex flex-col items-center">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                            isCompleted
                              ? "bg-black dark:bg-white text-white dark:text-black"
                              : "bg-neutral-200 dark:bg-neutral-700 text-neutral-400"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <p className="text-xs mt-2 text-neutral-500">
                          {statusConfig[status].label}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="relative mt-2">
                  <div className="absolute top-1/2 left-4 right-4 h-1 bg-neutral-200 dark:bg-neutral-700 -translate-y-1/2 rounded" />
                  <div
                    className="absolute top-1/2 left-4 h-1 bg-black dark:bg-white -translate-y-1/2 rounded transition-all"
                    style={{
                      width: `${(currentStatusIndex / (statusFlow.length - 1)) * 100}%`,
                      maxWidth: "calc(100% - 32px)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                  <span className="font-medium">{order.customer.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{order.customer}</p>
                  <p className="text-xs text-neutral-500">Customer</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-neutral-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">{order.email}</p>
                  <p className="text-xs text-neutral-500">Email</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-neutral-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">{order.phone}</p>
                  <p className="text-xs text-neutral-500">Phone</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-neutral-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">{order.address}</p>
                  <p className="text-xs text-neutral-500">Shipping Address</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Items ({order.items})</span>
                <span>{formatPrice(order.total - 2500)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Shipping</span>
                <span>{formatPrice(2500)}</span>
              </div>
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setSelectedOrder((prev) =>
      prev && prev.id === orderId ? { ...prev, status: newStatus } : prev
    );
    toast.success(`Order status updated to ${statusConfig[newStatus].label}`);
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const columns = [
    {
      key: "id",
      label: "Order ID",
      render: (value) => <span className="font-mono text-sm">{value}</span>,
    },
    {
      key: "customer",
      label: "Customer",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">{value.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-sm">{value}</p>
            <p className="text-xs text-neutral-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (value) =>
        new Date(value).toLocaleDateString("en-NG", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "total",
      label: "Amount",
      sortable: true,
      render: (value) => <span className="font-medium">{formatPrice(value)}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        const config = statusConfig[value];
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              config.color
            )}
          >
            <config.icon className="w-3 h-3" />
            {config.label}
          </span>
        );
      },
    },
  ];

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Orders</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          Manage and track customer orders
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
                filterStatus === status
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}{" "}
              <span className="opacity-60">({statusCounts[status]})</span>
            </button>
          )
        )}
      </div>

      {/* Orders Table */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        searchPlaceholder="Search orders..."
        actions={(row) => (
          <button
            onClick={() => setSelectedOrder(row)}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      />

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
