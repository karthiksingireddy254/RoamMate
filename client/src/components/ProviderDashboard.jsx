import React, { useState, useEffect } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  Building2, ShieldCheck, Clock, MapPin, Phone, Mail, 
  CheckCircle2, AlertCircle, Plus, Trash2, Edit3, Power, 
  Radio, LogOut, Navigation, Save, RefreshCw, Car, Wrench
} from 'lucide-react';

export default function ProviderDashboard() {
  const { 
    businessUser, 
    setBusinessUser, 
    setRoleSelection,
    theme 
  } = useTravel();

  const isLight = theme === 'light';

  const [availabilityStatus, setAvailabilityStatus] = useState(businessUser?.availabilityStatus || 'AVAILABLE');
  const [is247Emergency, setIs247Emergency] = useState(businessUser?.is247Emergency !== false);
  const [businessName, setBusinessName] = useState(businessUser?.businessName || '');
  const [phone, setPhone] = useState(businessUser?.phone || '');
  const [address, setAddress] = useState(businessUser?.address || '');
  const [coverageRadiusKm, setCoverageRadiusKm] = useState(businessUser?.coverageRadiusKm || 15);
  const [description, setDescription] = useState(businessUser?.description || '');
  
  const [servicesList, setServicesList] = useState([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Fetch live dashboard data upon mounting
  useEffect(() => {
    if (businessUser?.id) {
      fetch(`/api/provider/dashboard/${businessUser.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.provider) {
            setAvailabilityStatus(data.provider.availabilityStatus || 'AVAILABLE');
            setIs247Emergency(data.provider.is247Emergency !== false);
            setBusinessName(data.provider.businessName);
            setPhone(data.provider.phone);
            setAddress(data.provider.address || '');
            setCoverageRadiusKm(data.provider.coverageRadiusKm || 15);
            setDescription(data.provider.description || '');
          }
          if (data.services) {
            setServicesList(data.services);
          }
        })
        .catch(err => console.warn('Dashboard fetch error:', err));
    }
  }, [businessUser]);

  // Handle Availability Change
  const handleAvailabilityToggle = async (status) => {
    setAvailabilityStatus(status);
    try {
      const res = await fetch('/api/provider/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: businessUser.id,
          availabilityStatus: status,
          is247Emergency
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg(`Availability updated to ${status === 'AVAILABLE' ? '🟢 Available Now' : status === 'BUSY' ? '🟡 Busy' : '🔴 Currently Unavailable'}`);
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Availability update failed:', err);
    }
  };

  // Handle Business Info Save
  const handleSaveBusiness = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/provider/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: businessUser.id,
          businessName,
          phone,
          address,
          lat: businessUser.lat || 28.6139,
          lng: businessUser.lng || 77.2090,
          coverageRadiusKm,
          description
        })
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg('Business profile and location updated successfully!');
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Save business error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Add Service Item
  const handleAddService = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newServiceName.trim()) return;

    try {
      const res = await fetch('/api/provider/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: businessUser.id,
          serviceName: newServiceName.trim(),
          priceRange: newServicePrice.trim() || 'Standard Rate',
          description: newServiceDesc.trim(),
          vehicleTypes: ['Bike', 'Car', 'SUV']
        })
      });

      const data = await res.json();
      if (data.success && data.service) {
        setServicesList(prev => [data.service, ...prev]);
        setNewServiceName('');
        setNewServicePrice('');
        setNewServiceDesc('');
      }
    } catch (err) {
      console.error('Add service error:', err);
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col transition-colors duration-300 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      
      {/* Top Header */}
      <header className={`px-4 sm:px-8 py-4 border-b flex items-center justify-between gap-4 sticky top-0 z-30 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-md'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white font-black shadow-md">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black font-display">{businessUser?.businessName || 'Service Provider Dashboard'}</h1>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                ✓ Verified Provider
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500">Service Provider Operational Portal • RoamMate Network</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setBusinessUser(null);
              setRoleSelection(null);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-all shadow-md cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        
        {/* Status Alert Banner */}
        {saveSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-600 text-xs font-black flex items-center gap-2 shadow-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Section 1: Real-Time Availability Control Bar */}
        <section className={`p-6 rounded-3xl border shadow-lg space-y-4 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-500">Live Status Control</span>
              <h2 className="text-xl font-black font-display mt-0.5">Real-Time Workshop Availability</h2>
              <p className="text-xs text-slate-500 font-bold mt-1">
                "When you update your availability state here, tourists discovering services in your area will immediately see your live status."
              </p>
            </div>

            {/* Availability Radio Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleAvailabilityToggle('AVAILABLE')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all border cursor-pointer ${
                  availabilityStatus === 'AVAILABLE'
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/30 scale-105'
                    : isLight ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-950 text-slate-300 border-slate-800'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>🟢 Available Now</span>
              </button>

              <button
                onClick={() => handleAvailabilityToggle('BUSY')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all border cursor-pointer ${
                  availabilityStatus === 'BUSY'
                    ? 'bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-600/30 scale-105'
                    : isLight ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-950 text-slate-300 border-slate-800'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>🟡 Busy / Limited</span>
              </button>

              <button
                onClick={() => handleAvailabilityToggle('UNAVAILABLE')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all border cursor-pointer ${
                  availabilityStatus === 'UNAVAILABLE'
                    ? 'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-600/30 scale-105'
                    : isLight ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-950 text-slate-300 border-slate-800'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span>🔴 Currently Unavailable</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 2: Two-Column Dashboard Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Manage Services & Coverage */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Manage Services Offered */}
            <div className={`p-6 rounded-3xl border shadow-lg space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black font-display flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-sky-500" />
                    <span>Manage Offered Vehicle Services</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">Add or update specific repairs and assistance items offered by your workshop.</p>
                </div>
              </div>

              {/* Add New Service Form */}
              <form onSubmit={handleAddService} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <input
                  type="text"
                  placeholder="Service Name (e.g. Flatbed Towing, Engine Tuning)"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Price / Rate (e.g. ₹500 fixed, On Inspection)"
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                  }`}
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </form>

              {/* Services List Table */}
              <div className="space-y-2 pt-2">
                {servicesList.length === 0 ? (
                  <div className={`p-6 text-center rounded-2xl border text-xs font-bold ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}>
                    No specific service items added yet. Add your workshop services above!
                  </div>
                ) : (
                  servicesList.map((srv, idx) => (
                    <div
                      key={srv.id || idx}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                      }`}
                    >
                      <div>
                        <h4 className="font-black text-sm text-sky-500">{srv.serviceName}</h4>
                        <p className="text-slate-500 font-bold mt-0.5">{srv.priceRange || 'Standard Rate'}</p>
                      </div>
                      <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                        Active
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Business Profile & Location Settings */}
            <div className={`p-6 rounded-3xl border shadow-lg space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <h3 className="text-lg font-black font-display flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                <span>Business Details & Coverage Radius</span>
              </h3>

              <form onSubmit={handleSaveBusiness} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black uppercase text-slate-500 mb-1 block">Business Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-bold ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-slate-500 mb-1 block">Contact Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-bold ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-500 mb-1 block">Business Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-bold ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-black uppercase text-slate-500 block">Service Coverage Radius</label>
                    <span className="text-xs font-black text-sky-500">{coverageRadiusKm} km</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={coverageRadiusKm}
                    onChange={(e) => setCoverageRadiusKm(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-500 mb-1 block">Workshop Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-bold ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs transition-all shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </form>
            </div>

          </div>

          {/* Column 3: Verification & Summary Card */}
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border shadow-lg space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-500">Verification Status</span>
              
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-base font-black text-emerald-600">✓ Verified Service Provider</h4>
                <p className="text-[11px] font-bold text-slate-500">
                  Your business credentials and location have been verified on the RoamMate network.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs font-bold">
                <div className="flex items-center justify-between py-2 border-b border-slate-200/50">
                  <span className="text-slate-500">Provider ID</span>
                  <span className="font-mono text-sky-500">{businessUser?.id}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-200/50">
                  <span className="text-slate-500">Owner Name</span>
                  <span>{businessUser?.ownerName || 'Verified Manager'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-200/50">
                  <span className="text-slate-500">Registered Email</span>
                  <span className="max-w-[150px] truncate">{businessUser?.email}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500">Registered City</span>
                  <span>{businessUser?.city || 'Agra'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
