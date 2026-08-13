import React from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  Fuel, Zap, Wrench, Truck, Car, Bike, Compass, LayoutGrid
} from 'lucide-react';

const VEHICLE_CATEGORIES = [
  { id: 'all', label: 'All Vehicle Services', icon: Compass, color: 'text-sky-500' },
  { id: 'service', label: 'Mechanic & Repair Garages', icon: Wrench, color: 'text-slate-600' },
  { id: 'towing', label: 'Breakdown Towing & Rescue', icon: Truck, color: 'text-purple-600' },
  { id: 'fuel', label: 'Fuel & Gas Stations', icon: Fuel, color: 'text-emerald-600' },
  { id: 'ev', label: 'EV Fast Chargers', icon: Zap, color: 'text-cyan-600' },
  { id: 'parking', label: 'Vehicle Parking', icon: Car, color: 'text-blue-600' },
  { id: 'rental', label: 'Bike & Car Rentals', icon: Bike, color: 'text-indigo-600' }
];

export default function CategoryBar() {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    categoryCounts,
    setIsAllServicesModalOpen,
    requireAuth,
    theme
  } = useTravel();

  const isLight = theme === 'light';

  return (
    <div className={`px-3 sm:px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar z-30 border-b transition-colors ${
      isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-950/90 border-slate-800'
    }`}>
      
      {/* Vehicle Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {VEHICLE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => {
                requireAuth(() => setSelectedCategory(cat.id), `Please sign in or create an account to view ${cat.label}.`);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-sky-600 to-emerald-600 border-sky-400 text-white shadow-lg shadow-sky-600/30 scale-105'
                  : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : cat.color}`} />
              <span>{cat.label}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isSelected ? 'bg-white/20 text-white' : isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* All Vehicle Services Modal Trigger */}
      <button
        onClick={() => {
          requireAuth(() => setIsAllServicesModalOpen(true), 'Please sign in or create an account to view all vehicle services.');
        }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer shadow-md ${
          isLight ? 'bg-sky-50 border border-sky-300 text-sky-700 hover:bg-sky-100' : 'bg-sky-950 border border-sky-700 text-sky-300 hover:bg-sky-900'
        }`}
        title="View All Vehicle Service Categories"
      >
        <LayoutGrid className="w-3.5 h-3.5 text-sky-500" />
        <span className="hidden sm:inline">All Vehicle Services</span>
      </button>

    </div>
  );
}
