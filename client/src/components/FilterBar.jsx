import React from 'react';
import { Search, Filter, Building2 } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Tech & Hardware',
  'Badges & Access',
  'Audio & Gadgets',
  'Personal & Apparel',
  'Documents & Wallets',
  'Other',
];

const BUILDINGS = ['All', 'HQ Building 1', 'Tower A', 'Tower B', 'Building 2 - Tech Park'];

const FilterBar = ({ filters, setFilters }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-emerald-900/10 shadow-sm space-y-4 mb-6">
      
      {/* Top Row: Feed Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Dual Feed Toggle Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
          {['All', 'Lost', 'Found'].map((type) => (
            <button
              key={type}
              onClick={() => setFilters({ ...filters, type })}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-md text-xs font-bold transition ${
                filters.type === type
                  ? type === 'Lost'
                    ? 'bg-red-600 text-white shadow-sm'
                    : type === 'Found'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-950'
              }`}
            >
              {type === 'All' ? 'All Items' : `${type} Items`}
            </button>
          ))}
        </div>

        {/* Instant Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search item, room, or desk..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Bottom Row: Multi-Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
        
        {/* Category Dropdown */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-emerald-800/70" />
          <span className="font-semibold text-slate-700">Category:</span>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="border border-slate-200 rounded-md px-2 py-1 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-600 text-slate-700 font-medium"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Building Dropdown */}
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-emerald-800/70" />
          <span className="font-semibold text-slate-700">Facility:</span>
          <select
            value={filters.building}
            onChange={(e) => setFilters({ ...filters, building: e.target.value })}
            className="border border-slate-200 rounded-md px-2 py-1 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-600 text-slate-700 font-medium"
          >
            {BUILDINGS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Active only checkbox */}
        <label className="flex items-center gap-1.5 ml-auto text-slate-600 hover:text-slate-900 cursor-pointer font-medium">
          <input
            type="checkbox"
            checked={filters.hideReturned}
            onChange={(e) => setFilters({ ...filters, hideReturned: e.target.checked })}
            className="rounded text-emerald-600 focus:ring-emerald-600 accent-emerald-600"
          />
          <span>Hide Returned</span>
        </label>
      </div>

    </div>
  );
};

export default FilterBar;
