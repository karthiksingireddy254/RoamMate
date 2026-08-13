import React from 'react';
import { useTravel } from '../context/TravelContext';
import { Star, MapPin, Navigation, Phone, Bookmark, CheckCircle2, Wrench, Truck, Fuel, Zap } from 'lucide-react';

const CATEGORY_DEFAULT_IMAGES = {
  service: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80',
  towing: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=80',
  fuel: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=600&auto=format&fit=crop&q=80',
  ev: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80',
  parking: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80',
  rental: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80'
};

export default function ServiceListView() {
  const { nearbyServices, selectedService, setSelectedService, savedPlaceIds, toggleSavePlace, isLoading, radiusKm, requireAuth, theme } = useTravel();

  const isLight = theme === 'light';

  if (isLoading) {
    return (
      <div className={`w-full p-8 text-center ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold">Discovering vehicle services within {radiusKm} km...</p>
      </div>
    );
  }

  if (nearbyServices.length === 0) {
    return (
      <div className={`w-full p-8 text-center rounded-2xl border my-4 ${
        isLight ? 'bg-white border-slate-200 text-slate-800 shadow-md' : 'bg-slate-900/60 border-slate-800 text-slate-200'
      }`}>
        <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h4 className="text-sm font-black">No vehicle services found</h4>
        <p className="text-xs text-slate-500 mt-1">Expand search radius or try searching for "Mechanic", "Towing", or "Fuel".</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3.5 pb-8">
      {nearbyServices.map((place) => {
        const isSelected = selectedService && selectedService.id === place.id;
        const isSaved = savedPlaceIds.includes(place.id);
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
        const imageUrl = place.image || CATEGORY_DEFAULT_IMAGES[place.category] || CATEGORY_DEFAULT_IMAGES.service;

        return (
          <div
            key={place.id}
            onClick={() => {
              requireAuth(() => setSelectedService(place), `Please sign in or create an account to view details for ${place.name}.`);
            }}
            className={`rounded-2xl border overflow-hidden transition-all cursor-pointer shadow-md group ${
              isLight 
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900' 
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-100'
            } ${
              isSelected
                ? 'ring-2 ring-sky-500 border-sky-500 shadow-sky-500/20'
                : ''
            }`}
          >
            {/* Real Picture Cover Header */}
            <div className="relative h-32 w-full overflow-hidden bg-slate-950">
              <img
                src={imageUrl}
                alt={place.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Category Badge & Distance Pill */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/90 text-sky-400 border border-sky-500/40 backdrop-blur-md shadow-md">
                  {place.subcategory || place.category}
                </span>

                <span className="text-xs font-black text-white bg-sky-600 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-sky-400 shadow-md">
                  {place.distanceKm} km
                </span>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-2.5 left-3 right-3">
                <h4 className="text-sm font-black text-white font-display drop-shadow-md truncate">
                  {place.name}
                </h4>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-3.5 space-y-2.5">
              <p className={`text-xs line-clamp-1 flex items-center gap-1.5 font-bold ${
                isLight ? 'text-slate-800' : 'text-slate-300'
              }`}>
                <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span>{place.address}</span>
              </p>

              <div className={`flex items-center justify-between pt-2 border-t text-xs ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 font-black text-amber-500 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{place.rating || 4.5}</span>
                  </div>
                  <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{place.status || 'Open Now'}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      requireAuth(() => window.open(mapsUrl, '_blank'), `Please sign in or create an account to navigate to ${place.name}.`);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-[11px] shadow-sm transition-all cursor-pointer"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Map</span>
                  </button>

                  {place.phone && place.phone !== 'N/A' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        requireAuth(() => window.location.href = `tel:${place.phone}`, `Please sign in or create an account to call ${place.name}.`);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] shadow-sm transition-all cursor-pointer"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSavePlace(place.id);
                    }}
                    className={`p-1.5 rounded-xl border transition-all ${
                      isSaved 
                        ? 'bg-amber-500/20 border-amber-500 text-amber-600' 
                        : isLight 
                          ? 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900' 
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                    title="Bookmark"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                </div>
              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
}
