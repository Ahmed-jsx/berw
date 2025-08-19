import SectionHeader from "@/components/global/SectionHeader";
import ItemCard from "@/components/ItemCard";
import AnimatedSlider from "@/components/sections/home/AnimatedSlider";
import ContactForm from "@/components/sections/home/ContactForm";
import Cta from "@/components/sections/home/Cta";
import { ExploreCoffee } from "@/components/sections/home/ExploreCoffee";
import Hero from "@/components/sections/home/Hero";
import { Button } from "@/components/ui/button";

const items = [
  {
    name: "Item 1",
    description: "Description 1",
    price: 10,
    image: "/coffee.png",
  },
  {
    name: "Item 2",
    description: "Description 2",
    price: 20,
    image: "/coffee.png",
  },
  {
    name: "Item 3",
    description: "Description 3",
    price: 30,
    image: "/coffee.png",
  },
  {
    name: "Item 4",
    description: "Description 4",
    price: 40,
    image: "/coffee.png",
  },
];

const Test = () => {
  return (
    <section className="w-full">
      <Hero />
      <section className="max-w-[1220px] py-24 mx-auto">
        <SectionHeader title="Explore the Coffee World" />
        <div className="grid place-items-center py-12 grid-cols-1 md:grid-cols-2 mt-20 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item.name} {...item} />
          ))}
        </div>
        <div className="flex items-center justify-center">
          <Button>Show All Menu</Button>
        </div>
      </section>
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

export default Test;
