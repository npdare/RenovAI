import { Crown, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-neutral-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mr-4">
              <Crown className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900" style={{ fontFamily: 'Playfair Display' }}>
              HomeVision
            </h1>
            <Badge variant="secondary" className="ml-3 bg-amber-100 text-amber-800 border-amber-200">
              Pro
            </Badge>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-12">
            <button 
              onClick={() => scrollToSection('upload')}
              className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium text-sm tracking-wide"
            >
              VISUALIZE
            </button>
            <button 
              onClick={() => scrollToSection('inspiration')}
              className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium text-sm tracking-wide"
            >
              INSPIRATION
            </button>
            <button 
              onClick={() => scrollToSection('designs')}
              className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium text-sm tracking-wide"
            >
              COLLECTIONS
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium text-sm tracking-wide"
            >
              PRICING
            </button>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-neutral-600 hover:text-neutral-900 font-medium">
              Sign In
            </Button>
            <Button className="bg-neutral-900 text-white hover:bg-neutral-800 font-medium px-6">
              Start Free Trial
            </Button>
            <Menu className="lg:hidden text-neutral-600 cursor-pointer" />
          </div>
        </div>
      </div>
    </header>
  );
}
