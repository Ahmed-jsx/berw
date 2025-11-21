
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function AboutUs() {
  return (
    <>
    <main className="relative min-h-screen max-w-full lg:max-w-[calc(100vw-6rem)] lg:my-8 lg:mx-auto lg:rounded-[40px] overflow-hidden">
  {/* Background image + Overlay */}
  <div className="absolute inset-0">
    <Image
      src="/about-us-2.jpg"
      alt="About Us Background"
      fill
      quality={100}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
      style={{ objectFit: "cover" }}
      className="object-cover"
      priority
    />
    {/* Overlay - now INSIDE the background div */}
    <div className="absolute inset-0 bg-black/50" />
  </div>

  {/* Content - z-10 is now above the background (which has no z-index) */}
  <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
    <section className="max-w-6xl mx-auto w-full">
      <div className="text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white leading-tight max-w-6xl mx-auto">
          At Monkey Brew,<br className="hidden sm:inline" />
          the cup is just the beginning.
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
          So come in. Sit down. Stay awhile—or just grab your cup and savour the road ahead.
        </p>
      </div>
    </section>
  </div>
</main>
    <section className="max-w-7xl mx-auto flex my-16 px-4 md:px-6 lg:px-0 justify-center items-center">
      <div className="flex flex-col gap-6 items-center text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary">More Than Just Coffee</h2>
        <p className="text-lg md:text-xl lg:text-2xl text-secondary font-medium">We don't see coffee as just a beverage. We see it as a ritual, a bridge <br className="hidden md:inline" /> between people, a moment of pause and presence.</p>
        <AboutUsContent />
      </div>
    </section>
    <AboutUsFooter />
    </>
  );
}

const AboutUsContent = () => {
  
  const Content = [
    {
      title: "Community",
      description: "When you walk into Monkey Brew, you're not just ordering a drink — you're stepping into a space built on moments, on shared humanity, on craft.",
      image: "/heart.png",
    },
    {
      title: "Experience",
      description: "We aim to make every visit matter: the bean you taste, the barista you meet, the place you sit — all parts of the experience.",
      image: "/user.png",
    },
    {
      title: "Integrity",
      description: "We believe in doing this with integrity: encouraging curiosity, respecting origin, celebrating flavor, and honoring community.",
      image: "/hand.svg",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-8 md:gap-12 lg:gap-20 my-8 md:my-12 w-full max-w-[1100px] mx-auto items-center px-4 md:px-6 lg:px-0">
      {Content.map((item, index) => (
        <div 
          key={item.title} 
          className={cn(
            "flex flex-col md:flex-row gap-6 md:gap-12 lg:gap-24 items-center",
            index % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"
          )}
        >
          <div className={cn(
            `w-[120px] h-[120px] md:w-[160px] md:h-[160px] lg:w-[200px] lg:h-[200px] rounded-full flex items-center justify-center flex-shrink-0`,
            index % 2 === 0 ? "bg-primary" : "bg-secondary"
          )}>
            <Image 
              src={item.image} 
              alt={item.title} 
              width={100} 
              height={100} 
              className="object-contain w-[60px] h-[60px] md:w-[80px] md:h-[80px] lg:w-[100px] lg:h-[100px]" 
              priority 
            />
          </div>
          <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 items-center md:items-start text-center md:text-start">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-secondary">{item.title}</h3>
            <p className="text-base md:text-xl lg:text-2xl text-secondary max-w-3xl font-medium">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const AboutUsFooter = () => {
  return (
     <section className="bg-secondary px-4 md:px-6 lg:px-0 my-12 py-12 min-h-[500px] max-w-full lg:max-w-[calc(100vw-6rem)] lg:my-8 lg:mx-auto lg:rounded-[40px] overflow-hidden flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-white gap-6 text-center">
        <h2 className="text-6xl font-bold text-white">Our Beans Tell Stories</h2>
       <div className="flex items-center justify-center text-center text-lg md:text-xl lg:text-2xl max-w-6xl flex-col gap-8">
       <p className=" text-white ">
        Our beans tell stories: of the land where they were grown, of the farmers who nurtured them, and of the barista who carefully brings that story to life in your cup. For us, that story matters.        </p>
        <p>We source beans that have distinctive origin, exceptional flavor profiles, and are handled with care from farm to brew. We believe in sourcing coffee thoughtfully beans with character, grown with care, roasted to bring out their best.</p>
       </div>
      </div>
    </section>
  );
};