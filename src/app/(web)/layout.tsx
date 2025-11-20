import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import WhatsAppButton from "@/components/global/WhatsAppButton";
import React from "react";

const WebLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1">{children}</div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default WebLayout;
