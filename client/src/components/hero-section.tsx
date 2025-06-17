import { Upload, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToUpload = () => {
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="gradient-hero py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6">
          Transform Your Space
        </h2>
        <p className="text-xl text-secondary mb-8 max-w-3xl mx-auto">
          Upload photos of your home and explore endless design possibilities with AI-powered visualization tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={scrollToUpload}
            className="bg-accent text-white px-8 py-4 text-lg font-semibold hover:bg-accent/90 shadow-lg"
            size="lg"
          >
            <Upload className="mr-2 h-5 w-5" />
            Upload Your Photos
          </Button>
          <Button
            variant="outline"
            className="border-2 border-accent text-accent px-8 py-4 text-lg font-semibold hover:bg-accent hover:text-white"
            size="lg"
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
