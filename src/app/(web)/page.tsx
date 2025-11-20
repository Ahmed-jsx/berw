"use client";
import SectionHeader from "@/components/global/SectionHeader";
import AnimatedSlider from "@/components/sections/home/AnimatedSlider";
import ContactForm from "@/components/sections/home/ContactForm";
import { ExploreCoffee } from "@/components/sections/home/ExploreCoffee";
import FeaturedItems from "@/components/sections/home/FeaturedItems";
import FeaturedMerch from "@/components/sections/home/FeaturedMerch";
import FirstVisitPopup from "@/components/sections/home/FirstVisitPopup";
import Hero from "@/components/sections/home/Hero";

const Home = () => {

  return (
    <section className="w-full">
      <FirstVisitPopup />
      <Hero />
      {/* <BestSeller /> */}

      <section className="max-w-[1220px] lg:py-16 py-8  mx-auto">
        <FeaturedItems />
        <SectionHeader title="Explore the Coffee World" />
        <ExploreCoffee />
      </section>
      <FeaturedMerch />
      {/* <Cta /> */}
      <AnimatedSlider />
      <div className=" max-w-[1220px] px-8 lg:px-0 py-24 mx-auto">
        <ContactForm />
      </div>
    </section>
  );
};

export default Home;
