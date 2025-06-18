import { ExternalLink, Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

// Authentic furniture with accurate image-description matching
const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "Modern Living Room Set",
    brand: "West Elm",
    price: 1299,
    originalPrice: 1599,
    rating: 4.8,
    reviews: 324,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    description: "Contemporary seating arrangement",
    affiliateLink: "https://www.westelm.com/?utm_source=renovai&utm_medium=affiliate&utm_campaign=interior_design",
    inStock: true,
    featured: true,
    commissionRate: 8,
    regions: {
      US: { price: 1299, currency: 'USD', link: 'https://www.westelm.com/?utm_source=renovai&utm_medium=affiliate&utm_campaign=interior_design' },
      UK: { price: 1099, currency: 'GBP', link: 'https://www.westelm.co.uk/?utm_source=renovai&utm_medium=affiliate&utm_campaign=interior_design' },
      CA: { price: 1699, currency: 'CAD', link: 'https://www.westelm.ca/?utm_source=renovai&utm_medium=affiliate&utm_campaign=interior_design' }
    }
  },
  {
    id: 2,
    name: "Round Wooden Table",
    brand: "CB2",
    price: 899,
    originalPrice: null,
    rating: 4.6,
    reviews: 187,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    description: "Natural wood finish surface",
    affiliateLink: "https://www.cb2.com/?utm_source=renovai&utm_medium=affiliate&utm_campaign=interior_design",
    inStock: true,
    featured: false,
    commissionRate: 6,
    regions: {
      US: { price: 899, currency: 'USD', link: 'https://www.cb2.com/?utm_source=renovai&utm_medium=affiliate&utm_campaign=interior_design' },
      UK: { price: 759, currency: 'GBP', link: 'https://www.cb2.co.uk/?utm_source=renovai&utm_medium=affiliate&utm_campaign=interior_design' },
      CA: { price: 1199, currency: 'CAD', link: 'https://www.cb2.ca/?utm_source=renovai&utm_medium=affiliate&utm_campaign=interior_design' }
    }
  },
  {
    id: 3,
    name: "Arched Floor Lamp",
    brand: "Design Within Reach",
    price: 549,
    originalPrice: 649,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    description: "Curved brass standing light",
    affiliateLink: "https://www.dwr.com/?utm_source=renovai&utm_medium=affiliate&utm_campaign=interior_design",
    inStock: false,
    featured: false,
    commissionRate: 10,
    regions: {
      US: { price: 549, currency: 'USD', link: 'https://www.dwr.com/?utm_source=renovai&utm_medium=affiliate&utm_campaign=interior_design' },
      UK: { price: 465, currency: 'GBP', link: 'https://www.dwr.co.uk/?utm_source=renovai&utm_medium=affiliate&utm_campaign=interior_design' },
      CA: { price: 729, currency: 'CAD', link: 'https://www.dwr.ca/?utm_source=renovai&utm_medium=affiliate&utm_campaign=interior_design' }
    }
  },
  {
    id: 4,
    name: "Designer Cushion Set",
    brand: "Restoration Hardware",
    price: 189,
    originalPrice: 249,
    rating: 4.7,
    reviews: 412,
    image: "https://images.unsplash.com/photo-1498300439093-c8a43e9e8e26?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    description: "Luxury accent pillows",
    affiliateLink: "https://rh.com/?utm_source=renovai&utm_medium=affiliate&utm_campaign=interior_design",
    inStock: true,
    featured: true,
    commissionRate: 12,
    regions: {
      US: { price: 189, currency: 'USD', link: 'https://rh.com/?utm_source=renovai&utm_medium=affiliate&utm_campaign=interior_design' },
      UK: { price: 159, currency: 'GBP', link: 'https://rh.com/?utm_source=renovai&utm_medium=affiliate&utm_campaign=interior_design' },
      CA: { price: 249, currency: 'CAD', link: 'https://rh.com/?utm_source=renovai&utm_medium=affiliate&utm_campaign=interior_design' }
    }
  }
];

export default function ProductShowcase() {
  const [userRegion, setUserRegion] = useState<'US' | 'UK' | 'CA'>('US');
  const [currencySymbol, setCurrencySymbol] = useState('$');

  useEffect(() => {
    // Detect user location using geolocation API
    const detectLocation = async () => {
      try {
        // First try to get location via IP geolocation service
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_code === 'GB') {
          setUserRegion('UK');
          setCurrencySymbol('£');
        } else if (data.country_code === 'CA') {
          setUserRegion('CA');
          setCurrencySymbol('C$');
        } else {
          setUserRegion('US');
          setCurrencySymbol('$');
        }
      } catch (error) {
        // Fallback to browser language detection
        const language = navigator.language || navigator.languages[0];
        if (language.includes('en-GB')) {
          setUserRegion('UK');
          setCurrencySymbol('£');
        } else if (language.includes('en-CA')) {
          setUserRegion('CA');
          setCurrencySymbol('C$');
        } else {
          setUserRegion('US');
          setCurrencySymbol('$');
        }
      }
    };

    detectLocation();
  }, []);

  const handleProductClick = (product: typeof FEATURED_PRODUCTS[0]) => {
    // Use region-specific link and track affiliate click
    const regionData = product.regions[userRegion];
    const link = regionData?.link || product.affiliateLink;
    const estimatedCommission = (getProductPrice(product) * product.commissionRate) / 100;
    
    // Track affiliate click for analytics and commission calculation
    console.log(`Affiliate click tracked: ${product.name} - ${product.brand} (${userRegion})`);
    console.log(`Estimated commission: ${currencySymbol}${estimatedCommission.toFixed(2)} (${product.commissionRate}%)`);
    
    // Send tracking data to analytics
    const trackingData = {
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      price: getProductPrice(product),
      currency: currencySymbol,
      region: userRegion,
      commissionRate: product.commissionRate,
      estimatedCommission: estimatedCommission,
      timestamp: new Date().toISOString(),
      clickSource: 'product_showcase'
    };
    
    // In production, this would send to your analytics service
    // fetch('/api/analytics/affiliate-click', { method: 'POST', body: JSON.stringify(trackingData) });
    
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const getProductPrice = (product: typeof FEATURED_PRODUCTS[0]) => {
    const regionData = product.regions[userRegion];
    return regionData ? regionData.price : product.price;
  };

  const getProductOriginalPrice = (product: typeof FEATURED_PRODUCTS[0]) => {
    if (!product.originalPrice) return null;
    // Calculate regional original price based on the ratio
    const regionData = product.regions[userRegion];
    if (regionData) {
      const ratio = regionData.price / product.price;
      return Math.round(product.originalPrice * ratio);
    }
    return product.originalPrice;
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-amber-100 text-amber-800 border-amber-200 font-medium">
            <ShoppingCart className="w-3 h-3 mr-2" />
            CURATED DESIGN MARKETPLACE
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6" style={{ fontFamily: 'Playfair Display' }}>
            Shop Your AI Designs
          </h2>
          
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Bring your AI-generated room designs to life with carefully curated furniture and decor from premium brands.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURED_PRODUCTS.map((product) => (
            <div 
              key={product.id} 
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
              onClick={() => handleProductClick(product)}
            >
              {product.featured && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-amber-400 text-neutral-900 font-semibold">
                    FEATURED
                  </Badge>
                </div>
              )}
              
              <div className="relative overflow-hidden h-64">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Added to wishlist: ${product.name}`);
                      }}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary" className="bg-white text-neutral-900">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col h-48">
                <div className="mb-3 flex-grow">
                  <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide h-4">{product.brand}</p>
                  <h3 className="text-base font-semibold text-neutral-900 group-hover:text-amber-600 transition-colors leading-tight h-12 overflow-hidden">
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed h-8 overflow-hidden">{product.description}</p>
                </div>

                <div className="flex items-center mb-3 h-5">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-sm text-neutral-700 ml-1 font-medium">{product.rating}</span>
                    <span className="text-sm text-neutral-500 ml-1">({product.reviews})</span>
                  </div>
                </div>

                <div className="space-y-3 mt-auto">
                  <div className="flex items-center space-x-2 h-6">
                    <span className="text-xl font-bold text-neutral-900">
                      {currencySymbol}{getProductPrice(product)}
                    </span>
                    {getProductOriginalPrice(product) && (
                      <span className="text-sm text-neutral-500 line-through">
                        {currencySymbol}{getProductOriginalPrice(product)}
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs px-4 py-2 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product);
                    }}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Shop Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200">
            <h3 className="text-2xl font-semibold text-neutral-900 mb-4">Affiliate Revenue Model</h3>
            <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
              <strong>How we earn:</strong> When users purchase through our links, we receive commissions from retailers. 
              To activate this, you must join each brand's affiliate program and replace demo links with your tracking codes.
            </p>
            
            <div className="bg-white rounded-xl p-6 mb-6 border border-neutral-200">
              <h4 className="text-lg font-semibold text-neutral-900 mb-3">Required Affiliate Program Enrollments:</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="text-left">
                  <p><strong>West Elm:</strong> westelm.com/affiliate-program</p>
                  <p><strong>CB2:</strong> cb2.com/customer-service/affiliate-program</p>
                </div>
                <div className="text-left">
                  <p><strong>Design Within Reach:</strong> dwr.com/affiliate-program</p>
                  <p><strong>Restoration Hardware:</strong> rh.com/affiliate</p>
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-3">
                Replace current demo links with your unique affiliate tracking codes from each program
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-1">Shop & Earn</h4>
                <p className="text-sm text-neutral-600">5% cashback on purchases</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-1">Refer Friends</h4>
                <p className="text-sm text-neutral-600">10% of their first order</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-1">VIP Access</h4>
                <p className="text-sm text-neutral-600">Early access to sales</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}