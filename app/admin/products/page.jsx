"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Upload,
  ImageIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { createClient } from "@/app/lib/supabase/client";
import { uploadProductImage } from "@/app/lib/supabase/storage";
import { formatPrice, cn } from "@/app/lib/utils";
import { CLOTHING_SIZES, FASHION_SUBCATEGORIES } from "@/app/lib/constants";
import DataTable from "../components/DataTable";
import Button from "@/app/components/ui/Button";

const categories = ["jewelry", "lipgloss", "gadgets", "fashion"];

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ProductModal({ product, onClose, onSave }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(product?.image || null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState(
    product
      ? {
          name: product.name,
          description: product.description || "",
          price: product.price,
          original_price: product.original_price || "",
          category: product.category,
          subcategory: product.subcategory || "",
          image: product.image,
          in_stock: product.in_stock ?? true,
          is_new: product.is_new ?? false,
          is_sale: product.is_sale ?? false,
          is_featured: product.is_featured ?? false,
          sizes: product.sizes || [],
        }
      : {
          name: "",
          description: "",
          price: "",
          original_price: "",
          category: "jewelry",
          subcategory: "",
          image: "",
          in_stock: true,
          is_new: false,
          is_sale: false,
          is_featured: false,
          sizes: [],
        }
  );

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Please fill in required fields");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = formData.image;

      // Upload new image if selected
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadProductImage(imageFile);
        setUploading(false);
      }

      if (!imageUrl) {
        toast.error("Please add a product image");
        setSaving(false);
        return;
      }

      onSave({
        ...formData,
        image: imageUrl,
        price: Number(formData.price),
        original_price: formData.original_price ? Number(formData.original_price) : null,
        slug: generateSlug(formData.name),
        sizes: formData.sizes.length > 0 ? formData.sizes : null,
        subcategory: formData.category === "fashion" ? formData.subcategory : null,
      });
    } catch (err) {
      toast.error("Failed to upload image. Please try again.");
      setSaving(false);
    }
  };

  const showSizeSelector = formData.category === "fashion" && ["Clothes", "Shoes"].includes(formData.subcategory);
  const sizeOptions = formData.subcategory === "Shoes"
    ? ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]
    : CLOTHING_SIZES;

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
              Product Image *
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors group"
            >
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="Product preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-center">
                      <Upload className="w-6 h-6 mx-auto" />
                      <p className="text-sm mt-1">Change Image</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <ImageIcon className="w-10 h-10 mx-auto text-neutral-400" />
                  <p className="text-sm text-neutral-500 mt-2">
                    Click to upload image
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    PNG, JPG, WebP up to 5MB
                  </p>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm font-medium">Uploading...</span>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
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
                value={formData.original_price || ""}
                onChange={(e) =>
                  setFormData({ ...formData, original_price: e.target.value })
                }
                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                placeholder="0"
              />
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value, subcategory: "" })
                }
                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            {formData.category === "fashion" && (
              <div>
                <label className="block text-sm font-medium mb-2">Subcategory</label>
                <select
                  value={formData.subcategory}
                  onChange={(e) =>
                    setFormData({ ...formData, subcategory: e.target.value, sizes: [] })
                  }
                  className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                  <option value="">Select subcategory</option>
                  {FASHION_SUBCATEGORIES.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Size Selector for Clothes/Shoes */}
          {showSizeSelector && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={cn(
                      "min-w-12 h-10 px-3 rounded-lg text-sm font-medium transition-all border",
                      formData.sizes.includes(size)
                        ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                        : "bg-transparent border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Toggles */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.in_stock}
                onChange={(e) =>
                  setFormData({ ...formData, in_stock: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
              <span className="text-sm">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_new}
                onChange={(e) =>
                  setFormData({ ...formData, is_new: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
              <span className="text-sm">New Arrival</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_sale}
                onChange={(e) =>
                  setFormData({ ...formData, is_sale: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
              <span className="text-sm">On Sale</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) =>
                  setFormData({ ...formData, is_featured: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
              <span className="text-sm">Featured</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? "Saving..." : product ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const supabase = createClient();

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleSaveProduct = async (productData) => {
    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) {
        toast.error("Failed to update product");
        console.error("Update error:", error);
        return;
      }
      toast.success("Product updated successfully");
    } else {
      const { error } = await supabase
        .from("products")
        .insert(productData);

      if (error) {
        toast.error("Failed to add product");
        console.error("Insert error:", error);
        return;
      }
      toast.success("Product added successfully");
    }
    setShowModal(false);
    fetchProducts();
  };

  const handleDeleteProduct = async (id) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete product");
      console.error("Delete error:", error);
    } else {
      toast.success("Product deleted successfully");
      fetchProducts();
    }
    setDeleteConfirm(null);
  };

  const columns = [
    {
      key: "image",
      label: "Product",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
            {row.image ? (
              <Image
                src={row.image}
                alt={row.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-neutral-400" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-sm">{row.name}</p>
            <p className="text-xs text-neutral-500 capitalize">
              {row.category}
              {row.subcategory && ` / ${row.subcategory}`}
            </p>
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
          {row.original_price && (
            <p className="text-xs text-neutral-500 line-through">
              {formatPrice(row.original_price)}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (value) => (
        <span className="capitalize">{value}</span>
      ),
    },
    {
      key: "in_stock",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-neutral-500">Loading products...</span>
        </div>
      </div>
    );
  }

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
            {products.filter((p) => p.in_stock).length}
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
            {products.filter((p) => !p.in_stock).length}
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
            {products.filter((p) => p.is_sale).length}
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
