import React from 'react';
import { useTravel } from '../context/TravelContext';
import { X } from 'lucide-react';

const SERVICE_GRID_CONFIG = [
  { id: 'stay', name: 'Accommodation', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop&q=80' },
  { id: 'food', name: 'Restaurants & Cafes', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=80' },
  { id: 'fuel', name: 'Fuel Stations', image: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=400&auto=format&fit=crop&q=80' },
  { id: 'ev', name: 'EV Charging Points', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&auto=format&fit=crop&q=80' },
  { id: 'service', name: 'Vehicle Mechanics', image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&auto=format&fit=crop&q=80' },
  { id: 'towing', name: 'Towing & Rescue', image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=80' },
  { id: 'medical', name: 'Medical & Pharmacies', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&auto=format&fit=crop&q=80' },
  { id: 'transport', name: 'Public Transport & Transit', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&auto=format&fit=crop&q=80' },
  { id: 'explore', name: 'Tourist Attractions', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80' },
  { id: 'parking', name: 'Parking Spaces', image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&auto=format&fit=crop&q=80' },
  { id: 'restroom', name: 'Restrooms & Washrooms', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80' },
  { id: 'atm', name: 'ATMs & Banking', image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=400&auto=format&fit=crop&q=80' },
  { id: 'rental', name: 'Bike & Vehicle Rentals', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&auto=format&fit=crop&q=80' },
  { id: 'essentials', name: 'Essentials & Supermarkets', image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&auto=format&fit=crop&q=80' }
];

export default function AllServicesModal() {
  const { isAllServicesModalOpen, setIsAllServicesModalOpen, categoryCounts, setSelectedCategory, radiusKm } = useTravel();

  if (!isAllServicesModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h3 className="text-lg font-bold text-slate-100 font-display">Services Near You</h3>
            <p className="text-xs text-slate-400 mt-0.5">Calculated in real-time within {radiusKm} km radius</p>
          </div>
          <button
            onClick={() => setIsAllServicesModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Grid with Real Pictures */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 overflow-y-auto">
          {SERVICE_GRID_CONFIG.map((item) => {
            const count = categoryCounts[item.id] ?? 0;

            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedCategory(item.id);
                  setIsAllServicesModalOpen(false);
                }}
                className="relative h-24 rounded-2xl overflow-hidden border border-slate-800 hover:border-sky-500 transition-all cursor-pointer group shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent p-3.5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors font-display">
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-slate-300">Tap to filter map & list</span>
                  </div>

                  <div className="text-base font-extrabold text-white font-display px-3 py-1 rounded-xl bg-sky-600/90 border border-sky-400/50 backdrop-blur-md shadow-md">
                    {count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setIsAllServicesModalOpen(false);
            }}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-lg"
          >
            Show All Services ({categoryCounts.all || 0})
          </button>
        </div>

      </div>
    </div>
  );
}
