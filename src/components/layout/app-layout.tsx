import React from "react";
import { Sidebar } from "./sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {title && (
          <header className="bg-white border-b border-gray-200 px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </header>
        )}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
