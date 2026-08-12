import React from 'react';
import { useTravel } from '../context/TravelContext';
import { Star, MapPin, Navigation, Phone, Bookmark, ChevronRight, CheckCircle2 } from 'lucide-react';

const CATEGORY_DEFAULT_IMAGES = {
  stay: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
  food: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
  fuel: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=600&auto=format&fit=crop&q=80',
  ev: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80',
  service: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80',
  towing: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=80',
  medical: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
  transport: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
  explore: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
  parking: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80',
  restroom: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
  atm: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=600&auto=format&fit=crop&q=80',
  rental: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
  essentials: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80',
  convenience: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80'
};

export default function ServiceListView() {
  const { nearbyServices, selectedService, setSelectedService, savedPlaceIds, toggleSavePlace, isLoading, radiusKm, requireAuth } = useTravel();

  if (isLoading) {
    return (
      <div className="w-full p-8 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold">Discovering services within {radiusKm} km...</p>
      </div>
    );
  }

  if (nearbyServices.length === 0) {
    return (
      <div className="w-full p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 my-4">
        <MapPin className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-slate-200">No services found</h4>
        <p className="text-xs text-slate-400 mt-1">Expand your radius or select a different category.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3.5 pb-8">
      {nearbyServices.map((place) => {
        const isSelected = selectedService && selectedService.id === place.id;
        const isSaved = savedPlaceIds.includes(place.id);
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
        const imageUrl = place.image || CATEGORY_DEFAULT_IMAGES[place.category] || CATEGORY_DEFAULT_IMAGES.explore;

        return (
          <div
            key={place.id}
            onClick={() => {
              requireAuth(() => setSelectedService(place), `Please sign in or create an account to view details for ${place.name}.`);
            }}
            className={`rounded-2xl border overflow-hidden transition-all cursor-pointer bg-slate-900/95 hover:bg-slate-850 shadow-lg group ${
              isSelected
                ? 'border-sky-500 ring-2 ring-sky-500/40 shadow-sky-500/20'
                : 'border-slate-800/90 hover:border-slate-700'
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
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/90 text-sky-400 border border-sky-500/40 backdrop-blur-md shadow-md">
                  {place.subcategory || place.category}
                </span>

                <span className="text-xs font-bold text-white bg-sky-600/90 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-sky-400/50 shadow-md">
                  {place.distanceKm} km
                </span>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-2.5 left-3 right-3">
                <h4 className="text-sm font-bold text-white font-display drop-shadow-md truncate">
                  {place.name}
                </h4>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-3.5 space-y-2">
              <p className="text-xs text-slate-300 line-clamp-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{place.address}</span>
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 font-bold text-amber-400 bg-amber-950/50 border border-amber-800/60 px-2 py-0.5 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{place.rating || 4.5}</span>
                  </div>
                  <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{place.status || 'Open'}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      requireAuth(() => window.open(mapsUrl, '_blank'), `Please sign in or create an account to navigate to ${place.name}.`);
                    }}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] shadow-sm transition-all"
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
                      className="flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] shadow-sm transition-all"
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
                      isSaved ? 'bg-amber-950 border-amber-700 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                    title="Bookmark"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
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
