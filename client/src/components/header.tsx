import { Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Home className="text-accent text-2xl mr-3" />
            <h1 className="text-2xl font-bold text-primary">HomeVision</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('upload')}
              className="text-secondary hover:text-primary transition-colors font-medium"
            >
              Upload Photos
            </button>
            <button 
              onClick={() => scrollToSection('inspiration')}
              className="text-secondary hover:text-primary transition-colors font-medium"
            >
              Inspiration
            </button>
            <button 
              onClick={() => scrollToSection('designs')}
              className="text-secondary hover:text-primary transition-colors font-medium"
            >
              My Designs
            </button>
            <button 
              onClick={() => scrollToSection('compare')}
              className="text-secondary hover:text-primary transition-colors font-medium"
            >
              Compare
            </button>
          </nav>
          <div className="flex items-center space-x-4">
            <Button className="bg-accent text-white hover:bg-accent/90">
              Get Started
            </Button>
            <User className="text-secondary text-2xl cursor-pointer hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}
