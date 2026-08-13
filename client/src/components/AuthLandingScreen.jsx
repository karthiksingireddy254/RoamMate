import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  User, Building2, MapPin, Eye, EyeOff, Lock, Mail, Phone, 
  Wrench, CheckCircle2, ShieldCheck, ArrowRight, Loader2, Sparkles 
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

export default function AuthLandingScreen() {
  const { 
    setRoleSelection, 
    loginUser, 
    registerUser, 
    loginBusiness, 
    registerBusiness,
    loginWithGoogle,
    sendPasswordReset,
    isAuthLoading,
    authError,
    setAuthError,
    currentLocation,
    theme 
  } = useTravel();

  const isLight = theme === 'light';

  // Mode: 'tourist' | 'provider'
  const [activeMode, setActiveMode] = useState('tourist');
  
  // Tab: 'login' | 'register' | 'forgot'
  const [tab, setTab] = useState('login');

  // Form Fields - Common
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetSuccess, setResetSuccess] = useState(false);

  // Tourist Registration Fields
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Service Provider Registration Fields
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [category, setCategory] = useState('service');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(currentLocation.city || 'Agra');
  const [is247Emergency, setIs247Emergency] = useState(true);
  const [coverageRadiusKm, setCoverageRadiusKm] = useState(15);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Password strength helper
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: '', score: 0, color: 'bg-slate-300' };
    let score = 0;
    if (pwd.length >= 8) score += 40;
    if (/[A-Z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 20;
    if (/[!@#$%^&*]/.test(pwd)) score += 20;

    if (score <= 40) return { label: 'Weak', score: 33, color: 'bg-rose-500', text: 'text-rose-500' };
    if (score <= 80) return { label: 'Medium', score: 66, color: 'bg-amber-500', text: 'text-amber-500' };
    return { label: 'Strong', score: 100, color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleModeSwitch = (mode) => {
    setActiveMode(mode);
    setAuthError(null);
    setErrors({});
    setResetSuccess(false);
  };

  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    setAuthError(null);
    setErrors({});
    setResetSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!isValidEmail) {
      errs.email = 'Enter a valid email address.';
    }

    if (tab === 'login' || tab === 'register') {
      if (!password) {
        errs.password = 'Please enter your password.';
      } else if (password.length < 8) {
        errs.password = 'Password must be at least 8 characters.';
      }
    }

    if (tab === 'register') {
      if (password !== confirmPassword) {
        errs.confirmPassword = 'Passwords do not match.';
      }

      if (activeMode === 'tourist') {
        if (!fullName.trim()) errs.fullName = 'Full name is required.';
      } else {
        if (!businessName.trim()) errs.businessName = 'Business name is required.';
        if (!ownerName.trim()) errs.ownerName = 'Owner/Manager name is required.';
        if (!phone.trim()) errs.phone = 'Phone number is required.';
      }
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});

    if (tab === 'forgot') {
      const res = await sendPasswordReset(email);
      if (res.success) setResetSuccess(true);
      return;
    }

    if (activeMode === 'tourist') {
      if (tab === 'login') {
        const res = await loginUser(email, password);
        if (res.success) setRoleSelection('tourist');
      } else {
        const res = await registerUser(fullName, email, password, phone);
        if (res.success) setRoleSelection('tourist');
      }
    } else {
      if (tab === 'login') {
        const res = await loginBusiness(email, password);
        if (res.success) setRoleSelection('provider');
      } else {
        const res = await registerBusiness(
          businessName, ownerName, email, password, phone, category, 'VERIFIED_GST', city
        );
        if (res.success) setRoleSelection('provider');
      }
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors duration-300 ${
      isLight ? 'bg-gradient-to-br from-slate-100 via-sky-50 to-emerald-50 text-slate-900' : 'bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-slate-100'
    }`}>
      
      {/* Background Decorative Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Single Authentication Card Wrapper */}
      <div className="max-w-xl w-full mx-auto z-10 flex flex-col items-center space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 backdrop-blur-md shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-sky-500" />
            <span className="text-[11px] font-black uppercase tracking-widest text-sky-500">Real-Time Travel Service Network</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-tight">
            ROAM<span className="text-sky-500">MATE</span>
          </h1>

          <p className="text-base font-black text-sky-600 font-display">
            "Your journey starts here."
          </p>
          <p className={`text-xs font-bold max-w-md mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Discover what you need, wherever your journey takes you.
          </p>
        </div>

        {/* SINGLE AUTHENTICATION CARD */}
        <div className={`w-full rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-6 relative transition-all duration-300 ${
          isLight ? 'bg-white border-slate-200 shadow-sky-500/5' : 'bg-slate-900/95 border-slate-800 shadow-sky-500/10 backdrop-blur-xl'
        }`}>
          
          {/* TOP-CENTER ANIMATED SEGMENTED ROLE SWITCH */}
          <div className="flex items-center justify-center">
            <div className={`relative p-1.5 rounded-2xl border flex items-center w-full max-w-sm ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
            }`}>
              
              {/* Sliding Background Indicator Pill (200-300ms transition) */}
              <div 
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl transition-all duration-300 ease-in-out shadow-md ${
                  activeMode === 'tourist' 
                    ? 'left-1.5 bg-gradient-to-r from-sky-600 to-sky-500 text-white' 
                    : 'left-[calc(50%+3px)] bg-gradient-to-r from-amber-600 to-amber-500 text-white'
                }`}
              />

              <button
                type="button"
                onClick={() => handleModeSwitch('tourist')}
                className={`relative z-10 flex-1 py-2 flex items-center justify-center gap-2 rounded-xl text-xs font-black transition-colors duration-200 cursor-pointer ${
                  activeMode === 'tourist' ? 'text-white' : isLight ? 'text-slate-700 hover:text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>👤 TOURIST</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeSwitch('provider')}
                className={`relative z-10 flex-1 py-2 flex items-center justify-center gap-2 rounded-xl text-xs font-black transition-colors duration-200 cursor-pointer ${
                  activeMode === 'provider' ? 'text-white' : isLight ? 'text-slate-700 hover:text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>🏢 SERVICE PROVIDER</span>
              </button>

            </div>
          </div>

          {/* Dynamic Form Heading & Subtitle */}
          <div className="text-center space-y-1 transition-all duration-300">
            {activeMode === 'tourist' ? (
              <>
                <h3 className="text-xl font-black font-display text-sky-500">
                  {tab === 'login' ? 'Welcome back, traveler' : tab === 'register' ? 'Start your journey' : 'Forgot your password?'}
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  {tab === 'login' ? 'Sign in and continue your journey with RoamMate.' : tab === 'register' ? 'Create your RoamMate account and discover useful services around you.' : 'Enter your email to receive password reset instructions.'}
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-black font-display text-amber-500">
                  {tab === 'login' ? 'Welcome, Service Provider' : tab === 'register' ? 'Register your service' : 'Reset your password'}
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  {tab === 'login' ? 'Sign in to manage your services and help travelers nearby.' : tab === 'register' ? 'Help travelers find your service when they need it.' : 'Enter your registered business email to receive reset instructions.'}
                </p>
              </>
            )}
          </div>

          {/* Backend Error Notification (Includes Role Mismatch Error Protection) */}
          {authError && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-600 text-xs font-black text-center shadow-sm">
              {authError}
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* REGISTER: Tourist Full Name */}
            {tab === 'register' && activeMode === 'tourist' && (
              <div>
                <label className="text-xs font-black uppercase text-slate-500 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                    }`}
                  />
                </div>
                {errors.fullName && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.fullName}</p>}
              </div>
            )}

            {/* REGISTER: Provider Business Name & Owner Name */}
            {tab === 'register' && activeMode === 'provider' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-slate-500 mb-1 block">Business Name</label>
                  <input
                    type="text"
                    placeholder="Agra Towing & Mechanics"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs font-bold ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                    }`}
                  />
                  {errors.businessName && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.businessName}</p>}
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-500 mb-1 block">Manager Name</label>
                  <input
                    type="text"
                    placeholder="Karthik Singireddy"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs font-bold ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Common Email Field */}
            <div>
              <label className="text-xs font-black uppercase text-slate-500 mb-1 block">
                {activeMode === 'provider' ? 'Business Email' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder={activeMode === 'provider' ? 'workshop@business.com' : 'traveler@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.email}</p>}
            </div>

            {/* REGISTER: Phone Number */}
            {tab === 'register' && (
              <div>
                <label className="text-xs font-black uppercase text-slate-500 mb-1 block">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="+91 98000 11223"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.phone}</p>}
              </div>
            )}

            {/* REGISTER: Provider Service Category & Address */}
            {tab === 'register' && activeMode === 'provider' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black uppercase text-slate-500 mb-1 block">Service Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs font-bold ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                      }`}
                    >
                      {SERVICE_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase text-slate-500 mb-1 block">City</label>
                    <input
                      type="text"
                      placeholder="Agra"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs font-bold ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-500 mb-1 block">Business Address</label>
                  <input
                    type="text"
                    placeholder="NH44 Highway Zone, Agra"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs font-bold ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                    }`}
                  />
                </div>
              </>
            )}

            {/* Password Field */}
            {tab !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black uppercase text-slate-500">Password</label>
                  {tab === 'login' && (
                    <button
                      type="button"
                      onClick={() => handleTabSwitch('forgot')}
                      className={`text-[11px] font-black hover:underline ${activeMode === 'provider' ? 'text-amber-500' : 'text-sky-500'}`}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.password}</p>}

                {/* Password Strength Indicator for Registration */}
                {tab === 'register' && password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-500">Password strength:</span>
                      <span className={strength.text}>{strength.label}</span>
                    </div>
                    <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.score}%` }} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Confirm Password (Registration only) */}
            {tab === 'register' && (
              <div>
                <label className="text-xs font-black uppercase text-slate-500 mb-1 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                    }`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isAuthLoading}
              className={`w-full py-3 rounded-xl text-white font-black text-xs transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer ${
                activeMode === 'provider' 
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400' 
                  : 'bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400'
              }`}
            >
              {isAuthLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{tab === 'login' ? 'Signing In...' : tab === 'register' ? (activeMode === 'provider' ? 'Registering Service...' : 'Creating Account...') : 'Sending Reset Link...'}</span>
                </>
              ) : (
                <span>{tab === 'login' ? 'Sign In' : tab === 'register' ? (activeMode === 'provider' ? 'Register Service' : 'Create Account') : 'Send Reset Link'}</span>
              )}
            </button>
          </form>

          {/* Social Google Login (Tourist Login/Register only) */}
          {activeMode === 'tourist' && tab !== 'forgot' && (
            <div className="space-y-3 pt-2 border-t border-slate-200/50">
              <button
                type="button"
                onClick={loginWithGoogle}
                className={`w-full py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isLight ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          )}

          {/* Footer Tab Switcher */}
          <div className="text-center text-xs font-bold pt-2 border-t border-slate-200/50">
            {tab === 'login' ? (
              <p className="text-slate-500">
                {activeMode === 'provider' ? "Don't have a partner account?" : "Don't have an account?"}{' '}
                <button 
                  type="button" 
                  onClick={() => handleTabSwitch('register')} 
                  className={`font-black hover:underline ${activeMode === 'provider' ? 'text-amber-500' : 'text-sky-500'}`}
                >
                  {activeMode === 'provider' ? 'Register your business' : 'Create one'}
                </button>
              </p>
            ) : (
              <p className="text-slate-500">
                Already registered?{' '}
                <button 
                  type="button" 
                  onClick={() => handleTabSwitch('login')} 
                  className={`font-black hover:underline ${activeMode === 'provider' ? 'text-amber-500' : 'text-sky-500'}`}
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          {/* Reset Link Success Message */}
          {resetSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold text-center">
              If an account exists with this email, password reset instructions have been sent.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
