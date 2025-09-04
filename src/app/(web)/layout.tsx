import Footer from "@/components/global/Footer";
import Header from "@/components/global/Header";
import React from "react";

const WebLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {children}
      <Footer />
    </div>
  );
};

export default WebLayout;
