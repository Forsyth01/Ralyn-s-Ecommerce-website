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
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
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
