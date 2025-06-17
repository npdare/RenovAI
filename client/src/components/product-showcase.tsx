import { ExternalLink, Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "Mid-Century Modern Sofa",
    brand: "West Elm",
    price: 1299,
    originalPrice: 1599,
    rating: 4.8,
    reviews: 324,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    description: "Premium velvet upholstery with solid wood legs",
    affiliateLink: "https://www.westelm.com/products/mid-century-sofa",
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: "Marble Coffee Table",
    brand: "CB2",
    price: 899,
    originalPrice: null,
    rating: 4.6,
    reviews: 187,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    description: "Carrara marble top with brass accents",
    affiliateLink: "https://www.cb2.com/marble-coffee-table",
    inStock: true,
    featured: false
  },
  {
    id: 3,
    name: "Scandinavian Floor Lamp",
    brand: "Design Within Reach",
    price: 549,
    originalPrice: 649,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    description: "Minimalist oak base with linen shade",
    affiliateLink: "https://www.dwr.com/lighting-floor-lamps",
    inStock: false,
    featured: false
  },
  {
    id: 4,
    name: "Luxury Throw Pillows Set",
    brand: "Restoration Hardware",
    price: 189,
    originalPrice: 249,
    rating: 4.7,
    reviews: 412,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    description: "Hand-woven cashmere blend, set of 3",
    affiliateLink: "https://rh.com/catalog/category/products.jsp",
    inStock: true,
    featured: true
  }
];

export default function ProductShowcase() {
  const handleProductClick = (product: typeof FEATURED_PRODUCTS[0]) => {
    // Track affiliate click for analytics
    console.log(`Affiliate click tracked: ${product.name} - ${product.brand}`);
    window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
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
                  <p className="text-sm text-neutral-500 font-medium">{product.brand}</p>
                  <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-amber-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1">{product.description}</p>
                </div>

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-sm text-neutral-700 ml-1 font-medium">{product.rating}</span>
                    <span className="text-sm text-neutral-500 ml-1">({product.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-neutral-900">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-neutral-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="bg-neutral-900 text-white hover:bg-neutral-800 text-xs px-4"
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