"use client";

import { useState } from "react";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function UserLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((open) => !open);

  return (
    <div className="min-h-screen bg-black">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex min-h-screen flex-col lg:ml-64">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 px-4 pb-8 md:px-6">{children}</main>
      </div>
    </div>
  );
}
