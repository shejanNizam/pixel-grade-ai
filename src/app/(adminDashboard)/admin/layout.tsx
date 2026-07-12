"use client";

import { useState } from "react";
import AdminHeader from "./_components/Header";
import AdminSidebar from "./_components/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <AdminHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
