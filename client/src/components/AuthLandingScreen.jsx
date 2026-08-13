import React from 'react';
import { useTravel } from '../context/TravelContext';
import { User, Building2, MapPin, ArrowRight, Compass, Wrench, ShieldCheck } from 'lucide-react';

export default function AuthLandingScreen() {
  const { setRoleSelection, setAuthMode, setProviderAuthMode, theme } = useTravel();
  const isLight = theme === 'light';

  const handleSelectRole = (role) => {
    setRoleSelection(role);
    if (role === 'tourist') {
      setAuthMode('login');
    } else {
      setProviderAuthMode('login');
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors duration-300 ${
      isLight ? 'bg-gradient-to-br from-slate-100 via-sky-50 to-emerald-50 text-slate-900' : 'bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-slate-100'
    }`}>
      
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Center Wrapper */}
      <div className="max-w-3xl w-full mx-auto z-10 flex flex-col items-center text-center space-y-8">
        
        {/* Brand Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 backdrop-blur-md shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-sky-500" />
            <span className="text-[11px] font-black uppercase tracking-widest text-sky-500">Real-Time Travel Service Discovery</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight leading-tight">
            ROAM<span className="text-sky-500">MATE</span>
          </h1>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black font-display text-sky-600">
              "Your journey starts here."
            </h2>
            <p className={`text-sm sm:text-base font-bold max-w-lg mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Discover what you need, wherever your journey takes you.
            </p>
          </div>
        </div>

        {/* Action Cards Grid (Exactly Two Equal Options) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl pt-2">
          
          {/* Option 1: TOURIST */}
          <div
            onClick={() => handleSelectRole('tourist')}
            className={`group relative rounded-3xl p-6 border-2 transition-all duration-200 ease-in-out cursor-pointer flex flex-col justify-between text-left shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] ${
              isLight 
                ? 'bg-white hover:bg-slate-50 border-sky-200 hover:border-sky-500 shadow-sky-500/5' 
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-sky-500 shadow-sky-500/10'
            }`}
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
                <User className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-500">Traveler Portal</span>
                <h3 className="text-xl font-black font-display mt-0.5 group-hover:text-sky-500 transition-colors">
                  👤 TOURIST
                </h3>
              </div>

              <p className={`text-xs font-bold leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Explore services around you and make your journey easier
              </p>
            </div>

            <div className="pt-5 flex items-center justify-between border-t border-slate-200/40 mt-5">
              <span className="text-xs font-black text-sky-600 group-hover:underline">Sign In / Register</span>
              <div className="w-7 h-7 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Option 2: SERVICE PROVIDER */}
          <div
            onClick={() => handleSelectRole('provider')}
            className={`group relative rounded-3xl p-6 border-2 transition-all duration-200 ease-in-out cursor-pointer flex flex-col justify-between text-left shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] ${
              isLight 
                ? 'bg-white hover:bg-slate-50 border-amber-200 hover:border-amber-500 shadow-amber-500/5' 
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-amber-500 shadow-amber-500/10'
            }`}
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
                <Building2 className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">Business Partner</span>
                <h3 className="text-xl font-black font-display mt-0.5 group-hover:text-amber-500 transition-colors">
                  🏢 SERVICE PROVIDER
                </h3>
              </div>

              <p className={`text-xs font-bold leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Manage your services and reach travelers around you
              </p>
            </div>

            <div className="pt-5 flex items-center justify-between border-t border-slate-200/40 mt-5">
              <span className="text-xs font-black text-amber-600 group-hover:underline">Partner Sign In / Register</span>
              <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

        </div>

        {/* Feature Badges Footer */}
        <div className="flex items-center justify-center gap-6 flex-wrap pt-2 text-xs font-black text-slate-500">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-sky-500" />
            <span>GPS Radius Search</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-emerald-500" />
            <span>Vehicle Breakdown Assistance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Verified Providers</span>
          </div>
        </div>

      </div>
    </div>
  );
}
