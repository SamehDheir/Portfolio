"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  LayoutGrid, 
  Code2, 
  Newspaper, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock,
  Loader2
} from "lucide-react";
import { postsService } from "@/services/posts.service";
import { projectsService } from "@/services/projects.service";
import { skillsService } from "@/services/skills.service";

export default function DashboardPage() {
  // 1. Fetch All Real Data
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => postsService.getAll(),
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectsService.getAll(),
  });

  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: () => skillsService.getAll(),
  });

  // 2. Loading State
  if (postsLoading || projectsLoading || skillsLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  // 3. Logic & Calculations
  const totalPosts = posts?.length || 0;
  const publishedPosts = posts?.filter((p: any) => p.published).length || 0;
  const draftPosts = totalPosts - publishedPosts;
  
  const totalProjects = projects?.length || 0;
  const totalSkills = skills?.length || 0;

  // تحديد المهارة الأعلى (مثلاً بناءً على مستوى الخبرة إذا كان موجوداً)
  const topSkill = skills?.[0]?.name || "N/A";

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects,
      icon: <LayoutGrid className="text-blue-600" size={24} />,
      bgColor: "bg-blue-50",
      trend: "Work Portfolio",
      link: "/dashboard/projects"
    },
    {
      title: "Active Skills",
      value: totalSkills,
      icon: <Code2 className="text-emerald-600" size={24} />,
      bgColor: "bg-emerald-50",
      trend: `Top: ${topSkill}`,
      link: "/dashboard/skills"
    },
    {
      title: "Blog Articles",
      value: totalPosts,
      icon: <Newspaper className="text-indigo-600" size={24} />,
      bgColor: "bg-indigo-50",
      trend: `${publishedPosts} Published`,
      link: "/dashboard/posts"
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Welcome Back, <span className="text-indigo-600">Sameh!</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium italic">
            "Your backend is strong, your frontend is clean." 🦾
          </p>
        </div>
        <div className="text-right hidden md:block">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last Update</p>
           <p className="text-sm font-black text-slate-700">{new Date().toLocaleDateString()}</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat, idx) => (
          <div key={idx} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className={`${stat.bgColor} p-4 rounded-2xl`}>
                {stat.icon}
              </div>
              <a href={stat.link} className="text-xs font-bold text-slate-400 flex items-center gap-1 group-hover:text-indigo-500 transition-colors">
                Manage <ArrowUpRight size={14} />
              </a>
            </div>
            <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">{stat.title}</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-slate-900">{stat.value}</p>
              <span className="text-xs font-bold text-slate-400">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Status Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center">
          <h2 className="text-xl font-black text-slate-900 mb-6">Content Distribution</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-emerald-50 rounded-3xl border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                    <CheckCircle2 size={20} />
                </div>
                <span className="font-bold text-emerald-900">Published Content</span>
              </div>
              <span className="text-3xl font-black text-emerald-600">{publishedPosts}</span>
            </div>
            
            <div className="flex items-center justify-between p-5 bg-amber-50 rounded-3xl border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white">
                    <Clock size={20} />
                </div>
                <span className="font-bold text-amber-900">Pending Drafts</span>
              </div>
              <span className="text-3xl font-black text-amber-600">{draftPosts}</span>
            </div>
          </div>
        </div>

        {/* Motivational Section */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="inline-block px-4 py-1 bg-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                Senior Insights
              </div>
              <h2 className="text-2xl font-black mb-4 group-hover:text-indigo-400 transition-colors">Architecture Matters.</h2>
              <p className="text-slate-400 font-medium leading-relaxed">
                You currently have <span className="text-white font-bold">{totalProjects} projects</span> showcasing your NestJS & PostgreSQL expertise. Ready to add more?
              </p>
            </div>
            <button className="mt-8 bg-indigo-600 text-white w-full py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95 border border-indigo-500">
              Add New Project
            </button>
          </div>
          {/* Subtle background pattern */}
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Code2 size={180} />
          </div>
        </div>
      </div>
    </div>
  );
}