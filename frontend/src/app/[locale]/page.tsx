import BlogSection from "@/components/home/BlogSection";
import ContactSection from "@/components/home/ContactSection";
import Hero from "@/components/home/Hero";
import ProjectsSection from "@/components/home/ProjectsSection";
import SkillsSection from "@/components/home/SkillsSection";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sameh Dheir | Backend & Full-Stack Engineer | Node.js & NestJS",
  description:
    "Specializing in building high-performance systems and scalable backend architectures using Node.js, NestJS, TypeScript, and modern web technologies",
  keywords: [
    "Sameh Dheir",
    "Backend Engineer",
    "Full Stack Engineer",
    "Node.js Expert",
    "NestJS Expert",
    "Software Architect",
    "Portfolio",
  ],
  openGraph: {
    title: "Sameh Dheir | Backend & Full-Stack Engineer",
    description: "Node.js & NestJS Expert - Building scalable systems and interactive experiences",
    url: "https://sameh-dheir.vercel.app",
    siteName: "Sameh Dheir Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sameh Dheir Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sameh Dheir | Backend & Full-Stack Engineer",
    description:
      "Node.js & NestJS specialist building robust backend architectures and modern web applications",
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ProjectsSection />
      <SkillsSection />
      <BlogSection />
      <ContactSection />
    </div>
  );
}
