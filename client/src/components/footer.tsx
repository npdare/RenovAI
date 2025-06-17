import { Home, Facebook, Twitter, Instagram } from "lucide-react";
import { FaPinterest } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Home className="text-accent text-2xl mr-3" />
              <h5 className="text-xl font-bold">HomeVision</h5>
            </div>
            <p className="text-gray-300 mb-4">Transform your space with AI-powered design visualization.</p>
            <div className="flex space-x-4">
              <Facebook className="text-gray-300 hover:text-accent cursor-pointer transition-colors" size={20} />
              <Twitter className="text-gray-300 hover:text-accent cursor-pointer transition-colors" size={20} />
              <Instagram className="text-gray-300 hover:text-accent cursor-pointer transition-colors" size={20} />
              <FaPinterest className="text-gray-300 hover:text-accent cursor-pointer transition-colors" size={20} />
            </div>
          </div>
          
          <div>
            <h6 className="font-semibold mb-4">Features</h6>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#upload" className="hover:text-accent transition-colors">Photo Upload</a></li>
              <li><a href="#inspiration" className="hover:text-accent transition-colors">Design Gallery</a></li>
              <li><a href="#designs" className="hover:text-accent transition-colors">Inspiration Boards</a></li>
              <li><a href="#compare" className="hover:text-accent transition-colors">Before/After</a></li>
            </ul>
          </div>
          
          <div>
            <h6 className="font-semibold mb-4">Support</h6>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-accent transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h6 className="font-semibold mb-4">Company</h6>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 HomeVision. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
