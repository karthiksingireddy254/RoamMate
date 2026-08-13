import React from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  Fuel, Zap, Wrench, Truck, Bike, X, ArrowRight, Building2
} from 'lucide-react';

const VEHICLE_SERVICES_GRID = [
  {
    id: 'service',
    title: 'Mechanic & Garages',
    desc: 'Instant tubeless puncture repair, motorcycle mechanic, car diagnostic garage, engine oil change & tune-up.',
    icon: Wrench,
    color: 'text-slate-300',
    bg: 'bg-slate-900 border-slate-700'
  },
  {
    id: 'fuel',
    title: 'Fuel Stations',
    desc: '24x7 Petrol & Diesel pumps, Swagat highway fuel plazas, XP95 & Speed petrol with tyre air pressure checking.',
    icon: Fuel,
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/60 border-emerald-800'
  },
  {
    id: 'ev',
    title: 'EV Fast Chargers',
    desc: '60kW to 150kW DC fast charging stations compatible with Nexon EV, ZS EV, Ather scooters & CCS2 chargers.',
    icon: Zap,
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/60 border-cyan-800'
  },
  {
    id: 'towing',
    title: 'Breakdown Towing',
    desc: '24-hour emergency flatbed tow trucks, hydraulic bike carriers, battery jumpstart & emergency fuel delivery.',
    icon: Truck,
    color: 'text-purple-400',
    bg: 'bg-purple-950/60 border-purple-800'
  },
  {
    id: 'rental',
    title: 'Bike & Car Rentals',
    desc: 'Self-drive tourist scooter & motorcycle rentals (Activa, Royal Enfield) and SUV car rentals with zero deposit.',
    icon: Bike,
    color: 'text-indigo-400',
    bg: 'bg-indigo-950/60 border-indigo-800'
  }
];

export default function AllServicesModal() {
  const { 
    isAllServicesModalOpen, 
    setIsAllServicesModalOpen, 
    setSelectedCategory,
    categoryCounts,
    setRoleSelection
  } = useTravel();

  if (!isAllServicesModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="relative bg-slate-950 px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
              Vehicle-Focused Discovery
            </span>
            <h2 className="text-xl font-black text-white font-display mt-1">Vehicle Services Hub</h2>
            <p className="text-xs text-slate-400">Everything your motorcycle, car, or EV needs on the road.</p>
          </div>

          <button
            onClick={() => setIsAllServicesModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {VEHICLE_SERVICES_GRID.map((svc) => {
              const Icon = svc.icon;
              const count = categoryCounts[svc.id] || 0;

              return (
                <div
                  key={svc.id}
                  onClick={() => {
                    setSelectedCategory(svc.id);
                    setIsAllServicesModalOpen(false);
                  }}
                  className={`p-4 rounded-2xl border ${svc.bg} hover:scale-[1.02] transition-all cursor-pointer group flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${svc.color}`} />
                      </div>
                      <span className="text-[10px] font-black text-slate-300 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                        {count} Available
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-white group-hover:text-sky-400 transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-end text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Business Partner Promotion Banner */}
          <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Are you a Garage or Service Provider?</h4>
                <p className="text-xs text-amber-300/80">Register your workshop or service point to keep your listing details up to date!</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsAllServicesModalOpen(false);
                setRoleSelection('provider');
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs whitespace-nowrap cursor-pointer shadow-md shrink-0"
            >
              Partner Sign In / Register
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
