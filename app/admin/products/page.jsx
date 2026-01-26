"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Upload,
  Package,
} from "lucide-react";
import { toast } from "react-toastify";
import { products as initialProducts } from "@/app/data/products";
import { formatPrice, cn } from "@/app/lib/utils";
import DataTable from "../components/DataTable";
import Button from "@/app/components/ui/Button";

const categories = ["Jewelry", "Lipgloss", "Gadgets"];

function ProductModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState(
    product || {
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "Jewelry",
      image: "/images/placeholder.jpg",
      inStock: true,
      isNew: false,
      isSale: false,
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Please fill in required fields");
      return;
    }
    onSave({
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
    });
  };

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
          <h2 className="text-xl font-bold">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Image
            </label>
            <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden flex items-center justify-center">
              {formData.image && formData.image !== "/images/placeholder.jpg" ? (
                <Image
                  src={formData.image}
                  alt="Product"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto text-neutral-400" />
                  <p className="text-sm text-neutral-500 mt-2">
                    Click to upload image
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
              placeholder="Enter product description"
            />
          </div>

          {/* Price Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Original Price
              </label>
              <input
                type="number"
                value={formData.originalPrice || ""}
                onChange={(e) =>
                  setFormData({ ...formData, originalPrice: e.target.value })
                }
                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                placeholder="0"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) =>
                  setFormData({ ...formData, inStock: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
              <span className="text-sm">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) =>
                  setFormData({ ...formData, isNew: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
              <span className="text-sm">New Arrival</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isSale}
                onChange={(e) =>
                  setFormData({ ...formData, isSale: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
              <span className="text-sm">On Sale</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {product ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id ? { ...p, ...productData } : p
        )
      );
      toast.success("Product updated successfully");
    } else {
      const newProduct = {
        ...productData,
        id: Math.max(...products.map((p) => p.id)) + 1,
        rating: 4.5,
        reviews: 0,
      };
      setProducts((prev) => [newProduct, ...prev]);
      toast.success("Product added successfully");
    }
    setShowModal(false);
  };

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
    toast.success("Product deleted successfully");
  };

  const columns = [
    {
      key: "image",
      label: "Product",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
            <Image
              src={row.image}
              alt={row.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-sm">{row.name}</p>
            <p className="text-xs text-neutral-500">{row.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium">{formatPrice(value)}</p>
          {row.originalPrice && (
            <p className="text-xs text-neutral-500 line-through">
              {formatPrice(row.originalPrice)}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
    },
    {
      key: "inStock",
      label: "Status",
      render: (value) => (
        <span
          className={cn(
            "inline-block px-2 py-1 rounded-full text-xs font-medium",
            value
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          )}
        >
          {value ? "In Stock" : "Out of Stock"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Products</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Manage your product inventory
          </p>
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="w-5 h-5" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800"
        >
          <p className="text-sm text-neutral-500">Total Products</p>
          <p className="text-2xl font-bold mt-1">{products.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800"
        >
          <p className="text-sm text-neutral-500">In Stock</p>
          <p className="text-2xl font-bold mt-1">
            {products.filter((p) => p.inStock).length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800"
        >
          <p className="text-sm text-neutral-500">Out of Stock</p>
          <p className="text-2xl font-bold mt-1">
            {products.filter((p) => !p.inStock).length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-neutral-900 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800"
        >
          <p className="text-sm text-neutral-500">On Sale</p>
          <p className="text-2xl font-bold mt-1">
            {products.filter((p) => p.isSale).length}
          </p>
        </motion.div>
      </div>

      {/* Products Table */}
      <DataTable
        columns={columns}
        data={products}
        searchPlaceholder="Search products..."
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleEditProduct(row)}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteConfirm(row.id)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Product Modal */}
      <AnimatePresence>
        {showModal && (
          <ProductModal
            product={editingProduct}
            onClose={() => setShowModal(false)}
            onSave={handleSaveProduct}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-center mt-4">
                Delete Product?
              </h3>
              <p className="text-sm text-neutral-500 text-center mt-2">
                This action cannot be undone. The product will be permanently
                removed.
              </p>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <button
                  onClick={() => handleDeleteProduct(deleteConfirm)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
