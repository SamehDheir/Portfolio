import BlogSection from "@/components/home/BlogSection";
import Hero from "@/components/home/Hero";
import ProjectsSection from "@/components/home/ProjectsSection";
import SkillsSection from "@/components/home/SkillsSection";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ProjectsSection />
      <SkillsSection />
      <BlogSection/>
    </div>
  );
}
