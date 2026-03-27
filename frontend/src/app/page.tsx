import BlogSection from "@/components/home/BlogSection";
import ContactSection from "@/components/home/ContactSection";
import Hero from "@/components/home/Hero";
import ProjectsSection from "@/components/home/ProjectsSection";
import SkillsSection from "@/components/home/SkillsSection";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sameh Dheir | Senior Full-Stack Developer & Software Architect",
  description: "Specializing in building high-performance systems, AI-driven platforms, and scalable backend architectures using NestJS, Node.js, and Python.",
  keywords: ["Sameh Dheir", "Full Stack Developer", "Backend Engineer", "NestJS Expert", "Software Architect", "Portfolio"],
  openGraph: {
    title: "Sameh Dheir | Portfolio",
    description: "Architecture & Scale - Building Interactive Experiences.",
    url: "https://sameh.dev",
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
    title: "Sameh Dheir | Senior Full-Stack Developer",
    description: "Building robust backend architectures and seamless user interfaces.",
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ProjectsSection />
      <SkillsSection />
      <BlogSection/>
      <ContactSection/>
    </div>
  );
}
