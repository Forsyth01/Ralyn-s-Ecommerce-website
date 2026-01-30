# Ralyn's Limited

A modern e-commerce storefront for Jewelry, Lipgloss, Gadgets, and Fashion built with Next.js 16, React 19, Tailwind CSS v4, and Supabase.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** React Toastify
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage (product images)
- **Fonts:** Plus Jakarta Sans, Playfair Display

## Features

### Storefront
- Responsive design (mobile-first)
- Dark/Light mode toggle
- Product catalog with category filtering (Jewelry, Lipgloss, Gadgets, Fashion)
- Product search functionality
- Product quick view modal
- Product detail pages with share functionality (WhatsApp, Twitter/X, copy link)
- Size selection for fashion products (clothes, shoes, bags, wristwatches)
- Shopping cart with localStorage persistence and clear confirmation modal
- Wishlist with localStorage persistence and clear confirmation modal
- Nigerian Naira (NGN) currency formatting
- Checkout with Nigerian states, card payment, and bank transfer options
- Order creation with automatic customer tracking

### Admin Dashboard
- Protected by Supabase Auth (email/password login)
- Dashboard overview with real-time stats (revenue, orders, customers, products)
- Products management (add, edit, delete) with image upload via Supabase Storage
- Orders management with status tracking (pending, processing, shipped, delivered, cancelled)
- Customers list with details modal and order history
- Store settings

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Supabase](https://supabase.com) project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Set up the database tables in the Supabase SQL Editor (see [Database Setup](#database-setup) below).

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

Run the following SQL in your Supabase SQL Editor to create the required tables:

```sql
-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image VARCHAR(500) NOT NULL,
  images TEXT[] DEFAULT '{}',
  category VARCHAR(50) NOT NULL,
  subcategory VARCHAR(100),
  description TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_sale BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE,
  sizes TEXT[] DEFAULT '{}',
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  total_spent DECIMAL(12,2) DEFAULT 0,
  orders_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  items JSONB NOT NULL,
  items_count INTEGER NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Users (links to Supabase Auth)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

### Row Level Security (RLS)

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products: public read, admin write
CREATE POLICY "Products public read" ON products FOR SELECT USING (true);
CREATE POLICY "Products admin write" ON products FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Orders: anyone can insert, admin can read/update
CREATE POLICY "Orders insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders admin access" ON orders FOR SELECT
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
CREATE POLICY "Orders admin update" ON orders FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Customers: admin only
CREATE POLICY "Customers admin only" ON customers FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
```

### Storage Bucket

Create a `product-images` storage bucket for product image uploads:

```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Allow upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images');

CREATE POLICY "Allow delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');
```

### Admin User Setup

1. Create a user in **Supabase Auth** (Authentication > Users > Add User)
2. Insert that user into the `admin_users` table:
```sql
INSERT INTO admin_users (id, email, name)
VALUES ('your-auth-user-uuid', 'admin@example.com', 'Admin');
```

## Project Structure

```
my-app/
├── app/
│   ├── admin/
│   │   ├── components/        # Admin-specific components (DataTable, StatCard, etc.)
│   │   ├── customers/         # Customers page
│   │   ├── login/             # Admin login page
│   │   ├── orders/            # Orders page
│   │   ├── products/          # Products CRUD page
│   │   ├── settings/          # Settings page
│   │   ├── layout.jsx         # Admin layout (sidebar, topbar)
│   │   └── page.jsx           # Admin dashboard
│   ├── components/
│   │   ├── cart/              # Cart drawer with clear confirmation
│   │   ├── home/              # Homepage components (Hero, FeaturedProducts, etc.)
│   │   ├── layout/            # Layout components (Navbar, Footer, Container)
│   │   ├── products/          # Product components (ProductCard, ProductGrid, etc.)
│   │   ├── ui/                # Reusable UI components (Button, Input, Badge)
│   │   ├── wishlist/          # Wishlist drawer with clear confirmation
│   │   └── Providers.jsx      # Context providers wrapper
│   ├── context/               # React Context (Cart, Wishlist, Theme)
│   ├── lib/
│   │   ├── actions/           # Server Actions (auth, orders, products)
│   │   ├── data/              # Server-side data queries (products, orders, customers)
│   │   ├── supabase/          # Supabase clients (client, server, admin, storage)
│   │   ├── constants.js       # App constants
│   │   └── utils.js           # Utility functions (formatPrice, cn)
│   ├── about/                 # About page
│   ├── checkout/              # Checkout page
│   ├── contact/               # Contact page
│   ├── product/[id]/          # Product detail page
│   ├── shop/                  # Shop page
│   ├── globals.css            # Global styles
│   ├── layout.js              # Root layout
│   ├── not-found.jsx          # 404 page
│   └── page.jsx               # Homepage
├── middleware.js               # Auth middleware (protects /admin routes)
├── .env.local                  # Environment variables (not committed)
└── public/
    └── images/                # Static images
```

## Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, featured products, categories |
| `/shop` | Product catalog with category filtering and search |
| `/product/[id]` | Product detail page with size selection and sharing |
| `/about` | About page |
| `/contact` | Contact page |
| `/checkout` | Checkout with card/bank transfer payment |
| `/admin/login` | Admin login page |
| `/admin` | Admin dashboard with stats and recent orders |
| `/admin/products` | Products CRUD with image upload |
| `/admin/orders` | Orders management with status updates |
| `/admin/customers` | Customer list with details and order history |
| `/admin/settings` | Store settings |

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

When deploying to Vercel, add these same variables in your project's Environment Variables settings.

## Deployment

Deploy using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository on Vercel
3. Add the three environment variables above
4. Deploy

## Roadmap

- [x] Supabase database integration
- [x] Admin authentication
- [x] Product image uploads (Supabase Storage)
- [x] Order creation from checkout
- [x] Customer tracking
- [x] Fashion category with size selection
- [ ] Payment gateway (Paystack)
- [ ] Order confirmation emails/WhatsApp
- [ ] User accounts
- [ ] Product reviews
- [ ] Discount codes
- [ ] Inventory tracking
- [ ] Analytics

## License

This project is private and proprietary.

---

Built with care for Ralyn's Limited.
