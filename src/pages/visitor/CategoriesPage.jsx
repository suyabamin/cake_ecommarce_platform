import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../../firebase/services';
import { Cake, ArrowRight } from 'lucide-react';
import ImageWithFallback from '../../components/common/ImageWithFallback';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCats() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error('Categories load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block">
          Boutique Categories
        </span>
        <h1 className="font-serif-title font-bold text-4xl text-gray-900">
          Handcrafted Cake Collections
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          From multi-tiered wedding romance to fun birthday sprinkle cakes and rich Belgian chocolate truffles. Find your perfect flavor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/cakes?category=${cat.id}`}
            className="group glass-card rounded-3xl overflow-hidden border border-rose-100/90 hover:border-rose-300 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
          >
            <div className="overflow-hidden relative">
              <ImageWithFallback
                src={cat.image}
                alt={cat.name}
                aspectRatio="aspect-[16/10]"
                className="group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <h3 className="absolute bottom-4 left-4 font-serif-title font-bold text-xl text-white">
                {cat.name}
              </h3>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                {cat.description}
              </p>

              <div className="pt-3 border-t border-rose-100 flex items-center justify-between text-xs font-bold text-rose-600 group-hover:text-rose-700">
                <span>Browse {cat.name}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
