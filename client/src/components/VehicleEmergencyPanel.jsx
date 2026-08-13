import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  ShieldAlert, Wrench, Truck, Fuel, Zap, Phone, Navigation, 
  MapPin, CheckCircle2, Clock, Star, AlertTriangle, ArrowLeft 
} from 'lucide-react';

const EMERGENCY_ISSUES = [
  { id: 'BIKE_BREAKDOWN', label: 'Bike Breakdown', icon: Wrench, color: 'text-amber-500', desc: 'Puncture, engine noise, chain lube' },
  { id: 'CAR_BREAKDOWN', label: 'Car Breakdown', icon: AlertTriangle, color: 'text-rose-500', desc: 'Engine heat, clutch fail, brake trouble' },
  { id: 'FLAT_TYRE', label: 'Flat Tyre', icon: Wrench, color: 'text-emerald-500', desc: 'Tubeless puncture repair onsite' },
  { id: 'BATTERY_PROBLEM', label: 'Battery Jumpstart', icon: Zap, color: 'text-cyan-500', desc: 'Dead battery boost, starter issue' },
  { id: 'OUT_OF_FUEL', label: 'Out of Fuel', icon: Fuel, color: 'text-amber-500', desc: 'Emergency petrol / diesel delivery' },
  { id: 'NEED_TOWING', label: 'Need Towing', icon: Truck, color: 'text-purple-500', desc: 'Flatbed tow truck & vehicle haul' }
];

export default function VehicleEmergencyPanel({ onClose }) {
  const { 
    currentLocation, 
    radiusKm, 
    nearbyServices, 
    setSelectedService, 
    requireAuth,
    theme 
  } = useTravel();

  const isLight = theme === 'light';
  const [selectedIssue, setSelectedIssue] = useState('BIKE_BREAKDOWN');
  const [requestSentId, setRequestSentId] = useState(null);

  // Filter emergency services matching issue
  const emergencyServices = nearbyServices.filter(place => {
    const cat = place.category;
    if (selectedIssue === 'BIKE_BREAKDOWN' || selectedIssue === 'FLAT_TYRE') {
      return cat === 'service' || cat === 'towing';
    }
    if (selectedIssue === 'NEED_TOWING') {
      return cat === 'towing' || cat === 'service';
    }
    if (selectedIssue === 'OUT_OF_FUEL') {
      return cat === 'fuel' || cat === 'towing';
    }
    if (selectedIssue === 'BATTERY_PROBLEM') {
      return cat === 'service' || cat === 'ev' || cat === 'towing';
    }
    return cat === 'service' || cat === 'towing' || cat === 'fuel';
  });

  const handleRequestAssistance = (place) => {
    requireAuth(() => {
      setRequestSentId(place.id);
      setTimeout(() => setRequestSentId(null), 4000);
    }, `Please sign in to send emergency assistance dispatch request to ${place.name}.`);
  };

  return (
    <div className={`p-4 sm:p-6 rounded-3xl border shadow-2xl space-y-6 ${
      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
    }`}>
      
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b pb-4 border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white font-black shadow-md shadow-rose-600/30">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black font-display flex items-center gap-2">
              <span>🚨 Vehicle Emergency Roadside Assistance</span>
            </h2>
            <p className="text-xs font-bold text-slate-500">
              Real-time emergency dispatch around {currentLocation.city} within {radiusKm} km
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/50 text-slate-500 font-black"
          >
            ✕
          </button>
        )}
      </div>

      {/* Select Vehicle Emergency Problem */}
      <div className="space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500">
          Step 1: Select Vehicle Issue
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {EMERGENCY_ISSUES.map(issue => {
            const Icon = issue.icon;
            const isSelected = selectedIssue === issue.id;

            return (
              <button
                key={issue.id}
                onClick={() => setSelectedIssue(issue.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-600/30 scale-105'
                    : isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                      : 'bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : issue.color}`} />
                  <span className="text-xs font-black">{issue.label}</span>
                </div>
                <p className={`text-[10px] line-clamp-1 font-bold ${isSelected ? 'text-rose-100' : 'text-slate-500'}`}>
                  {issue.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Matching Emergency Providers List */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            Step 2: Available Emergency Responders ({emergencyServices.length})
          </span>
          <span className="text-[11px] font-black text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>24/7 Active Dispatch</span>
          </span>
        </div>

        {emergencyServices.length === 0 ? (
          <div className={`p-8 text-center rounded-2xl border text-xs font-bold ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            No direct emergency providers found within {radiusKm} km. Expand your radius or call the National Emergency Helpline 112.
          </div>
        ) : (
          <div className="space-y-3">
            {emergencyServices.map(place => {
              const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
              const isDispatched = requestSentId === place.id;

              return (
                <div
                  key={place.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isLight ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black font-display text-sky-500">{place.name}</h4>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                          🟢 Available Now
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-sky-500" />
                        <span>{place.address} ({place.distanceKm} km away)</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 font-black text-amber-500 text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{place.rating || 4.9}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50 flex-wrap">
                    {place.phone && place.phone !== 'N/A' && (
                      <button
                        onClick={() => window.location.href = `tel:${place.phone}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-md cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Responder</span>
                      </button>
                    )}

                    <button
                      onClick={() => window.open(mapsUrl, '_blank')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs transition-all shadow-md cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Navigate</span>
                    </button>

                    <button
                      onClick={() => handleRequestAssistance(place)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs transition-all shadow-md cursor-pointer ${
                        isDispatched
                          ? 'bg-emerald-700 text-white animate-bounce'
                          : 'bg-rose-600 hover:bg-rose-500 text-white'
                      }`}
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>{isDispatched ? '✓ Assistance Dispatched!' : 'Request Assistance'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
