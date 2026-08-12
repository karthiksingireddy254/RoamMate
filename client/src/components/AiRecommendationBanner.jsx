import React, { useState, useEffect } from 'react';
import { useTravel } from '../context/TravelContext';
import { Sparkles, Star, ChevronRight } from 'lucide-react';

export default function AiRecommendationBanner() {
  const { currentLocation, radiusKm, travelMode, setSelectedService } = useTravel();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    async function loadRecs() {
      try {
        const res = await fetch('/api/recommendations');
        if (res.ok) {
          const data = await res.json();
          setRecommendations(data.recommendations || []);
        }
      } catch (err) {
        console.warn('Recs failed:', err);
      }
    }
    loadRecs();
  }, [currentLocation.lat, currentLocation.lng, radiusKm, travelMode]);

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-sky-800/50 p-3 rounded-2xl mb-3 shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-sky-400" />
        <span className="text-xs font-bold text-slate-100 font-display">Recommended for You</span>
        <span className="text-[10px] text-sky-300 bg-sky-950 border border-sky-800 px-2 py-0.5 rounded font-semibold">
          {travelMode} Mode
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
        {recommendations.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedService(item)}
            className="bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/80 p-2.5 rounded-xl flex-1 min-w-[200px] cursor-pointer transition-all shrink-0"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                {item.subcategory || item.category}
              </span>
              <span className="text-[10px] font-bold text-sky-400">{item.distanceKm} km</span>
            </div>

            <h5 className="text-xs font-bold text-slate-100 mt-1 truncate">{item.name}</h5>

            {item.matchReasons && item.matchReasons.length > 0 && (
              <p className="text-[10px] text-slate-400 mt-1 truncate">{item.matchReasons[0]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
