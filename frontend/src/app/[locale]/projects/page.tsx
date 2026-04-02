"use client";

import { useQuery } from "@tanstack/react-query";
import ProjectCard from "@/components/projects/ProjectCard";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { FaCode } from "react-icons/fa";

export default function AllProjectsPage() {
  const t = useTranslations("Projects");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["all-projects"],
    queryFn: () => fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`).then(res => res.json())
  });

  return (
    <main className="min-h-screen transition-colors duration-300
                     bg-white dark:bg-slate-950 px-6 py-24">
      
      <header className="container mx-auto mb-20 text-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-black tracking-[0.2em] text-indigo-600 dark:text-sky-500 uppercase"
        >
          {t("badge")}
        </motion.span>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black mt-4 mb-6
                     text-slate-900 dark:text-white"
        >
          {t("title")} <span className="text-indigo-600 dark:text-sky-500">{t("titleAccent")}</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed
                     text-slate-600 dark:text-slate-400"
        >
          {t("subtitle")}
        </motion.p>
      </header>

      <div className="container mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[400px] rounded-2xl animate-pulse 
                                      bg-slate-100 dark:bg-slate-800/50" />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects?.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        )}

        {!isLoading && projects?.length > 0 && (
          <div className="mt-20 text-center">
            <a
            href="https://github.com/SamehDheir"
            target="_blank"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-black text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-sky-200 dark:hover:border-sky-900 transition-all group shadow-sm"
          >
            <FaCode className="group-hover:rotate-12 transition-transform text-sky-600" />
            {t("exploreGithub")}
          </a>
          </div>
        )}
      </div>
    </main>
  );
}