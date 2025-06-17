import { Sparkles, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-black flex items-center justify-center mr-3">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-black luxury-title">
              RenovAI
            </h1>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-12">
            <button 
              onClick={() => scrollToSection('studio')}
              className="text-gray-600 hover:text-black transition-colors luxury-text text-sm tracking-wide"
            >
              STUDIO
            </button>
            <button 
              onClick={() => scrollToSection('inspiration')}
              className="text-gray-600 hover:text-black transition-colors luxury-text text-sm tracking-wide"
            >
              GALLERY
            </button>
            <button 
              onClick={() => scrollToSection('designs')}
              className="text-gray-600 hover:text-black transition-colors luxury-text text-sm tracking-wide"
            >
              BOARDS
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-gray-600 hover:text-black transition-colors luxury-text text-sm tracking-wide"
            >
              PRICING
            </button>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-600 hover:text-black luxury-text">
              Sign In
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800 luxury-text px-6">
              Start Free Trial
            </Button>
            <Menu className="lg:hidden text-gray-600 cursor-pointer" />
          </div>
        </div>
      </div>
    </header>
  );
}
