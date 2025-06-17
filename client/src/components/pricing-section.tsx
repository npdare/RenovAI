import { Check, Crown, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-amber-100 text-amber-800 border-amber-200 font-medium">
            <Crown className="w-3 h-3 mr-2" />
            PROFESSIONAL PLANS
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6" style={{ fontFamily: 'Playfair Display' }}>
            Choose Your Design Journey
          </h2>
          
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            From quick inspiration to complete room transformations, find the perfect plan for your design needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl p-8 border border-neutral-200 hover:shadow-lg transition-all duration-300">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Starter</h3>
              <p className="text-neutral-600 mb-6">Perfect for trying out AI design visualization</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-neutral-900">Free</span>
                <span className="text-neutral-600 ml-2">forever</span>
              </div>
              
              <Button className="w-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border border-neutral-300">
                Get Started Free
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-neutral-700">3 room visualizations</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-neutral-700">Basic design styles</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-neutral-700">Standard resolution exports</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-neutral-700">Community inspiration gallery</span>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-8 border-2 border-amber-400 relative overflow-hidden transform hover:scale-105 transition-all duration-300">
            <div className="absolute top-4 right-4">
              <Badge className="bg-amber-400 text-neutral-900 font-semibold">
                <Star className="w-3 h-3 mr-1" />
                MOST POPULAR
              </Badge>
            </div>
            
            <div className="mb-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <p className="text-neutral-300 mb-6">For designers and serious home renovators</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-neutral-400 ml-2">/month</span>
              </div>
              
              <Button className="w-full bg-amber-400 text-neutral-900 hover:bg-amber-500 font-semibold">
                Start 7-Day Free Trial
              </Button>
            </div>
            
            <div className="space-y-4 text-white">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-amber-400 mr-3" />
                <span>Unlimited visualizations</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-amber-400 mr-3" />
                <span>Premium design styles & themes</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-amber-400 mr-3" />
                <span>4K high-resolution exports</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-amber-400 mr-3" />
                <span>Product recommendations & affiliate links</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-amber-400 mr-3" />
                <span>Advanced comparison tools</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-amber-400 mr-3" />
                <span>Priority customer support</span>
              </div>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-2xl p-8 border border-neutral-200 hover:shadow-lg transition-all duration-300">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Studio</h3>
              <p className="text-neutral-600 mb-6">For design studios and architecture firms</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-neutral-900">$99</span>
                <span className="text-neutral-600 ml-2">/month</span>
              </div>
              
              <Button className="w-full bg-neutral-900 text-white hover:bg-neutral-800">
                Contact Sales
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-neutral-700">Everything in Professional</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-neutral-700">Team collaboration tools</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-neutral-700">Client presentation mode</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-neutral-700">Custom branding</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-neutral-700">API access</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-neutral-700">Dedicated account manager</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Monetization Features */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4" style={{ fontFamily: 'Playfair Display' }}>
                Shop Curated Design Products
              </h3>
              <p className="text-neutral-700 mb-6 leading-relaxed">
                Discover and purchase the exact furniture, decor, and materials featured in your AI-generated designs. 
                We partner with premium brands to bring your vision to life.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Badge variant="secondary" className="bg-white text-neutral-700 border-neutral-300">
                  West Elm Partnership
                </Badge>
                <Badge variant="secondary" className="bg-white text-neutral-700 border-neutral-300">
                  CB2 Exclusive
                </Badge>
                <Badge variant="secondary" className="bg-white text-neutral-700 border-neutral-300">
                  Design Within Reach
                </Badge>
              </div>
            </div>
            
            <div className="text-center">
              <Zap className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <p className="text-sm text-neutral-600 font-medium mb-2">EARN REWARDS</p>
              <p className="text-neutral-800 font-semibold">Get 5% back on all purchases through our platform</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}