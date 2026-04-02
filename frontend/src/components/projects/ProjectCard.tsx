"use client";

import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link?: string | null;
  github?: string | null;
  images: string[];
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations("Projects");

  return (
    <div className="group relative overflow-hidden rounded-2xl transition-all duration-300 shadow-lg 
                    bg-white border border-slate-200 hover:border-blue-500/50 hover:shadow-blue-500/10
                    dark:bg-slate-900 dark:border-slate-800 dark:hover:border-blue-400/50">
      
      {/* Thumbnail Section */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={project.images[0] || "/placeholder-project.png"}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 transition-colors
                       text-slate-900 group-hover:text-blue-600
                       dark:text-white dark:group-hover:text-blue-400">
          {project.title}
        </h3>

        <p className="text-sm line-clamp-2 mb-4 leading-relaxed
                      text-slate-600 dark:text-slate-400">
          {project.description}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-colors
                         bg-slate-50 text-slate-600 border-slate-200
                         dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:group-hover:border-blue-500/30"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-between pt-4 border-t 
                        border-slate-100 dark:border-slate-800">
          <div className="flex gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm transition-colors
                           text-slate-500 hover:text-slate-900
                           dark:text-slate-400 dark:hover:text-white"
              >
                <FaGithub size={18} />
                <span>{t("exploreGithubCode")}</span>
              </a>
            )}
          </div>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-medium text-sm transition-colors
                         text-blue-600 hover:text-blue-700
                         dark:text-blue-500 dark:hover:text-blue-400"
            >
              <span>{t('viewLive')}</span>
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}