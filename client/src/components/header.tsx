import { User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
              </div>
              <h1 className="text-lg sm:text-xl font-light text-black luxury-title tracking-wide">
                RenovAI
              </h1>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
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
          
          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
            <Button variant="ghost" className="text-gray-600 hover:text-black luxury-text text-sm">
              Sign In
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800 luxury-text px-4 lg:px-6 text-sm">
              Start Free Trial
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
              <Link href="/studio">
                <div
                  className={`block px-3 py-2 text-base font-medium cursor-pointer ${
                    location === '/studio' 
                      ? 'text-black bg-gray-50' 
                      : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                  onClick={closeMobileMenu}
                >
                  STUDIO
                </div>
              </Link>
              <Link href="/gallery">
                <div
                  className={`block px-3 py-2 text-base font-medium cursor-pointer ${
                    location === '/gallery' 
                      ? 'text-black bg-gray-50' 
                      : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                  onClick={closeMobileMenu}
                >
                  GALLERY
                </div>
              </Link>
              <Link href="/boards">
                <div
                  className={`block px-3 py-2 text-base font-medium cursor-pointer ${
                    location === '/boards' 
                      ? 'text-black bg-gray-50' 
                      : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                  onClick={closeMobileMenu}
                >
                  BOARDS
                </div>
              </Link>
              <Link href="/pricing">
                <div
                  className={`block px-3 py-2 text-base font-medium cursor-pointer ${
                    location === '/pricing' 
                      ? 'text-black bg-gray-50' 
                      : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                  onClick={closeMobileMenu}
                >
                  PRICING
                </div>
              </Link>
              
              {/* Mobile Actions */}
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="space-y-3 px-3">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-600 hover:text-black luxury-text"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full bg-black text-white hover:bg-gray-800 luxury-text"
                    onClick={closeMobileMenu}
                  >
                    Start Free Trial
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
