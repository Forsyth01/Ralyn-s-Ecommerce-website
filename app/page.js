import Hero from "@/app/components/home/Hero";
import FeaturedProducts from "@/app/components/home/FeaturedProducts";
import CategoryShowcase from "@/app/components/home/CategoryShowcase";
import Newsletter from "@/app/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <CategoryShowcase />
      {/* <Newsletter /> */}
    </>
  );
}
