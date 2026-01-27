"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Store,
  CreditCard,
  Truck,
  Bell,
  Shield,
  Globe,
  Save,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { toast } from "react-toastify";
import { useTheme } from "@/app/context/ThemeContext";
import { cn } from "@/app/lib/utils";
import Button from "@/app/components/ui/Button";

const tabs = [
  { id: "general", label: "General", icon: Store },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "notifications", label: "Notifications", icon: Bell },
];

function SettingCard({ title, description, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6"
    >
      <div className="mb-4">
        <h3 className="font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-neutral-500 mt-1">{description}</p>
        )}
      </div>
      {children}
    </motion.div>
  );
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative w-12 h-6 rounded-full transition-colors",
        enabled ? "bg-black dark:bg-white" : "bg-neutral-200 dark:bg-neutral-700"
      )}
    >
      <span
        className={cn(
          "absolute top-1 w-4 h-4 rounded-full transition-transform",
          enabled
            ? "translate-x-7 bg-white dark:bg-black"
            : "translate-x-1 bg-white dark:bg-neutral-400"
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const { isDark, toggleTheme } = useTheme();

  const [settings, setSettings] = useState({
    storeName: "Ralyn's Limited",
    storeEmail: "hello@raylns.com",
    storePhone: "+234 801 234 5678",
    storeAddress: "123 Victoria Island, Lagos, Nigeria",
    currency: "NGN",
    enableBankTransfer: true,
    enableCardPayment: true,
    freeShippingThreshold: 50000,
    flatShippingRate: 2500,
    enableEmailNotifications: true,
    enableOrderUpdates: true,
    enableNewsletter: true,
    enableLowStockAlerts: true,
  });

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Settings</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Manage your store settings and preferences
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-5 h-5" />
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === "general" && (
          <>
            <SettingCard
              title="Store Information"
              description="Basic information about your store"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => updateSetting("storeName", e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.storeEmail}
                      onChange={(e) => updateSetting("storeEmail", e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={settings.storePhone}
                      onChange={(e) => updateSetting("storePhone", e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Address
                  </label>
                  <textarea
                    value={settings.storeAddress}
                    onChange={(e) => updateSetting("storeAddress", e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
                  />
                </div>
              </div>
            </SettingCard>

            <SettingCard
              title="Appearance"
              description="Customize how your admin panel looks"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Dark Mode</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Toggle dark mode for the admin panel
                  </p>
                </div>
                <Toggle enabled={isDark} onChange={toggleTheme} />
              </div>
            </SettingCard>

            <SettingCard
              title="Localization"
              description="Currency and regional settings"
            >
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => updateSetting("currency", e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                  <option value="NGN">Nigerian Naira (NGN)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="GBP">British Pound (GBP)</option>
                </select>
              </div>
            </SettingCard>
          </>
        )}

        {activeTab === "payment" && (
          <>
            <SettingCard
              title="Payment Methods"
              description="Configure accepted payment methods"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Card Payment</p>
                      <p className="text-xs text-neutral-500">
                        Accept debit/credit cards via Paystack
                      </p>
                    </div>
                  </div>
                  <Toggle
                    enabled={settings.enableCardPayment}
                    onChange={(v) => updateSetting("enableCardPayment", v)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Bank Transfer</p>
                      <p className="text-xs text-neutral-500">
                        Accept direct bank transfers
                      </p>
                    </div>
                  </div>
                  <Toggle
                    enabled={settings.enableBankTransfer}
                    onChange={(v) => updateSetting("enableBankTransfer", v)}
                  />
                </div>
              </div>
            </SettingCard>
          </>
        )}

        {activeTab === "shipping" && (
          <>
            <SettingCard
              title="Shipping Rates"
              description="Configure shipping costs and thresholds"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Flat Shipping Rate
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                      ₦
                    </span>
                    <input
                      type="number"
                      value={settings.flatShippingRate}
                      onChange={(e) =>
                        updateSetting("flatShippingRate", Number(e.target.value))
                      }
                      className="w-full pl-8 pr-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Free Shipping Threshold
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                      ₦
                    </span>
                    <input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) =>
                        updateSetting("freeShippingThreshold", Number(e.target.value))
                      }
                      className="w-full pl-8 pr-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    Orders above this amount will get free shipping
                  </p>
                </div>
              </div>
            </SettingCard>
          </>
        )}

        {activeTab === "notifications" && (
          <>
            <SettingCard
              title="Email Notifications"
              description="Manage your email notification preferences"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                  <div>
                    <p className="font-medium text-sm">Email Notifications</p>
                    <p className="text-xs text-neutral-500">
                      Receive email notifications for important events
                    </p>
                  </div>
                  <Toggle
                    enabled={settings.enableEmailNotifications}
                    onChange={(v) => updateSetting("enableEmailNotifications", v)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                  <div>
                    <p className="font-medium text-sm">Order Updates</p>
                    <p className="text-xs text-neutral-500">
                      Get notified when orders are placed or updated
                    </p>
                  </div>
                  <Toggle
                    enabled={settings.enableOrderUpdates}
                    onChange={(v) => updateSetting("enableOrderUpdates", v)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                  <div>
                    <p className="font-medium text-sm">Low Stock Alerts</p>
                    <p className="text-xs text-neutral-500">
                      Get notified when products are running low
                    </p>
                  </div>
                  <Toggle
                    enabled={settings.enableLowStockAlerts}
                    onChange={(v) => updateSetting("enableLowStockAlerts", v)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                  <div>
                    <p className="font-medium text-sm">Newsletter Signups</p>
                    <p className="text-xs text-neutral-500">
                      Get notified when users subscribe to newsletter
                    </p>
                  </div>
                  <Toggle
                    enabled={settings.enableNewsletter}
                    onChange={(v) => updateSetting("enableNewsletter", v)}
                  />
                </div>
              </div>
            </SettingCard>
          </>
        )}
      </div>
    </div>
  );
}
