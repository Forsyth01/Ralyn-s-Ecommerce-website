export const categories = [
  {
    id: 1,
    name: "Jewelry",
    slug: "jewelry",
    description: "Elegant pieces to complement your style",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop",
    productCount: 5,
  },
  {
    id: 2,
    name: "Lipgloss",
    slug: "lipgloss",
    description: "Premium lip products for every occasion",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=400&fit=crop",
    productCount: 5,
  },
  {
    id: 3,
    name: "Gadgets",
    slug: "gadgets",
    description: "Tech accessories for modern living",
    image: "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=600&h=400&fit=crop",
    productCount: 5,
  },
];

export const getCategoryBySlug = (slug) => categories.find((c) => c.slug === slug);
