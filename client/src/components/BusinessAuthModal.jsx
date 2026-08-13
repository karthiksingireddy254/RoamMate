import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  Building2, X, Shield, Lock, Mail, Phone, MapPin, Wrench, Fuel, Zap, Truck, CheckCircle2, AlertCircle, PlusCircle, Store, Sparkles
} from 'lucide-react';

export default function BusinessAuthModal() {
  const {
    isBusinessModalOpen,
    setIsBusinessModalOpen,
    businessUser,
    registerBusiness,
    loginBusiness,
    addBusinessServicePlace,
    logoutUser,
    currentLocation
  } = useTravel();

  const [activeTab, setActiveTab] = useState(businessUser ? 'add-place' : 'login'); // 'login' | 'register' | 'add-place'
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regBizName, setRegBizName] = useState('');
  const [regOwnerName, setRegOwnerName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCategory, setRegCategory] = useState('service');
  const [regLicense, setRegLicense] = useState('');
  const [regCity, setRegCity] = useState('');

  // Add Service Place State
  const [placeName, setPlaceName] = useState('');
  const [placeCategory, setPlaceCategory] = useState('service');
  const [placeSubcategory, setPlaceSubcategory] = useState('Vehicle Mechanic');
  const [placePhone, setPlacePhone] = useState('');
  const [placeAddress, setPlaceAddress] = useState('');
  const [placeLat, setPlaceLat] = useState(currentLocation.lat.toString());
  const [placeLng, setPlaceLng] = useState(currentLocation.lng.toString());
  const [placeAmenities, setPlaceAmenities] = useState('Puncture Repair, Engine Service, 24x7 Roadside Assistance');
  const [placeDesc, setPlaceDesc] = useState('');
  const [placeImage, setPlaceImage] = useState('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80');

  if (!isBusinessModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const result = await loginBusiness(loginEmail, loginPassword);
    setIsLoading(false);
    if (result.success) {
      setSuccessMsg(`Welcome back, ${result.provider.businessName}!`);
      setActiveTab('add-place');
    } else {
      setErrorMsg(result.error || 'Business authentication failed.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const result = await registerBusiness(
      regBizName, regOwnerName, regEmail, regPassword, regPhone, regCategory, regLicense, regCity
    );
    setIsLoading(false);
    if (result.success) {
      setSuccessMsg('Business organization created successfully!');
      setActiveTab('add-place');
    } else {
      setErrorMsg(result.error || 'Business registration failed.');
    }
  };

  const handleAddPlaceSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const result = await addBusinessServicePlace({
      name: placeName,
      category: placeCategory,
      subcategory: placeSubcategory,
      phone: placePhone || businessUser?.phone || '',
      address: placeAddress,
      lat: parseFloat(placeLat),
      lng: parseFloat(placeLng),
      amenities: placeAmenities,
      description: placeDesc,
      image: placeImage,
      status: 'Open Now'
    });

    setIsLoading(false);
    if (result.success) {
      setSuccessMsg(`✅ Service place "${placeName}" has been added live to Supabase PostgreSQL database & map!`);
      setPlaceName('');
      setPlaceAddress('');
      setPlaceDesc('');
    } else {
      setErrorMsg(result.error || 'Failed to publish place listing.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 px-6 py-5 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-display">Business Partner Portal</h2>
              <p className="text-xs text-amber-300/80">Vehicle Service Providers & Workshop Organizations</p>
            </div>
          </div>

          <button
            onClick={() => setIsBusinessModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center bg-slate-950 px-6 py-2 border-b border-slate-800 gap-2 overflow-x-auto text-xs">
          {!businessUser ? (
            <>
              <button
                onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${activeTab === 'login' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${activeTab === 'register' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Register Business
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setActiveTab('add-place'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${activeTab === 'add-place' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add / Update Service</span>
              </button>
              <button
                onClick={logoutUser}
                className="ml-auto text-xs font-bold text-rose-400 hover:text-rose-300"
              >
                Sign Out Organization
              </button>
            </>
          )}
        </div>

        {/* Form Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: Business Sign In */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Business Registered Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="workshop@business.com"
                    className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                {isLoading ? 'Authenticating Organization...' : 'Sign In as Business Partner'}
              </button>
            </form>
          )}

          {/* TAB 2: Register Business Organization */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Business / Workshop Name *</label>
                  <input
                    type="text"
                    required
                    value={regBizName}
                    onChange={(e) => setRegBizName(e.target.value)}
                    placeholder="e.g. Express Motors & Garage"
                    className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Owner / Manager Name</label>
                  <input
                    type="text"
                    value={regOwnerName}
                    onChange={(e) => setRegOwnerName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Business Email *</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="partner@workshop.com"
                    className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98000 12345"
                    className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Primary Vehicle Service Category</label>
                  <select
                    value={regCategory}
                    onChange={(e) => setRegCategory(e.target.value)}
                    className="w-full bg-slate-950 text-amber-400 text-xs font-bold rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="service">🛠️ Mechanic & Repair Garage</option>
                    <option value="fuel">⛽ Fuel Station & Gas Pump</option>
                    <option value="ev">⚡ EV Fast Charging Hub</option>
                    <option value="towing">🚛 Breakdown Towing & Recovery</option>
                    <option value="parking">🅿️ Vehicle Parking Lot</option>
                    <option value="rental">🛵 Bike & Scooter Rentals</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">GST / License No (Optional)</label>
                  <input
                    type="text"
                    value={regLicense}
                    onChange={(e) => setRegLicense(e.target.value)}
                    placeholder="e.g. 36AABCU9603R1ZM"
                    className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    placeholder="e.g. Hyderabad / Medchal"
                    className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                {isLoading ? 'Registering Organization...' : 'Register Business Organization'}
              </button>
            </form>
          )}

          {/* TAB 3: Add / Update Service Listing */}
          {activeTab === 'add-place' && businessUser && (
            <form onSubmit={handleAddPlaceSubmit} className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Signed in as Provider</span>
                  <h4 className="text-sm font-bold text-white">{businessUser.businessName}</h4>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-700 font-bold uppercase">
                  {businessUser.category}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Workshop / Place Name *</label>
                  <input
                    type="text"
                    required
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                    placeholder="e.g. Express Motors Bike & Car Repairs"
                    className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Vehicle Service Category *</label>
                  <select
                    value={placeCategory}
                    onChange={(e) => setPlaceCategory(e.target.value)}
                    className="w-full bg-slate-950 text-amber-400 text-xs font-bold rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="service">🛠️ Mechanic & Garages</option>
                    <option value="fuel">⛽ Fuel & Gas Stations</option>
                    <option value="ev">⚡ EV Fast Chargers</option>
                    <option value="towing">🚛 Breakdown & Towing</option>
                    <option value="parking">🅿️ Vehicle Parking</option>
                    <option value="rental">🛵 Bike & Scooter Rentals</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Subcategory / Tag</label>
                  <input
                    type="text"
                    value={placeSubcategory}
                    onChange={(e) => setPlaceSubcategory(e.target.value)}
                    placeholder="e.g. Bike Doctor / 24x7 Towing"
                    className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={placePhone}
                    onChange={(e) => setPlacePhone(e.target.value)}
                    placeholder="+91 98000 12345"
                    className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Workshop Address *</label>
                <input
                  type="text"
                  required
                  value={placeAddress}
                  onChange={(e) => setPlaceAddress(e.target.value)}
                  placeholder="e.g. NH44 Highway, Near Medchal Ring Road Junction"
                  className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Latitude Coordinate</label>
                  <input
                    type="text"
                    required
                    value={placeLat}
                    onChange={(e) => setPlaceLat(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Longitude Coordinate</label>
                  <input
                    type="text"
                    required
                    value={placeLng}
                    onChange={(e) => setPlaceLng(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Amenities (Comma-separated)</label>
                <input
                  type="text"
                  value={placeAmenities}
                  onChange={(e) => setPlaceAmenities(e.target.value)}
                  placeholder="Puncture Repair, Engine Oil Replacement, 24x7"
                  className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>{isLoading ? 'Publishing Listing...' : 'Publish Service Listing Live'}</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
