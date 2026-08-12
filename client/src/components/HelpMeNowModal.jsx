import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  X, ShieldAlert, Wrench, Fuel, Truck, Stethoscope, Hotel, Phone, Navigation, AlertTriangle 
} from 'lucide-react';

const EMERGENCY_ISSUES = [
  { id: 'BIKE_BREAKDOWN', label: 'Bike Breakdown', icon: Wrench, cat: 'service', desc: 'Find nearest bike mechanic & mobile repair' },
  { id: 'CAR_BREAKDOWN', label: 'Car Breakdown', icon: Wrench, cat: 'service', desc: 'Find nearest car mechanic & garage' },
  { id: 'FLAT_TYRE', label: 'Flat Tyre', icon: AlertTriangle, cat: 'service', desc: 'Locate puncture shops & tyre care' },
  { id: 'OUT_OF_FUEL', label: 'Out of Fuel', icon: Fuel, cat: 'fuel', desc: 'Find nearest fuel pump or emergency delivery' },
  { id: 'BATTERY_PROBLEM', label: 'Battery Problem', icon: Wrench, cat: 'service', desc: 'Locate jumpstart & battery shops' },
  { id: 'NEED_TOWING', label: 'Need Towing', icon: Truck, cat: 'towing', desc: 'Call 24x7 tow truck recovery' },
  { id: 'MEDICAL_EMERGENCY', label: 'Medical Emergency', icon: Stethoscope, cat: 'medical', desc: 'Find 24x7 ER, hospital & ambulance' },
  { id: 'NEED_STAY', label: 'Need Accommodation', icon: Hotel, cat: 'stay', desc: 'Find immediate open stays & hotels' }
];

export default function HelpMeNowModal() {
  const { isHelpMeModalOpen, setIsHelpMeModalOpen, setSelectedCategory, setActiveSituation, currentLocation } = useTravel();
  const [activeTab, setActiveTab] = useState('select'); // 'select' | 'active'
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [assistanceData, setAssistanceData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  if (!isHelpMeModalOpen) return null;

  const handleSelectIssue = async (issue) => {
    setSelectedIssue(issue);
    setIsSearching(true);
    setActiveTab('active');

    try {
      const res = await fetch('/api/assistance/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueType: issue.id,
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          radiusKm: 10
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAssistanceData(data);
      }
    } catch (err) {
      console.error('Assistance request failed:', err);
    } finally {
      setIsSearching(false);
    }

    // Set situation in context
    setActiveSituation(issue.id);
    setSelectedCategory(issue.cat);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-rose-600/80 rounded-3xl shadow-[0_0_50px_rgba(225,29,72,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 border-b border-rose-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-lg">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">HELP ME NOW</h3>
              <p className="text-xs text-rose-300">Instant emergency & roadside assistance</p>
            </div>
          </div>

          <button
            onClick={() => setIsHelpMeModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {activeTab === 'select' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EMERGENCY_ISSUES.map((issue) => {
                const Icon = issue.icon;
                return (
                  <button
                    key={issue.id}
                    onClick={() => handleSelectIssue(issue)}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-rose-700/80 text-left transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-rose-300">{issue.label}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{issue.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'active' && selectedIssue && (
            <div className="space-y-4">
              <div className="bg-rose-950/50 border border-rose-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-400">Active Assistance Profile</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{selectedIssue.label}</h4>
                </div>
                <button
                  onClick={() => setActiveTab('select')}
                  className="text-xs text-rose-300 underline font-semibold"
                >
                  Change Issue
                </button>
              </div>

              {/* Hotlines */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Emergency Helplines</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <a href="tel:112" className="flex items-center justify-center gap-1.5 bg-rose-900 border border-rose-700 text-white p-2.5 rounded-xl text-xs font-bold shadow">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Police: 112</span>
                  </a>
                  <a href="tel:108" className="flex items-center justify-center gap-1.5 bg-rose-900 border border-rose-700 text-white p-2.5 rounded-xl text-xs font-bold shadow">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Ambulance: 108</span>
                  </a>
                  <a href="tel:+919822100999" className="flex items-center justify-center gap-1.5 bg-purple-900 border border-purple-700 text-white p-2.5 rounded-xl text-xs font-bold shadow">
                    <Phone className="w-3.5 h-3.5" />
                    <span>24x7 Towing</span>
                  </a>
                </div>
              </div>

              {/* Matched Local Services */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nearest Relevant Providers</h4>
                {isSearching ? (
                  <p className="text-xs text-slate-400 py-4 text-center">Finding emergency services around {currentLocation.city}...</p>
                ) : (
                  <div className="space-y-2">
                    {assistanceData?.services?.map((svc) => (
                      <div key={svc.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <h5 className="font-bold text-slate-100">{svc.name}</h5>
                          <span className="text-[11px] text-slate-400">{svc.subcategory} • {svc.distanceKm} km away</span>
                        </div>
                        {svc.phone && svc.phone !== 'N/A' && (
                          <a href={`tel:${svc.phone}`} className="flex items-center gap-1 bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold">
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
          <button
            onClick={() => setIsHelpMeModalOpen(false)}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
          >
            View Prioritized Services on Map
          </button>
        </div>

      </div>
    </div>
  );
}
