import { User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="w-8 h-8 flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
              </div>
              <h1 className="text-xl font-light text-black luxury-title tracking-wide">
                RenovAI
              </h1>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-12">
            <Link href="/studio">
              <span className={`text-gray-600 hover:text-black transition-colors luxury-text text-sm tracking-wide cursor-pointer ${location === '/studio' ? 'text-black' : ''}`}>
                STUDIO
              </span>
            </Link>
            <Link href="/gallery">
              <span className={`text-gray-600 hover:text-black transition-colors luxury-text text-sm tracking-wide cursor-pointer ${location === '/gallery' ? 'text-black' : ''}`}>
                GALLERY
              </span>
            </Link>
            <Link href="/boards">
              <span className={`text-gray-600 hover:text-black transition-colors luxury-text text-sm tracking-wide cursor-pointer ${location === '/boards' ? 'text-black' : ''}`}>
                BOARDS
              </span>
            </Link>
            <Link href="/pricing">
              <span className={`text-gray-600 hover:text-black transition-colors luxury-text text-sm tracking-wide cursor-pointer ${location === '/pricing' ? 'text-black' : ''}`}>
                PRICING
              </span>
            </Link>
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
