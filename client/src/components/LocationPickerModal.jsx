import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { X, MapPin, Navigation, Search, Compass } from 'lucide-react';

export default function LocationPickerModal() {
  const { isLocationModalOpen, setIsLocationModalOpen, setManualLocation, requestLocation, currentLocation } = useTravel();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  if (!isLocationModalOpen) return null;

  const handleSearchLocations = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`/api/location/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
      }
    } catch (err) {
      console.error('Location search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-display">Choose Location</h3>
            <p className="text-xs text-slate-400 mt-0.5">Search any city or location globally</p>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          
          {/* GPS Recenter Option */}
          <button
            onClick={() => {
              requestLocation();
              setIsLocationModalOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-sky-950 border border-sky-800 text-sky-200 hover:bg-sky-900 transition-all font-semibold text-xs shadow-md"
          >
            <Navigation className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>Use My Live GPS Location</span>
          </button>

          {/* Search Input Form */}
          <form onSubmit={handleSearchLocations} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, district, or landmark..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Search
            </button>
          </form>

          {/* Search Results */}
          {isSearching && (
            <p className="text-xs text-slate-400 text-center py-3">Searching locations...</p>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 px-1">Matching Locations</span>
              {searchResults.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setManualLocation(loc.lat, loc.lng, loc.city || 'Custom Location', loc.name);
                    setIsLocationModalOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 text-left text-xs transition-all"
                >
                  <div className="flex items-center gap-2 pr-2">
                    <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{loc.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
