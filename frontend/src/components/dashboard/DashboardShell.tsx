"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderGit2,
  Wrench,
  Newspaper,
  LogOut,
  UserCircle,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import ThemeToggle from "../ThemeToggle";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

  const { user } = useProfile();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const navItems = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: <FolderGit2 size={20} />,
    },
    { name: "Skills", href: "/dashboard/skills", icon: <Wrench size={20} /> },
    {
      name: "Blog Posts",
      href: "/dashboard/posts",
      icon: <Newspaper size={20} />,
    },
    {
      name: "Profile Settings",
      href: "/dashboard/profile",
      icon: <UserCircle size={20} />,
    },
  ];

  return (
    <div className="flex min-h-screen relative bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-slate-600 dark:text-slate-300 transition-all"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:sticky top-0 left-0 z-50
        w-72 h-screen border-r border-slate-200 dark:border-slate-800
        bg-white dark:bg-slate-900/50 backdrop-blur-xl
        flex flex-col transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 dark:bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg font-black text-xl">
              S
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 dark:text-white leading-tight transition-colors">
                Sameh.Dev
              </h1>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Admin Engine
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-sky-600 dark:hover:bg-sky-500 transition-all shadow-lg shadow-slate-100 dark:shadow-none"
            >
              <ExternalLink size={14} /> View Website
            </Link>
            <div className="flex items-center justify-between px-2 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Mode
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>

        <nav className="flex-1 mt-4 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all group
                  ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-sky-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                  }`}
              >
                {item.icon} {item.name}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-sky-500 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Area */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 mb-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group overflow-hidden"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm flex-shrink-0">
              {user?.profileImage ? (
                <img
                  src={`${IMAGE_BASE}${user.profileImage}`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-indigo-600 dark:text-sky-400 bg-white dark:bg-slate-700">
                  <UserCircle size={24} />
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-slate-900 dark:text-white truncate">
                {user?.name || "Sameh Dheir"}
              </p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase truncate">
                {user?.title || "Senior Developer"}
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
          >
            <LogOut size={20} /> Logout Account
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-500">
        <div className="lg:p-8 p-6 pt-20 lg:pt-8 min-h-screen">{children}</div>
      </main>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 dark:bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
