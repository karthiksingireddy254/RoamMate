import React from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  Compass, Hotel, Utensils, Fuel, Zap, Wrench, Truck, Stethoscope, 
  Bus, Car, Coffee, CreditCard, ShoppingBag, Bike, Sparkles
} from 'lucide-react';

const CATEGORY_ITEMS = [
  { id: 'all', label: 'All', icon: Compass, activeClass: 'bg-gradient-to-r from-sky-600 to-emerald-600 text-white border-sky-400 shadow-sky-500/30' },
  { id: 'stay', label: 'Stay', icon: Hotel, activeClass: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-400 shadow-indigo-500/30' },
  { id: 'food', label: 'Food', icon: Utensils, activeClass: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-400 shadow-amber-500/30' },
  { id: 'fuel', label: 'Fuel', icon: Fuel, activeClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-emerald-500/30' },
  { id: 'ev', label: 'EV Charging', icon: Zap, activeClass: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-cyan-500/30' },
  { id: 'service', label: 'Mechanics', icon: Wrench, activeClass: 'bg-gradient-to-r from-slate-700 to-slate-800 text-white border-slate-400 shadow-slate-500/30' },
  { id: 'towing', label: 'Towing', icon: Truck, activeClass: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border-purple-400 shadow-purple-500/30' },
  { id: 'medical', label: 'Medical', icon: Stethoscope, activeClass: 'bg-gradient-to-r from-rose-600 to-red-600 text-white border-rose-400 shadow-rose-500/30' },
  { id: 'transport', label: 'Transport', icon: Bus, activeClass: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-blue-500/30' },
  { id: 'explore', label: 'Explore', icon: Sparkles, activeClass: 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white border-teal-400 shadow-teal-500/30' },
  { id: 'parking', label: 'Parking', icon: Car, activeClass: 'bg-gradient-to-r from-sky-600 to-blue-600 text-white border-sky-400 shadow-sky-500/30' },
  { id: 'restroom', label: 'Restrooms', icon: Coffee, activeClass: 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white border-amber-400 shadow-amber-500/30' },
  { id: 'atm', label: 'ATMs', icon: CreditCard, activeClass: 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white border-emerald-400 shadow-emerald-500/30' },
  { id: 'rental', label: 'Rentals', icon: Bike, activeClass: 'bg-gradient-to-r from-violet-600 to-purple-600 text-white border-violet-400 shadow-violet-500/30' },
  { id: 'essentials', label: 'Essentials', icon: ShoppingBag, activeClass: 'bg-gradient-to-r from-zinc-700 to-stone-800 text-white border-zinc-400 shadow-zinc-500/30' }
];

export default function CategoryBar() {
  const { selectedCategory, setSelectedCategory, categoryCounts, setIsAllServicesModalOpen, requireAuth } = useTravel();

  return (
    <div className="bg-slate-950/90 border-b border-slate-800/90 px-4 py-2 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar backdrop-blur-xl">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {CATEGORY_ITEMS.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              onClick={() => {
                requireAuth(() => setSelectedCategory(cat.id), `Please sign in or create an account to filter services by ${cat.label}.`);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border cursor-pointer shadow-md ${
                isSelected
                  ? `${cat.activeClass} scale-105 ring-2 ring-white/30`
                  : 'bg-slate-900/90 hover:bg-slate-850 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-sky-400'}`} />
              <span>{cat.label}</span>
              {count > 0 && (
                <span className={`ml-0.5 text-[10px] px-2 py-0.2 rounded-full font-black ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-sky-400 border border-slate-700'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => {
          requireAuth(() => setIsAllServicesModalOpen(true), 'Please sign in or create an account to view all services.');
        }}
        className="hidden md:flex items-center gap-1.5 text-xs font-extrabold text-sky-400 hover:text-sky-300 whitespace-nowrap pl-3 border-l border-slate-800 cursor-pointer"
      >
        <span>View All Services</span>
        <span className="text-[10px] bg-gradient-to-r from-sky-900 to-emerald-950 border border-sky-700 text-sky-300 px-2 py-0.5 rounded-md font-bold shadow-sm">
          {categoryCounts.all || 0}
        </span>
      </button>
    </div>
  );
}
