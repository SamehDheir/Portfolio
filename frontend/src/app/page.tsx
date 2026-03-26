import Hero from "@/components/home/Hero";
import ProjectsSection from "@/components/home/ProjectsSection";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ProjectsSection />

    </div>
  );
}
