# Raylns

A modern e-commerce storefront for Jewelry, Lipgloss, and Gadgets built with Next.js 15, React 19, and Tailwind CSS v4.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** React Toastify
- **Font:** Plus Jakarta Sans

## Features

### Storefront
- Responsive design (mobile-first)
- Dark/Light mode toggle
- Product catalog with category filtering
- Product search functionality
- Product quick view modal
- Product detail pages with share functionality
- Shopping cart with localStorage persistence
- Wishlist with localStorage persistence
- Nigerian Naira (₦) currency formatting
- Checkout page with Nigerian states and bank transfer option

### Admin Dashboard
- Dashboard overview with stats
- Products management (add, edit, delete)
- Orders management with status tracking
- Customers list and details
- Store settings

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

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

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
my-app/
├── app/
│   ├── admin/                 # Admin dashboard
│   │   ├── components/        # Admin-specific components
│   │   ├── data/              # Mock data for admin
│   │   ├── customers/         # Customers page
│   │   ├── orders/            # Orders page
│   │   ├── products/          # Products page
│   │   ├── settings/          # Settings page
│   │   ├── layout.jsx         # Admin layout
│   │   └── page.jsx           # Admin dashboard
│   ├── components/
│   │   ├── cart/              # Cart components
│   │   ├── home/              # Homepage components
│   │   ├── layout/            # Layout components (Navbar, Footer)
│   │   ├── products/          # Product components
│   │   ├── ui/                # Reusable UI components
│   │   ├── wishlist/          # Wishlist components
│   │   └── Providers.jsx      # Context providers wrapper
│   ├── context/               # React Context (Cart, Wishlist, Theme)
│   ├── data/                  # Product and category data
│   ├── lib/                   # Utility functions
│   ├── about/                 # About page
│   ├── checkout/              # Checkout page
│   ├── contact/               # Contact page
│   ├── product/[id]/          # Product detail page
│   ├── shop/                  # Shop page
│   ├── globals.css            # Global styles
│   ├── layout.js              # Root layout
│   ├── not-found.jsx          # 404 page
│   └── page.jsx               # Homepage
└── public/
    └── images/                # Product images
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
| `/` | Homepage |
| `/shop` | Product catalog |
| `/product/[id]` | Product detail page |
| `/about` | About page |
| `/contact` | Contact page |
| `/checkout` | Checkout page |
| `/admin` | Admin dashboard |
| `/admin/products` | Manage products |
| `/admin/orders` | Manage orders |
| `/admin/customers` | View customers |
| `/admin/settings` | Store settings |

## Environment Variables

Create a `.env.local` file for environment variables (when backend is integrated):

```env
# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Payment (Paystack)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

## Roadmap

- [ ] Backend integration (Supabase)
- [ ] Admin authentication
- [ ] Payment gateway (Paystack)
- [ ] Order confirmation emails
- [ ] User accounts
- [ ] Product reviews
- [ ] Discount codes
- [ ] Inventory tracking
- [ ] Analytics

## Deployment

The easiest way to deploy this app is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository on Vercel
3. Add environment variables
4. Deploy

## License

This project is private and proprietary.

---

Built with care for Raylns.
