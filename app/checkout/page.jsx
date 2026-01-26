"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Truck, Shield, Check, Building2 } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "@/app/context/CartContext";
import { formatPrice } from "@/app/lib/utils";
import Container from "@/app/components/layout/Container";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";

const SHIPPING_COST = 2500;
const FREE_SHIPPING_THRESHOLD = 50000;

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, itemCount } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    country: "Nigeria",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";

    if (paymentMethod === "card") {
      if (!formData.cardNumber) newErrors.cardNumber = "Card number is required";
      if (!formData.cardName) newErrors.cardName = "Name on card is required";
      if (!formData.expiry) newErrors.expiry = "Expiry date is required";
      if (!formData.cvv) newErrors.cvv = "CVV is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setOrderComplete(true);
    clearCart();
    toast.success("Order placed successfully!");
  };

  // Order confirmation screen
  if (orderComplete) {
    return (
      <main className="min-h-screen bg-white dark:bg-black pt-24 pb-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Thank you for your order. We&apos;ll send you a confirmation email
              and WhatsApp message with tracking information once your order ships.
            </p>
            {paymentMethod === "transfer" && (
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 mb-8 text-left">
                <h3 className="font-semibold mb-2">Bank Transfer Details</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Bank: First Bank of Nigeria<br />
                  Account Name: Raylns Store<br />
                  Account Number: 0123456789<br />
                  Amount: {formatPrice(total)}
                </p>
                <p className="text-xs text-neutral-500 mt-2">
                  Please complete payment within 24 hours to confirm your order.
                </p>
              </div>
            )}
            <div className="space-y-3">
              <Button onClick={() => router.push("/shop")} fullWidth>
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                fullWidth
              >
                Back to Home
              </Button>
            </div>
          </motion.div>
        </Container>
      </main>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white dark:bg-black pt-24 pb-16">
        <Container>
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Add some items to your cart before checking out.
            </p>
            <Button onClick={() => router.push("/shop")}>
              Browse Products
            </Button>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-24 pb-16">
      <Container>
        {/* Back Link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <section className="bg-white dark:bg-black rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    placeholder="your@email.com"
                  />
                  <Input
                    label="Phone Number (WhatsApp)"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                    placeholder="+234 801 234 5678"
                  />
                </div>
              </section>

              {/* Delivery Address */}
              <section className="bg-white dark:bg-black rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Truck className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">Delivery Address</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      error={errors.firstName}
                      placeholder="Chidi"
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      error={errors.lastName}
                      placeholder="Okonkwo"
                    />
                  </div>
                  <Input
                    label="Street Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    error={errors.address}
                    placeholder="12 Admiralty Way, Lekki Phase 1"
                  />
                  <Input
                    label="Apartment, suite, etc. (optional)"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    placeholder="Flat 4B"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City/Town"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      error={errors.city}
                      placeholder="Lagos"
                    />
                    <div className="w-full">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        State
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 text-base rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200 ${
                          errors.state ? "border-red-500 focus:ring-red-500" : ""
                        }`}
                      >
                        <option value="">Select State</option>
                        {NIGERIAN_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="mt-1.5 text-sm text-red-500">{errors.state}</p>
                      )}
                    </div>
                  </div>
                  <Input
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
              </section>

              {/* Payment Method */}
              <section className="bg-white dark:bg-black rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                <div className="space-y-3 mb-6">
                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === "card"
                        ? "border-black dark:border-white bg-neutral-50 dark:bg-neutral-900"
                        : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <CreditCard className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Card Payment</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Pay with Debit/Credit Card
                      </p>
                    </div>
                  </label>
                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === "transfer"
                        ? "border-black dark:border-white bg-neutral-50 dark:bg-neutral-900"
                        : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={paymentMethod === "transfer"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <Building2 className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Pay via bank transfer
                      </p>
                    </div>
                  </label>
                </div>

                {/* Card Details */}
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <Input
                      label="Card Number"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      error={errors.cardNumber}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    <Input
                      label="Name on Card"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      error={errors.cardName}
                      placeholder="Chidi Okonkwo"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        error={errors.expiry}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      <Input
                        label="CVV"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        error={errors.cvv}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                )}

                {/* Bank Transfer Info */}
                {paymentMethod === "transfer" && (
                  <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      After placing your order, you&apos;ll receive bank account details
                      to complete the payment. Your order will be processed once
                      payment is confirmed.
                    </p>
                  </div>
                )}

                {/* Security Note */}
                <div className="flex items-center gap-2 mt-6 text-sm text-neutral-500 dark:text-neutral-400">
                  <Shield className="w-4 h-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </section>

              {/* Submit Button - Mobile */}
              <div className="lg:hidden">
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? "Processing..."
                    : paymentMethod === "transfer"
                    ? `Place Order - ${formatPrice(total)}`
                    : `Pay ${formatPrice(total)}`}
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-xl font-semibold mb-6">
                Order Summary ({itemCount} {itemCount === 1 ? "item" : "items"})
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-black dark:bg-white text-white dark:text-black text-xs font-medium rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {item.product.category}
                      </p>
                      <p className="font-medium mt-1">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-neutral-200 dark:border-neutral-800 my-6" />

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Delivery</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 dark:text-green-400">
                        Free
                      </span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Free Shipping Banner */}
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="mt-6 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm text-center">
                  Add{" "}
                  <span className="font-semibold">
                    {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}
                  </span>{" "}
                  more for free delivery!
                </div>
              )}

              {/* Submit Button - Desktop */}
              <div className="hidden lg:block mt-6">
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={isProcessing}
                  onClick={handleSubmit}
                >
                  {isProcessing
                    ? "Processing..."
                    : paymentMethod === "transfer"
                    ? `Place Order - ${formatPrice(total)}`
                    : `Pay ${formatPrice(total)}`}
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 flex items-center justify-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  <span>Nationwide Delivery</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </main>
  );
}
