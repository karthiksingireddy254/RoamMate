import React from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  X, MapPin, Navigation, Phone, Bookmark, Star, Clock, Tag, 
  ShieldCheck, ExternalLink, CheckCircle2 
} from 'lucide-react';

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

export default function ServiceDetailPanel() {
  const { selectedService, setSelectedService, savedPlaceIds, toggleSavePlace, requireAuth } = useTravel();

  if (!selectedService) return null;

  const isSaved = savedPlaceIds.includes(selectedService.id);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selectedService.lat},${selectedService.lng}`;
  const imageUrl = selectedService.image || CATEGORY_DEFAULT_IMAGES[selectedService.category] || CATEGORY_DEFAULT_IMAGES.explore;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[1500] md:relative md:inset-auto md:w-96 md:h-full bg-slate-900/95 md:bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 shadow-2xl backdrop-blur-xl rounded-t-3xl md:rounded-none overflow-hidden flex flex-col transition-all duration-300 max-h-[85vh] md:max-h-full">
      
      {/* Mobile Handle Bar */}
      <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto my-2.5 md:hidden" />

      {/* Hero Cover Image Header */}
      <div className="relative h-44 w-full bg-slate-950 shrink-0">
        <img
          src={imageUrl}
          alt={selectedService.name}
          className="w-full h-full object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        {/* Close Button */}
        <button
          onClick={() => setSelectedService(null)}
          className="absolute top-3 right-3 p-2 text-white bg-slate-950/80 hover:bg-slate-900 rounded-full backdrop-blur-md border border-slate-700/80 shadow-md transition-colors"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title & Category Badge Overlay */}
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-sky-950/90 text-sky-300 border border-sky-600/50 backdrop-blur-md">
              {selectedService.subcategory || selectedService.category}
            </span>
            {selectedService.priceLevel && (
              <span className="text-xs font-bold text-emerald-400">
                {selectedService.priceLevel}
              </span>
            )}
          </div>
          <h3 className="text-lg font-extrabold text-white font-display leading-tight drop-shadow-md">
            {selectedService.name}
          </h3>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950/90 p-3 rounded-2xl border border-slate-800 text-center shadow-inner">
          <div>
            <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{selectedService.rating || 4.5}</span>
            </div>
            <span className="text-[10px] text-slate-400">({selectedService.reviewsCount || 45} reviews)</span>
          </div>

          <div className="border-x border-slate-800">
            <div className="text-sky-400 font-bold text-sm">
              {selectedService.distanceKm} km
            </div>
            <span className="text-[10px] text-slate-400">Distance</span>
          </div>

          <div>
            <div className="text-emerald-400 font-semibold text-xs truncate">
              {selectedService.status || 'Open'}
            </div>
            <span className="text-[10px] text-slate-400">Status</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
          <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <span>{selectedService.address}</span>
        </div>

        {/* Description */}
        {selectedService.description && (
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
            {selectedService.description}
          </p>
        )}

        {/* Category Features */}
        {selectedService.amenities && selectedService.amenities.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Features & Amenities
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedService.amenities.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 text-[11px] bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1 rounded-xl"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer Primary Action Buttons */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 grid grid-cols-3 gap-2">
        <button
          onClick={() => {
            requireAuth(() => window.open(mapsUrl, '_blank'), `Please sign in or create an account to navigate to ${selectedService.name}.`);
          }}
          className="flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all text-center cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
          <span>Navigate</span>
        </button>

        {selectedService.phone && selectedService.phone !== 'N/A' ? (
          <button
            onClick={() => {
              requireAuth(() => window.location.href = `tel:${selectedService.phone}`, `Please sign in or create an account to call ${selectedService.name}.`);
            }}
            className="flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all text-center cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Call</span>
          </button>
        ) : (
          <button
            disabled
            className="flex items-center justify-center gap-1.5 bg-slate-800 text-slate-500 py-2.5 rounded-xl font-medium text-xs cursor-not-allowed"
          >
            <Phone className="w-4 h-4" />
            <span>No Phone</span>
          </button>
        )}

        <button
          onClick={() => toggleSavePlace(selectedService.id)}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all border cursor-pointer ${
            isSaved
              ? 'bg-amber-950 border-amber-700 text-amber-300'
              : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>

    </div>
  );
}
