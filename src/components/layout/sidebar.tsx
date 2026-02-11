import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  label: string;
  href: string;
  requiresAdmin?: boolean;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/portal/dashboard" },
  { label: "Projects", href: "/portal/projects" },
  { label: "Tasks", href: "/portal/tasks" },
  { label: "Members", href: "/portal/members" },
  { label: "Settings", href: "/portal/settings" },
];

const adminNavItems: NavItem[] = [
  { label: "Organizations", href: "/admin/organizations", requiresAdmin: true },
  { label: "Billing", href: "/admin/billing", requiresAdmin: true },
];

export function Sidebar() {
  const router = useRouter();
  const { user, hasRole } = useAuth();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">TeamHub</h1>
        <p className="text-sm text-gray-400 mt-1">{user?.name}</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  router.pathname === item.href
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {hasRole("ADMIN") && (
          <>
            <div className="mt-6 mb-2 px-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Admin
              </p>
            </div>
            <ul className="space-y-1">
              {adminNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      router.pathname.startsWith(item.href)
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">TeamHub v1.0.0</p>
      </div>
    </aside>
  );
}
