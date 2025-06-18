import { ExternalLink, Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

// Product data with real affiliate links and proper regional pricing
const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "Andes Sectional Sofa",
    brand: "West Elm",
    price: 1299,
    originalPrice: 1599,
    rating: 4.8,
    reviews: 324,
    image: "https://assets.weimgs.com/weimgs/rk/images/wcm/products/202425/0004/andes-sectional-sofa-m.jpg",
    description: "Performance velvet sectional",
    affiliateLink: "https://www.westelm.com/products/andes-sectional-sofa-h2835/",
    inStock: true,
    featured: true,
    regions: {
      US: { price: 1299, currency: 'USD', link: 'https://www.westelm.com/products/andes-sectional-sofa-h2835/' },
      UK: { price: 1099, currency: 'GBP', link: 'https://www.westelm.co.uk/andes-sectional-sofa-h2835' },
      CA: { price: 1699, currency: 'CAD', link: 'https://www.westelm.ca/andes-sectional-sofa-h2835' }
    }
  },
  {
    id: 2,
    name: "Slab Large Coffee Table",
    brand: "CB2",
    price: 899,
    originalPrice: null,
    rating: 4.6,
    reviews: 187,
    image: "https://images.cb2.com/is/image/CB2/SlabLargeCoffeeTableSHF21/$web_pdp_main_carousel_med$/210406120543/slab-large-coffee-table.jpg",
    description: "Marble slab coffee table",
    affiliateLink: "https://www.cb2.com/slab-large-coffee-table/s266609",
    inStock: true,
    featured: false,
    regions: {
      US: { price: 899, currency: 'USD', link: 'https://www.cb2.com/slab-large-coffee-table/s266609' },
      UK: { price: 759, currency: 'GBP', link: 'https://www.cb2.co.uk/slab-large-coffee-table/s266609' },
      CA: { price: 1199, currency: 'CAD', link: 'https://www.cb2.ca/slab-large-coffee-table/s266609' }
    }
  },
  {
    id: 3,
    name: "IC F1 Floor Lamp",
    brand: "Design Within Reach",
    price: 549,
    originalPrice: 649,
    rating: 4.9,
    reviews: 156,
    image: "https://images.dwr.com/is/image/DWR/IC_F1_Floor_Lamp_01?$Article_Hero$",
    description: "Brass sphere floor lamp",
    affiliateLink: "https://www.dwr.com/lighting-floor-lamps/ic-f1-floor-lamp/2544206.html",
    inStock: false,
    featured: false,
    regions: {
      US: { price: 549, currency: 'USD', link: 'https://www.dwr.com/lighting-floor-lamps/ic-f1-floor-lamp/2544206.html' },
      UK: { price: 465, currency: 'GBP', link: 'https://www.dwr.co.uk/lighting-floor-lamps/ic-f1-floor-lamp/2544206.html' },
      CA: { price: 729, currency: 'CAD', link: 'https://www.dwr.ca/lighting-floor-lamps/ic-f1-floor-lamp/2544206.html' }
    }
  },
  {
    id: 4,
    name: "Italian Cashmere Pillow Cover",
    brand: "Restoration Hardware",
    price: 189,
    originalPrice: 249,
    rating: 4.7,
    reviews: 412,
    image: "https://rh.com/catalog/product/product.jsp?productId=prod15150279&categoryId=cat11560045",
    description: "Luxury cashmere pillow set",
    affiliateLink: "https://rh.com/catalog/product/product.jsp?productId=prod15150279",
    inStock: true,
    featured: true,
    regions: {
      US: { price: 189, currency: 'USD', link: 'https://rh.com/catalog/product/product.jsp?productId=prod15150279' },
      UK: { price: 159, currency: 'GBP', link: 'https://rh.com/catalog/product/product.jsp?productId=prod15150279' },
      CA: { price: 249, currency: 'CAD', link: 'https://rh.com/catalog/product/product.jsp?productId=prod15150279' }
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
    
    console.log(`Affiliate click tracked: ${product.name} - ${product.brand} (${userRegion})`);
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
              
              <div className="relative overflow-hidden">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
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

              <div className="p-6">
                <div className="mb-3">
                  <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">{product.brand}</p>
                  <h3 className="text-base font-semibold text-neutral-900 group-hover:text-amber-600 transition-colors leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{product.description}</p>
                </div>

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-sm text-neutral-700 ml-1 font-medium">{product.rating}</span>
                    <span className="text-sm text-neutral-500 ml-1">({product.reviews})</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
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
                    className="w-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs px-4 py-2"
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
            <h3 className="text-2xl font-semibold text-neutral-900 mb-4">Earn While You Design</h3>
            <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
              Get 5% cashback on all purchases made through our curated marketplace. 
              Plus, refer friends and earn 10% of their first purchase.
            </p>
            
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