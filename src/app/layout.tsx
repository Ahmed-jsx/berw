import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Footer from "@/components/global/Footer";
import Providers from "../providers/provider";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/global/Header";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monkey Brew ",
  description: "Monkey Brew",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`${montserrat.className} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <Providers>
          <main className="flex-1">
            <NuqsAdapter>{children}</NuqsAdapter>
          </main>
          <Toaster position="bottom-right" richColors />
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
