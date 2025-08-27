"use client"
import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F7F8F9] relative">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar onCollapseChange={setSidebarCollapsed} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-50 lg:hidden bg-white shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "261px" }}
      >
        <Sidebar onMobileClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-[127px]' : 'lg:ml-[261px]'
      }`}>
        {/* Top Header */}
        <div className="relative z-30">
          <TopHeader onSidebarOpen={() => setSidebarOpen(true)} />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

