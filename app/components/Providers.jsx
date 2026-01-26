"use client";

import { ToastContainer } from "react-toastify";
import { CartProvider } from "@/app/context/CartContext";
import { WishlistProvider } from "@/app/context/WishlistContext";
import { ThemeProvider, useTheme } from "@/app/context/ThemeContext";

function ToastWrapper({ children }) {
  const { isDark } = useTheme();

  return (
    <>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? "dark" : "light"}
      />
    </>
  );
}

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastWrapper>{children}</ToastWrapper>
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
