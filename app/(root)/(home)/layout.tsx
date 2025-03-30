import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Metadata } from "next";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "VOOM",
  description: "Video Calling App",
  icons: {
    icon: "/icons/logo.svg",
  },
};

const HomeLayout = ({ children }: Props) => {
  return (
    <main className="relative">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <section className="flex flex-1 min-h-screen flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
          <div className="w-full">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default HomeLayout;
