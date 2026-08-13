import React, { useState, useEffect } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  X, Building2, Eye, EyeOff, Lock, Mail, User, Phone, MapPin, 
  Wrench, Fuel, Zap, Truck, CheckCircle2, ShieldCheck, ArrowRight, Loader2, Clock 
} from 'lucide-react';

const SERVICE_CATEGORIES = [
  { id: 'towing', label: 'Towing & Recovery' },
  { id: 'service', label: 'Mechanic & Garages' },
  { id: 'bike', label: 'Bike & Scooter Repair' },
  { id: 'car', label: 'Car Service Center' },
  { id: 'tyre', label: 'Tyre & Puncture Assistance' },
  { id: 'battery', label: 'Battery Jumpstart' },
  { id: 'roadside', label: 'Roadside Assistance' },
  { id: 'fuel', label: 'Fuel & Gas Station' },
  { id: 'ev', label: 'EV Fast Charging Hub' },
  { id: 'medical', label: 'Medical & ER' }
];

export default function ProviderAuthModal() {
  const { 
    providerAuthMode, 
    setProviderAuthMode, 
    loginBusiness, 
    registerBusiness, 
    isAuthLoading, 
    authError, 
    setAuthError, 
    businessUser,
    setRoleSelection,
    currentLocation,
    theme 
  } = useTravel();

  const isLight = theme === 'light';
  const [view, setView] = useState('login'); // 'login' | 'register' | 'forgot'

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register Section 1: Business Details
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');

  // Register Section 2: Contact
  const [regPhone, setRegPhone] = useState('');

  // Register Section 3: Service Category
  const [category, setCategory] = useState('service');

  // Register Section 4: Location
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(currentLocation.city || 'Agra');
  const [lat, setLat] = useState(currentLocation.lat.toString());
  const [lng, setLng] = useState(currentLocation.lng.toString());

  // Register Section 5: Availability
  const [operatingHours, setOperatingHours] = useState('24 Hours Open');
  const [is247Emergency, setIs247Emergency] = useState(true);
  const [availabilityStatus, setAvailabilityStatus] = useState('AVAILABLE');

  // Register Section 6: Service Area Radius
  const [coverageRadiusKm, setCoverageRadiusKm] = useState(15);

  // Register Section 7: Security
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (providerAuthMode === 'login' || providerAuthMode === 'register') {
      setView(providerAuthMode);
      setAuthError(null);
      setErrors({});
    }
  }, [providerAuthMode, setAuthError]);

  if (!providerAuthMode && !businessUser) return null;
  if (!providerAuthMode) return null;

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const switchView = (newView) => {
    setView(newView);
    setProviderAuthMode(newView === 'forgot' ? 'login' : newView);
    setAuthError(null);
    setErrors({});
    setResetSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!email.trim()) {
      errs.email = 'Business email is required.';
    } else if (!isValidEmail) {
      errs.email = 'Enter a valid business email.';
    }

    if (view === 'login') {
      if (!password) {
        errs.password = 'Please enter your password.';
      }
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }

      const res = await loginBusiness(email, password);
      if (res.success) {
        setRoleSelection('provider');
        setProviderAuthMode(null);
      }
    } else if (view === 'register') {
      if (!businessName.trim()) errs.businessName = 'Business name is required.';
      if (!ownerName.trim()) errs.ownerName = 'Owner/Manager name is required.';
      if (!regPhone.trim()) errs.regPhone = 'Phone number is required.';
      if (!regPassword || regPassword.length < 8) errs.regPassword = 'Password must be at least 8 characters.';
      if (regPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match.';

      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }

      const res = await registerBusiness(
        businessName, ownerName, email, regPassword, regPhone, category, 'VERIFIED_GST', city
      );
      if (res.success) {
        setRoleSelection('provider');
        setProviderAuthMode(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      
      {/* Modal Split-Screen Card */}
      <div className={`max-w-5xl w-full rounded-3xl border shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-5 relative transition-all duration-300 ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        
        {/* Close Button */}
        <button
          onClick={() => setProviderAuthMode(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-slate-700/80 backdrop-blur-md transition-colors"
          title="Close authentication"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Desktop LEFT Column: Service Provider Visual (2 Columns wide) */}
        <div className="hidden md:flex md:col-span-2 relative flex-col justify-between p-8 bg-gradient-to-br from-amber-600 via-amber-700 to-emerald-800 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80')] bg-cover bg-center" />
          
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-black tracking-tight text-lg">RoamMate Partner</span>
            </div>
            <p className="text-xs uppercase tracking-widest font-black text-amber-200">Service Provider Network</p>
          </div>

          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl font-black leading-tight drop-shadow-md">
              "Connect with travelers around you when they need your service most."
            </h2>
            <div className="space-y-2 text-xs font-bold text-amber-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Real-time availability status control</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Define custom service coverage radius</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>✓ Verified Service Provider Badge</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[11px] font-bold text-amber-200">
            Professional travel service network
          </div>
        </div>

        {/* Right Column: Form Container (3 Columns wide) */}
        <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-between space-y-6 max-h-[85vh] overflow-y-auto">
          
          {/* Header */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
              🏢 Service Provider Account
            </span>

            {view === 'login' && (
              <>
                <h3 className="text-2xl font-black font-display">Welcome, Service Provider</h3>
                <p className="text-xs font-bold text-slate-500">Sign in to manage your business and connect with travelers.</p>
              </>
            )}

            {view === 'register' && (
              <>
                <h3 className="text-2xl font-black font-display">Register your service</h3>
                <p className="text-xs font-bold text-slate-500">Help travelers find your service when they need it.</p>
              </>
            )}

            {view === 'forgot' && (
              <>
                <h3 className="text-2xl font-black font-display">Reset your password</h3>
                <p className="text-xs font-bold text-slate-500">Enter your registered business email to receive a password reset link.</p>
              </>
            )}
          </div>

          {/* Error Notification */}
          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-600 text-xs font-black">
              {authError}
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* LOGIN VIEW */}
            {view === 'login' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-500 mb-1 block">Business Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      placeholder="workshop@business.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-bold ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.email}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-black uppercase text-slate-500">Password</label>
                    <button type="button" onClick={() => switchView('forgot')} className="text-[11px] text-amber-600 font-black hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs font-bold ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                      }`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.password}</p>}
                </div>
              </div>
            )}

            {/* REGISTER VIEW (Progressive 7 Organized Sections) */}
            {view === 'register' && (
              <div className="space-y-6">
                
                {/* SECTION 1 — BUSINESS DETAILS */}
                <div className="space-y-3 p-4 rounded-2xl border bg-slate-500/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 block">
                    SECTION 1 — BUSINESS DETAILS
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-black text-slate-500 block mb-1">Business / Service Name</label>
                      <input
                        type="text"
                        placeholder="Agra Towing & Mechanics"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                        }`}
                      />
                      {errors.businessName && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.businessName}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-500 block mb-1">Owner / Manager Name</label>
                      <input
                        type="text"
                        placeholder="Karthik Singireddy"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2 — CONTACT */}
                <div className="space-y-3 p-4 rounded-2xl border bg-slate-500/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 block">
                    SECTION 2 — CONTACT
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-black text-slate-500 block mb-1">Business Email</label>
                      <input
                        type="email"
                        placeholder="workshop@business.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                        }`}
                      />
                      {errors.email && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-500 block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98490 55123"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3 — SERVICE */}
                <div className="space-y-3 p-4 rounded-2xl border bg-slate-500/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 block">
                    SECTION 3 — SERVICE CATEGORY
                  </span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                    }`}
                  >
                    {SERVICE_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* SECTION 4 — LOCATION */}
                <div className="space-y-3 p-4 rounded-2xl border bg-slate-500/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 block">
                    SECTION 4 — LOCATION
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-black text-slate-500 block mb-1">Business Address</label>
                      <input
                        type="text"
                        placeholder="NH44 North Highway, Agra"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-500 block mb-1">City</label>
                      <input
                        type="text"
                        placeholder="Agra"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 5 — AVAILABILITY */}
                <div className="space-y-3 p-4 rounded-2xl border bg-slate-500/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 block">
                    SECTION 5 — AVAILABILITY & EMERGENCY STATUS
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-black text-slate-500 block mb-1">Emergency Assistance</label>
                      <button
                        type="button"
                        onClick={() => setIs247Emergency(!is247Emergency)}
                        className={`w-full py-2 rounded-xl border text-xs font-black transition-all ${
                          is247Emergency ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {is247Emergency ? '🟢 24/7 Available' : '🔴 Not Available'}
                      </button>
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-500 block mb-1">Live Service Status</label>
                      <button
                        type="button"
                        onClick={() => setAvailabilityStatus(availabilityStatus === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE')}
                        className={`w-full py-2 rounded-xl border text-xs font-black transition-all ${
                          availabilityStatus === 'AVAILABLE' ? 'bg-sky-600 text-white border-sky-500' : 'bg-rose-600 text-white border-rose-500'
                        }`}
                      >
                        {availabilityStatus === 'AVAILABLE' ? '🟢 Available Now' : '🔴 Currently Unavailable'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* SECTION 6 — SERVICE AREA */}
                <div className="space-y-3 p-4 rounded-2xl border bg-slate-500/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                      SECTION 6 — SERVICE RADIUS
                    </span>
                    <span className="text-xs font-black text-amber-600">{coverageRadiusKm} km</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={5}
                    value={coverageRadiusKm}
                    onChange={(e) => setCoverageRadiusKm(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* SECTION 7 — SECURITY */}
                <div className="space-y-3 p-4 rounded-2xl border bg-slate-500/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 block">
                    SECTION 7 — SECURITY
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-black text-slate-500 block mb-1">Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                        }`}
                      />
                      {errors.regPassword && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.regPassword}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-500 block mb-1">Confirm Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                        }`}
                      />
                      {errors.confirmPassword && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-black text-xs transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAuthLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{view === 'login' ? 'Signing In...' : 'Registering Service...'}</span>
                </>
              ) : (
                <span>{view === 'login' ? 'Sign In' : view === 'register' ? 'Register Service' : 'Send Reset Link'}</span>
              )}
            </button>
          </form>

          {/* View Switcher Footer */}
          <div className="text-center text-xs font-bold pt-2 border-t border-slate-200/50">
            {view === 'login' ? (
              <p className="text-slate-500">
                Don't have an account?{' '}
                <button type="button" onClick={() => switchView('register')} className="text-amber-600 font-black hover:underline">
                  Register your business
                </button>
              </p>
            ) : (
              <p className="text-slate-500">
                Already registered?{' '}
                <button type="button" onClick={() => switchView('login')} className="text-amber-600 font-black hover:underline">
                  Sign In
                </button>
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
