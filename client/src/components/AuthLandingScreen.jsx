import React from 'react';
import { useTravel } from '../context/TravelContext';
import { User, Building2, MapPin, Compass, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AuthLandingScreen() {
  const { setRoleSelection, setAuthMode, setProviderAuthMode, theme } = useTravel();
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors duration-300 ${
      isLight ? 'bg-gradient-to-br from-slate-100 via-sky-50 to-emerald-50 text-slate-900' : 'bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-slate-100'
    }`}>
      
      {/* Ambient Decorative Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-4xl w-full mx-auto z-10 flex flex-col items-center text-center space-y-8">
        
        {/* Brand Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 backdrop-blur-md shadow-md">
            <MapPin className="w-4 h-4 text-sky-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-sky-500">Real-Time Travel Service Discovery</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight leading-tight">
            ROAM<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-emerald-400">MATE</span>
          </h1>

          <p className="text-base sm:text-xl font-bold max-w-xl mx-auto text-slate-500">
            "Your journey starts here. Wherever you travel, RoamMate shows you the real services you need around you — right now."
          </p>
        </div>

        {/* Account Type Selection Cards (2 Large Prominent Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl pt-4">
          
          {/* Card 1: TOURIST */}
          <div
            onClick={() => {
              setRoleSelection('tourist');
              setAuthMode('login');
            }}
            className={`group relative rounded-3xl p-6 sm:p-8 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between text-left shadow-2xl hover:-translate-y-1.5 ${
              isLight 
                ? 'bg-white hover:bg-slate-50 border-sky-200 hover:border-sky-500 shadow-sky-500/10' 
                : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-sky-500 shadow-sky-500/20'
            }`}
          >
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform">
                <User className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-sky-500">Traveler Portal</span>
                <h2 className="text-2xl font-black font-display mt-0.5 group-hover:text-sky-500 transition-colors">
                  👤 TOURIST
                </h2>
              </div>

              <p className={`text-xs sm:text-sm font-bold leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                "Discover services, places and emergency breakdown assistance around your exact current GPS location within your selected radius."
              </p>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-slate-200/50 mt-6">
              <span className="text-xs font-black text-sky-600 group-hover:underline">Sign In / Create Account</span>
              <div className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: SERVICE PROVIDER */}
          <div
            onClick={() => {
              setRoleSelection('provider');
              setProviderAuthMode('login');
            }}
            className={`group relative rounded-3xl p-6 sm:p-8 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between text-left shadow-2xl hover:-translate-y-1.5 ${
              isLight 
                ? 'bg-white hover:bg-slate-50 border-amber-200 hover:border-amber-500 shadow-amber-500/10' 
                : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-amber-500 shadow-amber-500/20'
            }`}
          >
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-500">Business & Workshop Partner</span>
                <h2 className="text-2xl font-black font-display mt-0.5 group-hover:text-amber-500 transition-colors">
                  🏢 SERVICE PROVIDER
                </h2>
              </div>

              <p className={`text-xs sm:text-sm font-bold leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                "Manage your services, update real-time workshop availability, define coverage area, and connect directly with travelers."
              </p>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-slate-200/50 mt-6">
              <span className="text-xs font-black text-amber-600 group-hover:underline">Partner Sign In / Register</span>
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>

        {/* Feature Badges Footer */}
        <div className="flex items-center justify-center gap-6 flex-wrap pt-4 text-xs font-black text-slate-500">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-sky-500" />
            <span>GPS Radius Search</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-emerald-500" />
            <span>Vehicle Assistance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Verified Providers</span>
          </div>
        </div>

      </div>
    </div>
  );
}
