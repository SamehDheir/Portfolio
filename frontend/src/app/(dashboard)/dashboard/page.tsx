"use client";

import { useQuery } from "@tanstack/react-query";
import {
  LayoutGrid,
  Code2,
  Newspaper,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { postsService } from "@/services/posts.service";
import { projectsService } from "@/services/projects.service";
import { skillsService } from "@/services/skills.service";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
  // --- Data Fetching ---
  const { data: postsResponse, isLoading: postsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => postsService.getAll(),
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["posts", "stats"],
    queryFn: () => postsService.getStats(),
  });

  const { data: projectsResponse, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectsService.getAll(),
  });

  const { data: skillsResponse, isLoading: skillsLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: () => skillsService.getAll(),
  });

  // --- IMPORTANT: Update Loading State ---
  if (postsLoading || projectsLoading || skillsLoading || statsLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2
          className="animate-spin text-indigo-600 dark:text-sky-500"
          size={48}
        />
      </div>
    );
  }

  // --- Data Normalization (Handling Paginated Objects) ---
  // We extract the actual array from the .data property returned by the service
  const postsList = (postsResponse as any)?.data || [];
  const projectsList =
    (projectsResponse as any)?.data ||
    (Array.isArray(projectsResponse) ? projectsResponse : []);
  const skillsList =
    (skillsResponse as any)?.data ||
    (Array.isArray(skillsResponse) ? skillsResponse : []);

  // --- Logic Calculations ---
  const totalPosts = statsData?.total || 0;
  const publishedPosts = statsData?.published || 0;
  const draftPosts = statsData?.drafts || 0;

  const totalProjects = projectsList.length;
  const totalSkills = skillsList.length;
  const topSkill = skillsList[0]?.name || "N/A";

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects,
      icon: (
        <LayoutGrid className="text-blue-600 dark:text-blue-400" size={24} />
      ),
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      trend: "Work Portfolio",
      link: "/dashboard/projects",
    },
    {
      title: "Active Skills",
      value: totalSkills,
      icon: (
        <Code2 className="text-emerald-600 dark:text-emerald-400" size={24} />
      ),
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      trend: `Top: ${topSkill}`,
      link: "/dashboard/skills",
    },
    {
      title: "Blog Articles",
      value: totalPosts,
      icon: (
        <Newspaper className="text-indigo-600 dark:text-indigo-400" size={24} />
      ),
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      trend: `${publishedPosts} Published`,
      link: "/dashboard/posts",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto transition-colors duration-500">
      <header className="mb-12 flex justify-between items-end">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome Back,{" "}
            <span className="text-indigo-600 dark:text-sky-500">Sameh!</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium italic">
            "Your backend is strong, your frontend is clean" 🦾
          </p>
        </motion.div>
        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
            Last Update
          </p>
          <p className="text-sm font-black text-slate-700 dark:text-slate-300">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`${stat.bgColor} p-4 rounded-2xl`}>
                {stat.icon}
              </div>
              <a
                href={stat.link}
                className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1 group-hover:text-indigo-500 dark:group-hover:text-sky-400 transition-colors"
              >
                Manage <ArrowUpRight size={14} />
              </a>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider mb-1">
              {stat.title}
            </h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-slate-900 dark:text-white">
                {stat.value}
              </p>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Content Distribution */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center transition-all">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">
            Content Distribution
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <CheckCircle2 size={20} />
                </div>
                <span className="font-bold text-emerald-900 dark:text-emerald-400">
                  Published Content
                </span>
              </div>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-500">
                {publishedPosts}
              </span>
            </div>

            <div className="flex items-center justify-between p-5 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white">
                  <Clock size={20} />
                </div>
                <span className="font-bold text-amber-900 dark:text-amber-400">
                  Pending Drafts
                </span>
              </div>
              <span className="text-3xl font-black text-amber-600 dark:text-amber-500">
                {draftPosts}
              </span>
            </div>
          </div>
        </div>

        {/* Motivational Section */}
        <div className="bg-slate-900 dark:bg-indigo-950 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group border border-transparent dark:border-indigo-900/50 transition-all">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="inline-block px-4 py-1 bg-indigo-500 dark:bg-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                Senior Insights
              </div>
              <h2 className="text-2xl font-black mb-4 group-hover:text-indigo-400 dark:group-hover:text-sky-300 transition-colors">
                Architecture Matters.
              </h2>
              <p className="text-slate-400 dark:text-indigo-200/60 font-medium leading-relaxed">
                You currently have{" "}
                <span className="text-white font-bold">
                  {totalProjects} projects
                </span>{" "}
                showcasing your NestJS & PostgreSQL expertise. Ready to add
                more?
              </p>
            </div>
            <Link
              href="/dashboard/projects"
              className="mt-8 bg-indigo-600 dark:bg-indigo-700 p-3 text-center border-0 text-white w-full py-4 rounded-2xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg active:scale-95 border border-indigo-500 block"
            >
              Add New Project
            </Link>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Code2 size={180} className="dark:text-indigo-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
