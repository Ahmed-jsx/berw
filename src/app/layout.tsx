import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Providers from "../providers/provider";
import "./globals.css";
import { redirect } from "next/navigation";
import WhatsAppButton from "@/components/global/WhatsAppButton";

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
      <body className={`${montserrat.className} antialiased flex flex-col `}>
        <Providers>
          <main className="flex-1 min-h-full">{children}</main>
          <WhatsAppButton />
          <Toaster position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
