import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { Route, MapPin, Navigation, Compass, Search } from 'lucide-react';

export default function OnMyRoutePanel() {
  const { currentLocation, setSelectedService } = useTravel();
  const [destQuery, setDestQuery] = useState('');
  const [routeResults, setRouteResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchRoute = async (e) => {
    if (e) e.preventDefault();
    if (!destQuery.trim()) return;

    setIsLoading(true);
    try {
      // 1. Geocode destination query
      const geoRes = await fetch(`/api/location/search?q=${encodeURIComponent(destQuery)}`);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          const dest = geoData.results[0];

          // 2. Fetch services along corridor
          const res = await fetch(`/api/route/services?originLat=${currentLocation.lat}&originLng=${currentLocation.lng}&destLat=${dest.lat}&destLng=${dest.lng}`);
          if (res.ok) {
            const data = await res.json();
            setRouteResults({ ...data, destName: dest.name });
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch route services:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Route Selector Card */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Route className="w-5 h-5 text-sky-400" />
          <h3 className="text-base font-bold text-slate-100 font-display">On My Route Discovery</h3>
        </div>

        <p className="text-xs text-slate-400 mb-3">
          Discover fuel, food, EV chargers, and mechanics directly along your driving corridor to any destination.
        </p>

        {/* Custom Destination Search */}
        <form onSubmit={handleSearchRoute} className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={destQuery}
              onChange={(e) => setDestQuery(e.target.value)}
              placeholder="Enter destination city or landmark..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all"
          >
            Search Route
          </button>
        </form>
      </div>

      {/* Corridor Results */}
      {isLoading && (
        <div className="p-8 text-center text-slate-400">
          <p className="text-xs font-semibold">Calculating route corridor services...</p>
        </div>
      )}

      {routeResults && !isLoading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Destination: <strong className="text-slate-200">{routeResults.destName}</strong></span>
            <span>Corridor Services: <strong className="text-emerald-400">{routeResults.servicesCount} found</strong></span>
          </div>

          <div className="space-y-2">
            {routeResults.services.map((place) => (
              <div
                key={place.id}
                onClick={() => setSelectedService(place)}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500 cursor-pointer flex items-center justify-between transition-all"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                    {place.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-100 mt-1">{place.name}</h4>
                  <span className="text-[11px] text-slate-400">{place.address}</span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-emerald-400 block">+{place.detourKm} km detour</span>
                  <span className="text-[10px] text-slate-400">{place.distanceFromOrigin} km into route</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
