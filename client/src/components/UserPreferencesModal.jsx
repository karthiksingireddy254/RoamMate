import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { X, Bike, Car, Zap, Footprints, Users, DollarSign, Heart } from 'lucide-react';

const TRAVEL_MODES = [
  { id: 'BIKE', label: 'Motorcycle / Scooter', icon: Bike },
  { id: 'CAR', label: 'Four Wheeler / SUV', icon: Car },
  { id: 'EV', label: 'Electric Vehicle (EV)', icon: Zap },
  { id: 'WALKING', label: 'Pedestrian / Walking', icon: Footprints },
  { id: 'FAMILY', label: 'Family Trip', icon: Users }
];

export default function UserPreferencesModal({ isOpen, onClose }) {
  const { travelMode, setTravelMode } = useTravel();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-display">Travel Preferences</h3>
            <p className="text-xs text-slate-400 mt-0.5">Customize your travel mode</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Travel Mode</h4>
          <div className="space-y-2">
            {TRAVEL_MODES.map((mode) => {
              const Icon = mode.icon;
              const isSelected = travelMode === mode.id;

              return (
                <button
                  key={mode.id}
                  onClick={() => setTravelMode(mode.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-sky-600 border-sky-400 text-white shadow-md'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4 text-sky-300" />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold"
          >
            Save Preferences
          </button>
        </div>

      </div>
    </div>
  );
}
