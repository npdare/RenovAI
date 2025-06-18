import { ExternalLink, Star, ChevronLeft, ChevronRight, ShoppingCart, Home, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

// Real design products for interior and exterior spaces
const DESIGN_PRODUCTS = [
  // Interior Products
  {
    id: 1,
    name: "Velvet Accent Chair",
    brand: "West Elm",
    price: 699,
    originalPrice: 899,
    rating: 4.8,
    reviews: 324,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    description: "Emerald green with brass legs",
    category: "Interior",
    productUrl: "https://www.westelm.com/products/andes-chair/",
    inStock: true
  },
  {
    id: 2,
    name: "Marble Dining Table",
    brand: "CB2",
    price: 1299,
    originalPrice: null,
    rating: 4.6,
    reviews: 187,
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    description: "Carrara marble with steel base",
    category: "Interior",
    productUrl: "https://www.cb2.com/marble-top-dining-table/",
    inStock: true
  },
  {
    id: 3,
    name: "Brass Arc Floor Lamp",
    brand: "Design Within Reach",
    price: 549,
    originalPrice: 649,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    description: "Mid-century modern design",
    category: "Interior",
    productUrl: "https://www.dwr.com/lighting-floor-lamps/",
    inStock: false
  },
  {
    id: 4,
    name: "Linen Throw Pillows",
    brand: "Restoration Hardware",
    price: 189,
    originalPrice: 249,
    rating: 4.7,
    reviews: 412,
    image: "https://images.unsplash.com/photo-1498300439093-c8a43e9e8e26?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    description: "Belgian linen in neutral tones",
    category: "Interior",
    productUrl: "https://rh.com/catalog/category/products.jsp?categoryId=cat1560023",
    inStock: true
  },
  // Exterior Products
  {
    id: 5,
    name: "Teak Outdoor Dining Set",
    brand: "West Elm",
    price: 1899,
    originalPrice: 2299,
    rating: 4.5,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    description: "Weather-resistant with cushions",
    category: "Exterior",
    productUrl: "https://www.westelm.com/shop/outdoor/outdoor-furniture/",
    inStock: true
  },
  {
    id: 6,
    name: "Modern Planter Collection",
    brand: "CB2",
    price: 299,
    originalPrice: null,
    rating: 4.4,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    description: "Ceramic planters in various sizes",
    category: "Exterior",
    productUrl: "https://www.cb2.com/outdoor/outdoor-decor/",
    inStock: true
  },
  {
    id: 7,
    name: "Outdoor String Lights",
    brand: "Design Within Reach",
    price: 149,
    originalPrice: 199,
    rating: 4.8,
    reviews: 445,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    description: "LED bistro lights with dimmer",
    category: "Exterior",
    productUrl: "https://www.dwr.com/outdoor/outdoor-lighting/",
    inStock: true
  },
  {
    id: 8,
    name: "Stone Fire Bowl",
    brand: "Restoration Hardware",
    price: 1299,
    originalPrice: 1599,
    rating: 4.6,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    description: "Natural stone with gas insert",
    category: "Exterior",
    productUrl: "https://rh.com/catalog/category/products.jsp?categoryId=cat160024",
    inStock: false
  },
  {
    id: 9,
    name: "Modular Sectional Sofa",
    brand: "West Elm",
    price: 2199,
    originalPrice: 2699,
    rating: 4.7,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    description: "Performance fabric with storage",
    category: "Interior",
    productUrl: "https://www.westelm.com/products/haven-sectional/",
    inStock: true
  },
  {
    id: 10,
    name: "Pergola with Retractable Shade",
    brand: "CB2",
    price: 3299,
    originalPrice: null,
    rating: 4.3,
    reviews: 34,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    description: "Aluminum frame with fabric canopy",
    category: "Exterior",
    productUrl: "https://www.cb2.com/outdoor/outdoor-furniture/pergolas/",
    inStock: true
  }
];

export default function ProductShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState(DESIGN_PRODUCTS);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Interior' | 'Exterior'>('All');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Filter products based on category
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProducts(DESIGN_PRODUCTS);
    } else {
      setFilteredProducts(DESIGN_PRODUCTS.filter(product => product.category === activeFilter));
    }
    setCurrentSlide(0);
  }, [activeFilter]);

  // Auto-slide effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % filteredProducts.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [filteredProducts.length, isAutoPlaying]);

  const handleProductClick = (product: typeof DESIGN_PRODUCTS[0]) => {
    window.open(product.productUrl, '_blank');
  };

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % filteredProducts.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
  };

  const getVisibleProducts = () => {
    const productsToShow = 4;
    const products = [];
    for (let i = 0; i < productsToShow; i++) {
      const index = (currentSlide + i) % filteredProducts.length;
      products.push(filteredProducts[index]);
    }
    return products;
  };

  const setFilter = (filter: 'All' | 'Interior' | 'Exterior') => {
    setActiveFilter(filter);
    setIsAutoPlaying(true);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-neutral-100 text-neutral-800 border-neutral-200 font-medium">
            <ShoppingCart className="w-3 h-3 mr-2" />
            CURATED DESIGN COLLECTION
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6" style={{ fontFamily: 'Inter' }}>
            Shop Your AI Designs
          </h2>
          
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Bring your AI-generated room designs to life with carefully curated furniture and decor for interior and exterior spaces.
          </p>

          {/* Category Filter */}
          <div className="flex justify-center space-x-4 mb-12">
            <Button
              variant={activeFilter === 'All' ? "default" : "outline"}
              onClick={() => setFilter('All')}
              className="px-6 py-2"
            >
              All Products
            </Button>
            <Button
              variant={activeFilter === 'Interior' ? "default" : "outline"}
              onClick={() => setFilter('Interior')}
              className="px-6 py-2"
            >
              <Home className="w-4 h-4 mr-2" />
              Interior
            </Button>
            <Button
              variant={activeFilter === 'Exterior' ? "default" : "outline"}
              onClick={() => setFilter('Exterior')}
              className="px-6 py-2"
            >
              <TreePine className="w-4 h-4 mr-2" />
              Exterior
            </Button>
          </div>
        </div>

        {/* Infinite Product Slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getVisibleProducts().map((product, index) => (
                <div 
                  key={`${product.id}-${index}`}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-neutral-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative overflow-hidden h-64">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary" className="bg-white text-neutral-900">
                          Out of Stock
                        </Badge>
                      </div>
                    )}

                    <div className="absolute top-4 right-4">
                      <Badge className="bg-neutral-900/80 text-white text-xs">
                        {product.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col h-48">
                    <div className="mb-3 flex-grow">
                      <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide h-4">{product.brand}</p>
                      <h3 className="text-base font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors leading-tight h-12 overflow-hidden">
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
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-neutral-500 line-through">
                            ${product.originalPrice}
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
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg border border-neutral-200 hover:bg-neutral-50 transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-600" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg border border-neutral-200 hover:bg-neutral-50 transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {filteredProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setIsAutoPlaying(false);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-neutral-900' : 'bg-neutral-300'
              }`}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200">
            <h3 className="text-2xl font-semibold text-neutral-900 mb-4">Premium Design Marketplace</h3>
            <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
              Shop premium furniture and decor from trusted design brands. Each piece is carefully curated to complement 
              your AI-generated designs for both interior and exterior spaces.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Home className="w-6 h-6 text-neutral-700" />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-2">Interior Design</h4>
                <p className="text-sm text-neutral-600">Furniture, lighting, and decor for every room</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TreePine className="w-6 h-6 text-neutral-700" />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-2">Exterior Spaces</h4>
                <p className="text-sm text-neutral-600">Outdoor furniture, lighting, and landscaping</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-neutral-700" />
                </div>
                <h4 className="font-semibold text-neutral-900 mb-2">Premium Quality</h4>
                <p className="text-sm text-neutral-600">Curated selection from top design brands</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}