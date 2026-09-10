import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Heart, Award, Truck, ShieldCheck, 
  Cake, ChevronRight, Star, Quote, Clock 
} from 'lucide-react';
import { fetchCakes, fetchCategories, fetchSiteContent } from '../../firebase/services';
import CakeCard from '../../components/cake/CakeCard';
import RatingStars from '../../components/common/RatingStars';
import ImageWithFallback from '../../components/common/ImageWithFallback';

export default function Home() {
  const [featuredCakes, setFeaturedCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [siteContent, setSiteContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [cakesData, catData, contentData] = await Promise.all([
          fetchCakes(),
          fetchCategories(),
          fetchSiteContent()
        ]);
        setFeaturedCakes(cakesData.slice(0, 6));
        setCategories(catData);
        setSiteContent(contentData);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  // Filter active slider images
  const activeSliderImages = React.useMemo(() => {
    if (!siteContent?.sliderImages || !Array.isArray(siteContent.sliderImages)) return [];
    return siteContent.sliderImages.filter(s => s.active !== false && s.imageUrl);
  }, [siteContent]);

  // 1-second frontend interval rotation loop (ZERO Firestore reads per second!)
  useEffect(() => {
    if (activeSliderImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % activeSliderImages.length);
    }, 1000); // EXACTLY 1 SECOND (1000 milliseconds)

    return () => clearInterval(timer);
  }, [activeSliderImages.length]);

  // Background preload next slide for smooth zero-flicker rotation
  useEffect(() => {
    if (activeSliderImages.length > 1) {
      const nextIndex = (currentSlideIndex + 1) % activeSliderImages.length;
      const nextUrl = activeSliderImages[nextIndex]?.imageUrl;
      if (nextUrl) {
        const img = new Image();
        img.src = nextUrl;
      }
    }
  }, [currentSlideIndex, activeSliderImages]);

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-rose-200/50 rounded-full blur-3xl -z-10 animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/80 border border-rose-200 text-rose-800 text-xs font-semibold shadow-sm animate-bounce-subtle">
                <Sparkles className="w-4 h-4 text-rose-600" />
                <span>{siteContent?.bannerText || '✨ Special 15% OFF on Rose Gold Dream Cakes'}</span>
              </div>

              <h1 className="font-serif-title font-bold text-4xl sm:text-5xl lg:text-6xl text-gray-900 leading-tight tracking-tight">
                {siteContent?.heroTitle || (
                  <>Artisanal <span className="text-rose-600 underline decoration-rose-200 decoration-wavy">Pink Boutique</span> Cakes for Magical Moments</>
                )}
              </h1>

              <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {siteContent?.heroSubtitle || 'Handcrafted luxury birthday, wedding, and celebration cakes baked fresh daily with Madagascar vanilla and 70% dark Belgian chocolate.'}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/cakes"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-sm shadow-xl shadow-rose-200 hover:from-rose-600 hover:to-pink-700 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <span>Explore Cake Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/categories"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-gray-800 font-bold text-sm border border-rose-200 hover:bg-rose-50 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Browse Categories</span>
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-rose-100/80 text-center lg:text-left">
                <div>
                  <span className="font-serif-title font-bold text-2xl text-rose-600">100%</span>
                  <span className="block text-xs text-gray-500 font-medium">Fresh Daily</span>
                </div>
                <div>
                  <span className="font-serif-title font-bold text-2xl text-rose-600">4.9★</span>
                  <span className="block text-xs text-gray-500 font-medium">5,000+ Reviews</span>
                </div>
                <div>
                  <span className="font-serif-title font-bold text-2xl text-rose-600">Doorstep</span>
                  <span className="block text-xs text-gray-500 font-medium">Safe Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Graphics Hero Banner / Image Slider */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {activeSliderImages.length > 0 ? (
                  /* DYNAMIC 1-SECOND ROTATING SLIDER */
                  <div className="glass-card rounded-[2.5rem] p-4 border border-rose-200/80 shadow-2xl overflow-hidden transform hover:scale-[1.01] transition duration-500 relative aspect-[4/3]">
                    {activeSliderImages.map((slide, idx) => (
                      <div
                        key={slide.id || idx}
                        className={`absolute inset-4 transition-opacity duration-500 ease-in-out ${
                          idx === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                      >
                        <img
                          src={slide.imageUrl}
                          alt={slide.title || `Boutique Cake Slide ${idx + 1}`}
                          className="w-full h-full object-cover rounded-[2rem] shadow-inner"
                          loading={idx === 0 ? "eager" : "lazy"}
                        />
                      </div>
                    ))}

                    {/* Pagination Indicators */}
                    {activeSliderImages.length > 1 && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                        {activeSliderImages.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentSlideIndex(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              i === currentSlideIndex ? 'w-5 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* GRACEFUL FALLBACK STATIC HERO IMAGE */
                  <div className="glass-card rounded-[2.5rem] p-4 border border-rose-200/80 shadow-2xl overflow-hidden transform hover:scale-[1.01] transition duration-500">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1000&q=80"
                      alt="Boutique Pink Cake"
                      aspectRatio="aspect-[4/3]"
                      className="rounded-[2rem]"
                    />
                  </div>
                )}

                {/* Floating Highlight Card */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-rose-100 flex items-center gap-3 animate-slide-up z-30">
                  <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                    🎂
                  </div>
                  <div>
                    <h4 className="font-serif-title font-bold text-xs text-gray-900">Rose Gold Dream</h4>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" /> 4.9 (28 reviews)
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-1">Our Collection</span>
            <h2 className="font-serif-title font-bold text-3xl sm:text-4xl text-gray-900">Explore Cake Categories</h2>
          </div>
          <Link to="/categories" className="mt-4 md:mt-0 text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1">
            View All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/cakes?category=${cat.id}`}
              className="group glass-card rounded-3xl p-4 text-center border border-rose-100 hover:border-rose-300 hover:shadow-lg transition-all duration-300 flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden mb-3 border border-rose-200 group-hover:scale-105 transition duration-300">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-serif-title font-bold text-xs text-gray-900 group-hover:text-rose-600 transition line-clamp-1">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED CAKES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-1">Chef's Selection</span>
            <h2 className="font-serif-title font-bold text-3xl sm:text-4xl text-gray-900">Featured Boutique Cakes</h2>
          </div>
          <Link to="/cakes" className="mt-4 md:mt-0 text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1">
            View Entire Shop <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCakes.map((cake) => (
            <CakeCard key={cake.id} cake={cake} />
          ))}
        </div>
      </section>

      {/* HOW ORDERING WORKS */}
      <section className="bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 text-white py-16 rounded-[3rem] max-w-7xl mx-auto px-6 lg:px-12 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest opacity-80 block mb-2">Seamless Process</span>
          <h2 className="font-serif-title font-bold text-3xl sm:text-4xl">How Ordering Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center relative">
          {[
            { step: '01', title: 'Pick Your Cake', desc: 'Browse handcrafted designs or choose custom piping & candles.', icon: Cake },
            { step: '02', title: 'Select Delivery Date', desc: 'Pick your preferred date & time slot at checkout.', icon: Clock },
            { step: '03', title: 'Bakery Review', desc: 'Our pastry chef approves slot or coordinates date via chat.', icon: Sparkles },
            { step: '04', title: 'Doorstep Delivery', desc: 'Receive your fresh cake in temperature-controlled vans.', icon: Truck }
          ].map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl mb-1 shadow">
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-rose-200 uppercase">Step {s.step}</span>
                <h3 className="font-serif-title font-bold text-lg">{s.title}</h3>
                <p className="text-xs text-rose-100 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* REVIEWS & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-1">Customer Love</span>
          <h2 className="font-serif-title font-bold text-3xl sm:text-4xl text-gray-900">What Our Guests Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Victoria Hastings',
              role: 'Bride',
              review: 'The Floral Bridal Tier was breathtaking! Every guest commented on how delicious and moist the vanilla bean buttercream was.',
              rating: 5
            },
            {
              name: 'Jonathan Miller',
              role: 'Verified Customer',
              review: 'The delivery date negotiation feature was super handy. They adjusted my slot seamlessly and delivered right on time.',
              rating: 5
            },
            {
              name: 'Camila Rodriguez',
              role: 'Birthday Party Host',
              review: 'Rose Gold Dream cake made my daughter’s birthday magical. Packaging was elegant and temperature stayed perfect.',
              rating: 5
            }
          ].map((rev, idx) => (
            <div key={idx} className="glass-card rounded-3xl p-6 border border-rose-100 space-y-4">
              <Quote className="w-8 h-8 text-rose-300" />
              <p className="text-xs text-gray-600 italic leading-relaxed">{rev.review}</p>
              <div className="pt-3 border-t border-rose-50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-xs">{rev.name}</h4>
                  <span className="text-[10px] text-gray-400">{rev.role}</span>
                </div>
                <RatingStars rating={rev.rating} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
