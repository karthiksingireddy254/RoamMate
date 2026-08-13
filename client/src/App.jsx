import React, { useState, useEffect } from 'react';
import { useTravel } from './context/TravelContext';
import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import MapView from './components/MapView';
import ServiceListView from './components/ServiceListView';
import ServiceDetailPanel from './components/ServiceDetailPanel';
import AllServicesModal from './components/AllServicesModal';
import HelpMeNowModal from './components/HelpMeNowModal';
import LocationPickerModal from './components/LocationPickerModal';
import UserPreferencesModal from './components/UserPreferencesModal';
import UserProfileModal from './components/UserProfileModal';
import BusinessAuthModal from './components/BusinessAuthModal';
import AiRecommendationBanner from './components/AiRecommendationBanner';
import OnMyRoutePanel from './components/OnMyRoutePanel';
import ExploreNearbyView from './components/ExploreNearbyView';
import AuthModal from './components/AuthModal';
import { 
  Compass, ShieldAlert, Database, Flame, Wrench, Fuel, Zap, Truck, Car
} from 'lucide-react';

const QUICK_VEHICLE_SITUATIONS = [
  { id: 'NORMAL', label: 'All Vehicle Services', icon: Compass, color: 'text-sky-400' },
  { id: 'BIKE_BREAKDOWN', label: 'Mechanic / Breakdown', icon: Wrench, color: 'text-emerald-400' },
  { id: 'OUT_OF_FUEL', label: 'Out of Fuel', icon: Fuel, color: 'text-amber-400' },
  { id: 'EV_LOW_BATTERY', label: 'EV Charger Needed', icon: Zap, color: 'text-cyan-400' },
  { id: 'TOWING_RESCUE', label: 'Towing Rescue', icon: Truck, color: 'text-purple-400' }
];

export default function App() {
  const {
    viewMode,
    activeTab,
    setActiveTab,
    selectedService,
    activeSituation,
    setActiveSituation,
    savedPlaceIds,
    nearbyServices,
    currentLocation,
    radiusKm,
    user,
    theme,
    requireAuth
  } = useTravel();

  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);

  const savedPlacesList = nearbyServices.filter(p => savedPlaceIds.includes(p.id));

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden relative transition-colors ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-100'
    }`}>
      
      {/* Background Ambient Decorative Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Primary Top Header Navigation */}
      <Navbar />

      {/* Quick Situation & Live Telemetry Banner */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar z-30">
        
        {/* Quick Situation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
            Quick Emergency Mode:
          </span>
          {QUICK_VEHICLE_SITUATIONS.map((sit) => {
            const Icon = sit.icon;
            const isActive = activeSituation === sit.id;
            return (
              <button
                key={sit.id}
                onClick={() => {
                  requireAuth(() => setActiveSituation(sit.id), `Please sign in or create an account to activate ${sit.label} mode.`);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-sky-600 border-sky-400 text-white shadow-md shadow-sky-600/30 scale-105'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : sit.color}`} />
                <span>{sit.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Database Indicator */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-full text-emerald-400 font-medium">
            <Database className="w-3.5 h-3.5" />
            <span>Supabase PostgreSQL Live</span>
          </div>
        </div>

      </div>

      {/* Horizontal Vehicle Category Bar */}
      <CategoryBar />

      {/* Main Responsive Body Area */}
      <main className="flex-1 relative flex overflow-hidden p-2 sm:p-3 gap-3 max-w-7xl w-full mx-auto z-10">
        
        {/* Tab View Switcher Logic */}
        {activeTab === 'discover' && (
          <div className="flex-1 flex flex-col md:flex-row gap-3 w-full h-full overflow-hidden">
            
            {/* Map Area */}
            <div className={`flex-1 relative h-full transition-all ${viewMode === 'list' ? 'hidden sm:block' : 'block'}`}>
              <MapView />
            </div>

            {/* Side Panel / List Overlay */}
            <div className={`w-full md:w-96 flex flex-col h-full overflow-y-auto ${viewMode === 'map' ? 'hidden md:flex' : 'flex'}`}>
              
              {/* AI Context Recommendation Banner */}
              <AiRecommendationBanner />

              {/* Synchronized Card List */}
              <div className="flex-1 overflow-y-auto">
                <ServiceListView />
              </div>
            </div>

            {/* Selected Service Detail Panel */}
            {selectedService && <ServiceDetailPanel />}
          </div>
        )}

        {/* Explore Tab View */}
        {activeTab === 'explore' && (
          <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-2">
            <ExploreNearbyView />
          </div>
        )}

        {/* On Route Tab View */}
        {activeTab === 'route' && (
          <div className="flex-1 overflow-y-auto w-full max-w-3xl mx-auto p-2">
            <OnMyRoutePanel />
          </div>
        )}

      </main>

      {/* Global Modals & Auth Experience */}
      <AuthModal />
      <UserProfileModal />
      <BusinessAuthModal />
      <AllServicesModal />
      <HelpMeNowModal />
      <LocationPickerModal />
      <UserPreferencesModal isOpen={isPrefModalOpen} onClose={() => setIsPrefModalOpen(false)} />

    </div>
  );
}
