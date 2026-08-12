import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { Sparkles, Star, MapPin, Navigation, Compass } from 'lucide-react';

export default function ExploreNearbyView() {
  const { nearbyServices, setSelectedService, radiusKm } = useTravel();
  const [sortBy, setSortBy] = useState('distance'); // 'distance' | 'rating' | 'popularity'

  const attractions = nearbyServices
    .filter(p => p.category === 'explore')
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'popularity') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      return (a.distanceKm || 0) - (b.distanceKm || 0);
    });

  return (
    <div className="w-full space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 border border-teal-800/60 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-slate-100 font-display">Explore Nearby Attractions</h3>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800 text-xs">
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-teal-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="distance" className="bg-slate-900 text-slate-100">Distance</option>
              <option value="rating" className="bg-slate-900 text-slate-100">Rating</option>
              <option value="popularity" className="bg-slate-900 text-slate-100">Popularity</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-teal-200/80 mt-1">
          Discover beaches, forts, heritage architecture, and natural viewpoints within {radiusKm} km.
        </p>
      </div>

      {/* Attractions Grid */}
      {attractions.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
          <Compass className="w-8 h-8 text-teal-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-200">No tourist spots in current radius</h4>
          <p className="text-xs text-slate-400 mt-1">Increase your discovery radius (e.g. 10 km or 25 km) to see major attractions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {attractions.map((spot) => {
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;
            return (
              <div
                key={spot.id}
                onClick={() => setSelectedService(spot)}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500 cursor-pointer shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                      {spot.subcategory || 'Attraction'}
                    </span>
                    <span className="text-xs font-bold text-teal-400">{spot.distanceKm} km away</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 mt-2 font-display group-hover:text-teal-300 transition-colors">
                    {spot.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{spot.description}</p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-1 font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{spot.rating || 4.7}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({spot.reviewsCount || 500})</span>
                  </div>

                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-teal-950 border border-teal-800 text-teal-300 hover:bg-teal-900 font-semibold text-xs"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Navigate</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
