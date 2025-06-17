import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      description: "Perfect for exploring AI visualization",
      features: [
        "3 AI visualizations per month",
        "Basic room analysis",
        "Standard design suggestions",
        "Access to inspiration gallery",
        "Basic export options"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "For serious designers and homeowners",
      features: [
        "50 AI visualizations per month",
        "Advanced room analysis",
        "Premium design suggestions",
        "Custom style preferences",
        "High-resolution exports",
        "Priority support",
        "Advanced comparison tools"
      ],
      cta: "Start Professional",
      popular: true
    },
    {
      name: "Studio",
      price: "$99",
      period: "/month",
      description: "For design professionals and agencies",
      features: [
        "Unlimited AI visualizations",
        "Professional room analysis",
        "White-label options",
        "API access",
        "Custom branding",
        "Priority support",
        "Advanced analytics",
        "Team collaboration tools"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="mb-6">
            <span className="text-xs tracking-widest text-gray-500 uppercase luxury-text">
              Pricing Plans
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-light text-black mb-8 luxury-title">
            Choose Your Plan
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed luxury-text">
            From casual exploration to professional design workflows, 
            find the perfect plan for your interior design needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`minimal-card relative ${plan.popular ? 'border-black' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-black text-white px-4 py-1 text-xs tracking-wide luxury-text">
                    MOST POPULAR
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="luxury-title text-black text-sm tracking-wide mb-4">
                  {plan.name.toUpperCase()}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-light text-black luxury-title">{plan.price}</span>
                  <span className="text-gray-500 luxury-text">{plan.period}</span>
                </div>
                <p className="text-gray-600 luxury-text text-sm leading-relaxed">
                  {plan.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 luxury-text text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full mt-8 luxury-text text-xs tracking-widest font-medium py-4 transition-all duration-300 hover:scale-105 ${
                    plan.popular 
                      ? 'bg-black text-white hover:bg-gray-800 border-2 border-black' 
                      : 'bg-white text-black border-2 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {plan.cta.toUpperCase()}
                  <svg className="w-4 h-4 ml-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500 luxury-text text-sm">
            All plans include access to our AI visualization technology and basic support.
          </p>
        </div>
      </div>
    </section>
  );
}