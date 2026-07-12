"use client";

import { useState } from "react";
import AdminHeader from "./_components/Header";
import AdminSidebar from "./_components/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((open) => !open);

  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex min-h-screen flex-col lg:ml-64">
        <AdminHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 px-4 pb-8 md:px-6">{children}</main>
      </div>
    </div>
  );
}
