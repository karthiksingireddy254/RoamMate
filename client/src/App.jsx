import React, { useState } from 'react';
import { useTravel } from './context/TravelContext';
import AuthLandingScreen from './components/AuthLandingScreen';
import ProviderDashboard from './components/ProviderDashboard';
import VehicleEmergencyPanel from './components/VehicleEmergencyPanel';
import TouristAuthModal from './components/TouristAuthModal';
import ProviderAuthModal from './components/ProviderAuthModal';
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
import AiRecommendationBanner from './components/AiRecommendationBanner';
import OnMyRoutePanel from './components/OnMyRoutePanel';
import ExploreNearbyView from './components/ExploreNearbyView';
import { 
  Compass, ShieldAlert, Database, Wrench, Fuel, Zap, Truck, ArrowLeft
} from 'lucide-react';

const QUICK_VEHICLE_SITUATIONS = [
  { id: 'NORMAL', label: 'All Vehicle Services', icon: Compass, color: 'text-sky-500' },
  { id: 'BIKE_BREAKDOWN', label: 'Mechanic / Garage', icon: Wrench, color: 'text-emerald-500' },
  { id: 'TOWING_RESCUE', label: 'Towing Recovery', icon: Truck, color: 'text-purple-500' },
  { id: 'OUT_OF_FUEL', label: 'Fuel / Gas Pump', icon: Fuel, color: 'text-amber-500' },
  { id: 'EV_LOW_BATTERY', label: 'EV Charger Needed', icon: Zap, color: 'text-cyan-500' }
];

export default function App() {
  const {
    roleSelection,
    setRoleSelection,
    user,
    businessUser,
    viewMode,
    activeTab,
    selectedService,
    activeSituation,
    setActiveSituation,
    theme,
    requireAuth,
    isEmergencyModalOpen,
    setIsEmergencyModalOpen
  } = useTravel();

  const isLight = theme === 'light';
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);

  // If Service Provider session is active, render Service Provider Dashboard
  if (roleSelection === 'provider' && businessUser) {
    return <ProviderDashboard />;
  }

  // If unauthenticated AND no role selected, render Auth Landing Screen (Role Choice)
  if (!user && !businessUser && !roleSelection) {
    return (
      <>
        <AuthLandingScreen />
        <TouristAuthModal />
        <ProviderAuthModal />
      </>
    );
  }

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden relative transition-colors duration-300 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      
      {/* Background Ambient Decorative Lights */}
      <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        isLight ? 'bg-sky-400/10' : 'bg-sky-600/10'
      }`} />
      <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        isLight ? 'bg-emerald-400/10' : 'bg-emerald-600/10'
      }`} />

      {/* Primary Top Header Navigation */}
      <Navbar />

      {/* Quick Situation & Live Telemetry Banner */}
      <div className={`px-4 py-1.5 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar z-30 border-b transition-colors ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-950/90 border-slate-800'
      }`}>
        
        {/* Role Switcher & Situation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setRoleSelection(null)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black transition-all border cursor-pointer ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title="Switch User Role / Return to Landing Screen"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-sky-500" />
            <span className="hidden sm:inline">Role Selection</span>
          </button>

          <button
            onClick={() => setIsEmergencyModalOpen(!isEmergencyModalOpen)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black whitespace-nowrap transition-all border cursor-pointer shadow-md ${
              isEmergencyModalOpen
                ? 'bg-rose-600 border-rose-400 text-white shadow-rose-600/30'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-600 hover:bg-rose-500/20'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>🚨 Vehicle Emergency Assistance</span>
          </button>

          {QUICK_VEHICLE_SITUATIONS.map((sit) => {
            const Icon = sit.icon;
            const isActive = activeSituation === sit.id;
            return (
              <button
                key={sit.id}
                onClick={() => {
                  requireAuth(() => setActiveSituation(sit.id), `Please sign in or create an account to activate ${sit.label} mode.`);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black whitespace-nowrap transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 border-sky-400 text-white shadow-md shadow-sky-600/30 scale-105'
                    : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
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
        <div className="hidden lg:flex items-center gap-3 text-[11px] shrink-0">
          <div className={`flex items-center gap-1.5 border px-2.5 py-1 rounded-full font-black ${
            isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-900/90 border-slate-800 text-emerald-400'
          }`}>
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span>Supabase PostgreSQL Live</span>
          </div>
        </div>

      </div>

      {/* Horizontal Vehicle Category Bar */}
      <CategoryBar />

      {/* Main Responsive Body Area */}
      <main className="flex-1 relative flex overflow-hidden p-2 sm:p-3 gap-3 max-w-7xl w-full mx-auto z-10">
        
        {/* Emergency Flow Modal / Panel Overlay */}
        {isEmergencyModalOpen && (
          <div className="fixed inset-0 z-[1600] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <VehicleEmergencyPanel onClose={() => setIsEmergencyModalOpen(false)} />
            </div>
          </div>
        )}

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

      {/* Global Modals & Separate Auth Experience */}
      <TouristAuthModal />
      <ProviderAuthModal />
      <UserProfileModal />
      <AllServicesModal />
      <HelpMeNowModal />
      <LocationPickerModal />
      <UserPreferencesModal isOpen={isPrefModalOpen} onClose={() => setIsPrefModalOpen(false)} />

    </div>
  );
}
