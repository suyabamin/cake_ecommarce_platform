import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';

export default function CakeFilterPanel({
  categories,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  onReset
}) {
  return (
    <aside className="glass-card rounded-3xl p-6 border border-rose-100/80 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-rose-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-rose-600" />
          <h3 className="font-serif-title font-bold text-gray-900 text-base">Filter Cakes</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Search Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Search Keyword
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search flavor, name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-rose-500"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Categories
        </label>
        <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-rose-600 text-white font-bold shadow-sm'
                : 'text-gray-700 hover:bg-rose-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex justify-between items-center ${
                selectedCategory === cat.id
                  ? 'bg-rose-600 text-white font-bold shadow-sm'
                  : 'text-gray-700 hover:bg-rose-50'
              }`}
            >
              <span className="truncate">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Max Price
          </label>
          <span className="text-xs font-bold text-rose-600">${priceRange}</span>
        </div>
        <input
          type="range"
          min="20"
          max="250"
          step="5"
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-rose-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>$20</span>
          <span>$250</span>
        </div>
      </div>

      {/* Sort By Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Sort Results By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-rose-500"
        >
          <option value="popular">Popularity & Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Customer Rating</option>
          <option value="newest">Newest Arrivals</option>
        </select>
      </div>

    </aside>
  );
}
