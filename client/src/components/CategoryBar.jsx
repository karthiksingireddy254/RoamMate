import React from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  Fuel, Zap, Wrench, Truck, Car, Bike, Compass, LayoutGrid
} from 'lucide-react';

const VEHICLE_CATEGORIES = [
  { id: 'all', label: 'All Vehicle Services', icon: Compass, color: 'text-sky-400', bg: 'bg-sky-950/60 border-sky-800' },
  { id: 'fuel', label: 'Fuel Stations', icon: Fuel, color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-800' },
  { id: 'ev', label: 'EV Fast Chargers', icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-950/60 border-cyan-800' },
  { id: 'service', label: 'Mechanic & Garages', icon: Wrench, color: 'text-slate-300', bg: 'bg-slate-900 border-slate-700' },
  { id: 'towing', label: 'Breakdown Towing', icon: Truck, color: 'text-purple-400', bg: 'bg-purple-950/60 border-purple-800' },
  { id: 'parking', label: 'Vehicle Parking', icon: Car, color: 'text-blue-400', bg: 'bg-blue-950/60 border-blue-800' },
  { id: 'rental', label: 'Bike & Car Rentals', icon: Bike, color: 'text-indigo-400', bg: 'bg-indigo-950/60 border-indigo-800' }
];

export default function CategoryBar() {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    categoryCounts,
    setIsAllServicesModalOpen,
    requireAuth
  } = useTravel();

  return (
    <div className="bg-slate-950/90 border-b border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar z-30">
      
      {/* Category Pills (Vehicle Services Only) */}
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
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-sky-600 to-emerald-600 border-sky-400 text-white shadow-lg shadow-sky-600/30 scale-105'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : cat.color}`} />
              <span>{cat.label}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
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
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-sky-950 border border-sky-700 text-sky-300 hover:bg-sky-900 transition-all shrink-0 cursor-pointer shadow-md"
        title="View All 6 Vehicle Service Categories"
      >
        <LayoutGrid className="w-3.5 h-3.5 text-sky-400" />
        <span className="hidden sm:inline">All Vehicle Services</span>
      </button>

    </div>
  );
}
