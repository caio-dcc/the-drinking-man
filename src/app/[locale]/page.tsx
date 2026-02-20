import { Footer } from "@/components/shared/Footer";
import { HeroSection } from "@/components/feature/HeroSection";
import { AboutSection } from "@/components/feature/AboutSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
    </main>
  );
}
