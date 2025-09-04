import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Providers from "../providers/provider";
import "./globals.css";

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
        <Providers>
          <main className="flex-1">{children}</main>
          <Toaster position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
