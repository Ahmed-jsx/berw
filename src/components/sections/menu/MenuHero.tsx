"use client";

export default function HeroSection() {
  return (
    <section className="relative max-w-[calc(100vw-6rem)] my-8 mx-auto rounded-default   flex flex-col items-center justify-center bg-cover bg-center">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 text-center">
        {/* Search */}
        <div className="mt-6 flex justify-center">
          <input
            type="text"
            placeholder="Search your favorite drink..."
            className="w-full max-w-lg px-6 py-3 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 text-black focus:ring-yellow-400"
          />
        </div>
      </div>
    </section>
  );
}
