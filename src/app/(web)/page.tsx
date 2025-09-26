"use client";
import SectionHeader from "@/components/global/SectionHeader";
import ItemCard from "@/components/ItemCard";
import AnimatedSlider from "@/components/sections/home/AnimatedSlider";
import ContactForm from "@/components/sections/home/ContactForm";
import Cta from "@/components/sections/home/Cta";
import { ExploreCoffee } from "@/components/sections/home/ExploreCoffee";
import FeaturedItems from "@/components/sections/home/FeaturedItems";
import Hero from "@/components/sections/home/Hero";
import ProductList from "@/components/sections/home/ProductList";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";

const Home = () => {
  const { data: products } = useProducts();
  const isFeatured = products?.filter((item) => item.is_featured);
  return (
    <section className="w-full">
      <Hero />

      <FeaturedItems />

      <section className="max-w-[1220px] py-24 mx-auto">
        <SectionHeader title="Explore the Coffee World" />
        <ExploreCoffee />
      </section>
      <Cta />
      <AnimatedSlider />
      <div className="py-24">
        <ContactForm />
      </div>
    </section>
  );
};

export default Home;
