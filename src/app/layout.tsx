import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Footer from "@/components/global/Footer";
import Providers from "../providers/provider";
import { Toaster } from "@/components/ui/sonner";

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
      <body className={`${montserrat.className} antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
