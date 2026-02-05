import { Plus_Jakarta_Sans, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/app/components/Providers";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import CartDrawer from "@/app/components/cart/CartDrawer";
import WishlistDrawer from "@/app/components/wishlist/WishlistDrawer";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Ralyn's Limited | Jewelry, Lipgloss & Gadgets",
  description: "Discover your style with our curated collection of Jewelry, Lipgloss, and Gadgets.",
};

export default function RootLayout({ children }) {
  // Script to prevent flash of wrong theme on load
  const themeScript = `
    (function() {
      try {
        var theme = localStorage.getItem('raylns-theme');
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      } catch (e) {}
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${plusJakarta.variable} ${plusJakarta.className} ${jetbrainsMono.variable} ${playfair.variable} antialiased bg-white dark:bg-black`}
      >
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-16 md:pt-20">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <WishlistDrawer />
        </Providers>
      </body>
    </html>
  );
}
