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
  ExternalLink // Imported for the "View Website" action
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile"; 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useProfile(); 

  // Redirect to login if no token is found in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Close sidebar automatically when the route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Projects", href: "/dashboard/projects", icon: <FolderGit2 size={20} /> },
    { name: "Skills", href: "/dashboard/skills", icon: <Wrench size={20} /> },
    { name: "Blog Posts", href: "/dashboard/posts", icon: <Newspaper size={20} /> },
    { name: "Profile Settings", href: "/dashboard/profile", icon: <UserCircle size={20} /> }, 
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] relative">
      
      {/* --- Mobile Hamburger Menu Button --- */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-3 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-600"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* --- Mobile Overlay --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- Main Sidebar Container --- */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50
        w-72 h-screen bg-white border-r border-slate-200 
        flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 font-black text-xl">
              S
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 leading-tight">Sameh.Dev</h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Admin Engine</span>
            </div>
          </div>

          <Link 
            href="/" 
            target="_blank" 
            className="mt-6 flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-600 transition-all duration-300 shadow-lg shadow-slate-100"
          >
            <ExternalLink size={14} />
            View Website
          </Link>
        </div>

        <nav className="flex-1 mt-4 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 group
                  ${isActive 
                    ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                `}
              >
                <span className={`${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                  {item.icon}
                </span>
                {item.name}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          {/* Quick Profile Link */}
          <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 mb-2 hover:bg-indigo-50 transition-colors group">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white shadow-sm flex-shrink-0 bg-white">
              {user?.profileImage ? (
                <img 
                  src={`http://localhost:3000${user.profileImage}`} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-indigo-600 bg-indigo-50">
                  <UserCircle size={24} />
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-slate-900 truncate">{user?.name || "Sameh Dheir"}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase truncate">{user?.title || "Senior Developer"}</p>
            </div>
          </Link>

          {/* Logout Trigger */}
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 w-full">
        <div className="lg:p-0 pt-16 min-h-screen"> 
          {children}
        </div>
      </main>
    </div>
  );
}