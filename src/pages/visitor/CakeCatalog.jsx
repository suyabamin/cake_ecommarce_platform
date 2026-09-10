import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import CakeGrid from '../../components/cake/CakeGrid';
import CakeFilterPanel from '../../components/cake/CakeFilterPanel';
import { fetchCakes, fetchCategories } from '../../firebase/services';
import { Cake, SlidersHorizontal } from 'lucide-react';

export default function CakeCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState(250);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [cakesData, catData] = await Promise.all([
          fetchCakes(),
          fetchCategories()
        ]);
        setCakes(cakesData);
        setCategories(catData);
      } catch (err) {
        console.error('Catalog load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Update URL params when search or category changes
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [searchParams]);

  const filteredCakes = useMemo(() => {
    return cakes.filter((cake) => {
      // Category filter
      if (selectedCategory !== 'all' && cake.categoryId !== selectedCategory) {
        return false;
      }
      // Price filter
      const effectivePrice = cake.discountPrice || cake.price;
      if (effectivePrice > priceRange) {
        return false;
      }
      // Search keyword filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = cake.name?.toLowerCase().includes(q);
        const matchesDesc = cake.description?.toLowerCase().includes(q);
        const matchesFlavor = cake.flavor?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesFlavor) return false;
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      // Default: popular / featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [cakes, selectedCategory, priceRange, sortBy, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setPriceRange(250);
    setSortBy('popular');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Catalog Header */}
      <div className="bg-gradient-to-r from-rose-100/60 via-pink-50 to-rose-100/60 rounded-3xl p-8 border border-rose-200/60 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-rose-600 block mb-1">
            Boutique Collection
          </span>
          <h1 className="font-serif-title font-bold text-3xl sm:text-4xl text-gray-900">
            Handcrafted Artisan Cakes
          </h1>
          <p className="text-xs text-gray-600 mt-2 max-w-xl">
            Browse our full range of luxury birthday cakes, wedding tiers, cheesecakes, and pastries. Order online with requested doorstep delivery dates.
          </p>
        </div>

        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="md:hidden px-4 py-2.5 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center gap-2 shadow"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters ({filteredCakes.length})</span>
        </button>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className={`md:block ${showMobileFilter ? 'block' : 'hidden'}`}>
          <CakeFilterPanel
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(id) => { setSelectedCategory(id); setSearchParams(id !== 'all' ? { category: id } : {}); }}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            searchQuery={searchQuery}
            onSearchChange={(q) => { setSearchQuery(q); setSearchParams(q ? { search: q } : {}); }}
            onReset={handleResetFilters}
          />
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 pb-2">
            <span>Showing <strong>{filteredCakes.length}</strong> cakes</span>
            {selectedCategory !== 'all' && (
              <span className="font-semibold text-rose-600">Category Filter Active</span>
            )}
          </div>

          <CakeGrid cakes={filteredCakes} loading={loading} />
        </div>

      </div>

    </div>
  );
}
