import { Button } from "@/components/ui/button";
import { coffees } from "@/data/coffees";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PageProps {
  params: {
    id: string;
  };
}

const extras = [
  {
    name: "Extra Shot",
    id: "extra",
    price: 10,
  },
  {
    name: "Extra Shot",
    id: "extra2",
    price: 10,
  },
  {
    name: "Extra Shot",
    id: "extra3",
    price: 10,
  },
];

async function Page({ params }: PageProps) {
  const coffee = await coffees.find((coffee) => coffee.id === params.id);

  return (
    <>
      <main className="min-h-dvh max-w-[calc(100vw-6rem)] my-8 mx-auto rounded-default">
        {/* Hero Section */}
        <section className="relative min-h-dvh rounded-default overflow-hidden">
          {/* Background with coffee beans */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${coffee?.image || ""})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "blur(3px)",
            }}
          >
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center min-h-dvh px-6 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto w-full">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left side - Coffee cup image */}
                <div className="flex justify-center lg:justify-start">
                  <div className="relative">
                    <Image
                      width={500}
                      height={500}
                      src={coffee?.image || ""}
                      style={{ objectFit: "cover" }}
                      alt="Cappuccino with latte art"
                      className="w-80 h-80 md:w-96 md:h-96 object-cover rounded-2xl shadow-2xl"
                    />
                  </div>
                </div>

                {/* Right side - Product info */}
                <div className="text-white max-w-[700px] space-y-6">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
                    {coffee?.name}
                  </h1>

                  <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-lg">
                    {coffee?.description}
                  </p>

                  <div className="flex items-center justify-between gap-6">
                    <div className="text-3xl md:text-4xl bg-white/20 backdrop-blur-lg border border-white/15 px-4 py-2 rounded-default font-bold text-yellow-400">
                      {coffee?.price}{" "}
                      <span className="text-lg text-yellow-300">EGP</span>
                    </div>

                    <Button
                      size="lg"
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-full text-lg"
                    >
                      + Order
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <section className="py-24 max-w-[calc(100vw-6rem)] mx-auto">
        <div className="grid grid-cols-12 gap-24">
          <div className="flex gap-8 col-span-4 flex-col">
            <h2 className="text-5xl  font-bold">Any extras?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:min-w-[700px] lg:grid-cols-2 gap-6">
              {extras.map((extra) => (
                <div
                  key={extra.id}
                  className="bg-white/20 backdrop-blur-lg border border-white/15  rounded-default"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox id={extra.id} />
                    <Label htmlFor="terms">{extra.name}</Label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-start-7 col-span-4   items-start">
            <div className="flex flex-col gap-8">
              <Label className="text-2xl font-medium" htmlFor="notes">
                Add Special Note (Optional)
              </Label>
              <Input
                type="text"
                id="notes"
                className="rounded-full p-4 placeholder:text-black/50 bg-[#F5F5F5] "
                placeholder="Add your note here"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Page;
