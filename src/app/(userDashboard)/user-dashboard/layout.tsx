"use client";

import { useState } from "react";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function UserLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
