import React from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  X, MapPin, Navigation, Phone, Bookmark, Star, Clock, 
  ShieldCheck, CheckCircle2, Building2, Globe 
} from 'lucide-react';

const CATEGORY_DEFAULT_IMAGES = {
  service: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80',
  towing: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=80',
  fuel: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=600&auto=format&fit=crop&q=80',
  ev: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80',
  rental: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80'
};

export default function ServiceDetailPanel() {
  const { selectedService, setSelectedService, savedPlaceIds, toggleSavePlace, requireAuth, theme } = useTravel();

  if (!selectedService) return null;

  const isLight = theme === 'light';
  const isSaved = savedPlaceIds.includes(selectedService.id);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selectedService.lat},${selectedService.lng}`;
  const imageUrl = selectedService.image || CATEGORY_DEFAULT_IMAGES[selectedService.category] || CATEGORY_DEFAULT_IMAGES.service;
  const isRoamMatePartner = selectedService.sourceType === 'ROAMMATE_REGISTERED' || (selectedService.id && selectedService.id.includes('prov'));

  return (
    <div className={`fixed inset-x-0 bottom-0 z-[1500] md:relative md:inset-auto md:w-96 md:h-full border-t md:border-t-0 md:border-l shadow-2xl backdrop-blur-xl rounded-t-3xl md:rounded-none overflow-hidden flex flex-col transition-all duration-300 max-h-[85vh] md:max-h-full ${
      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
    }`}>
      
      {/* Mobile Handle Bar */}
      <div className={`w-12 h-1.5 rounded-full mx-auto my-2.5 md:hidden ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

      {/* Hero Cover Image Header */}
      <div className="relative h-44 w-full bg-slate-950 shrink-0">
        <img
          src={imageUrl}
          alt={selectedService.name}
          className="w-full h-full object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Close Button */}
        <button
          onClick={() => setSelectedService(null)}
          className="absolute top-3 right-3 p-2 text-white bg-slate-950/80 hover:bg-slate-900 rounded-full backdrop-blur-md border border-slate-700 shadow-md transition-colors"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title & Data Source Badge Overlay */}
        <div className="absolute bottom-3 left-4 right-4 space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-md flex items-center gap-1 ${
              isRoamMatePartner
                ? 'bg-amber-500/90 text-white border-amber-400'
                : 'bg-sky-950/90 text-sky-300 border-sky-600/50'
            }`}>
              {isRoamMatePartner ? <Building2 className="w-3 h-3 text-white" /> : <Globe className="w-3 h-3 text-sky-300" />}
              <span>{isRoamMatePartner ? '🏢 RoamMate Registered' : '🌐 Map Data'}</span>
            </span>

            <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-slate-950/80 text-slate-200 border border-slate-700 backdrop-blur-md">
              {selectedService.subcategory || selectedService.category}
            </span>
          </div>

          <h3 className="text-lg font-black text-white font-display leading-tight drop-shadow-md">
            {selectedService.name}
          </h3>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        
        {/* Quick Stats Grid */}
        <div className={`grid grid-cols-3 gap-2 p-3 rounded-2xl border text-center shadow-inner ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div>
            <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-sm">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>{selectedService.rating || 4.8}</span>
            </div>
            <span className={`text-[10px] font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              ({selectedService.reviewsCount || 45} reviews)
            </span>
          </div>

          <div className={`border-x ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
            <div className="text-sky-600 font-black text-sm">
              {selectedService.distanceKm} km
            </div>
            <span className={`text-[10px] font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Distance</span>
          </div>

          <div>
            <div className="text-emerald-600 font-extrabold text-xs truncate">
              {selectedService.status || 'Available Now'}
            </div>
            <span className={`text-[10px] font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Status</span>
          </div>
        </div>

        {/* Address */}
        <div className={`flex items-start gap-2.5 text-xs font-bold p-3.5 rounded-2xl border ${
          isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-950/60 border-slate-800 text-slate-200'
        }`}>
          <MapPin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
          <span>{selectedService.address}</span>
        </div>

        {/* Description */}
        {selectedService.description && (
          <p className={`text-xs leading-relaxed p-3 rounded-xl border font-medium ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/40 border-slate-800 text-slate-300'
          }`}>
            {selectedService.description}
          </p>
        )}

        {/* Category Features */}
        {selectedService.amenities && selectedService.amenities.length > 0 && (
          <div>
            <h4 className={`text-xs font-black uppercase tracking-wider mb-2 ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Service Features & Assistance
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedService.amenities.map((item, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-xl border ${
                    isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer Primary Action Buttons */}
      <div className={`p-4 border-t grid grid-cols-3 gap-2 ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
      }`}>
        <button
          onClick={() => {
            requireAuth(() => window.open(mapsUrl, '_blank'), `Please sign in or create an account to navigate to ${selectedService.name}.`);
          }}
          className="flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white py-2.5 rounded-xl font-black text-xs shadow-lg transition-all text-center cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
          <span>Navigate</span>
        </button>

        {selectedService.phone && selectedService.phone !== 'N/A' ? (
          <button
            onClick={() => {
              requireAuth(() => window.location.href = `tel:${selectedService.phone}`, `Please sign in or create an account to call ${selectedService.name}.`);
            }}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl font-black text-xs shadow-lg transition-all text-center cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Call</span>
          </button>
        ) : (
          <button
            disabled
            className="flex items-center justify-center gap-1.5 bg-slate-300 text-slate-500 py-2.5 rounded-xl font-medium text-xs cursor-not-allowed"
          >
            <Phone className="w-4 h-4" />
            <span>No Phone</span>
          </button>
        )}

        <button
          onClick={() => toggleSavePlace(selectedService.id)}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-black text-xs shadow-lg transition-all border cursor-pointer ${
            isSaved
              ? 'bg-amber-500/20 border-amber-500 text-amber-600'
              : isLight
                ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>

    </div>
  );
}
