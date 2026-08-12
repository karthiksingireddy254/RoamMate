import React, { useState, useEffect } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  X, MapPin, Eye, EyeOff, Lock, Mail, User, Phone, 
  ArrowRight, CheckCircle2, ShieldCheck, Compass, AlertCircle, Sparkles, Loader2, PartyPopper 
} from 'lucide-react';

export default function AuthModal() {
  const { 
    authMode, 
    setAuthMode, 
    loginUser, 
    registerUser, 
    loginWithGoogle, 
    sendPasswordReset,
    isAuthLoading,
    authError,
    setAuthError,
    authPromptMessage,
    setAuthPromptMessage,
    user
  } = useTravel();

  // Active view: 'login' | 'register' | 'forgot' | 'success'
  const [view, setView] = useState('register');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male'); // Default selected gender
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetSuccess, setResetSuccess] = useState(false);
  const [registeredName, setRegisteredName] = useState('');

  // Sync internal view state whenever authMode changes
  useEffect(() => {
    if (authMode === 'login' || authMode === 'register') {
      setView(authMode);
      setAuthError(null);
      setErrors({});
    }
  }, [authMode, setAuthError]);

  if (!authMode && !user) return null;
  if (!authMode) return null;

  // Real-time Field Validations
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const hasMinLength = password.length >= 8;
  const isPasswordsMatch = view === 'register' ? (password === confirmPassword && confirmPassword.length > 0) : true;

  // Password strength score calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: '', score: 0, color: 'bg-slate-800' };
    let score = 0;
    if (pwd.length >= 8) score += 40;
    if (/[A-Z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 20;
    if (/[!@#$%^&*]/.test(pwd)) score += 20;

    if (score <= 40) return { label: 'Weak', score: 33, color: 'bg-rose-500', text: 'text-rose-400' };
    if (score <= 80) return { label: 'Medium', score: 66, color: 'bg-amber-500', text: 'text-amber-400' };
    return { label: 'Strong', score: 100, color: 'bg-emerald-500', text: 'text-emerald-400' };
  };

  const strength = getPasswordStrength(password);

  const switchView = (newView) => {
    setView(newView);
    setAuthMode(newView === 'forgot' ? 'login' : newView);
    setAuthError(null);
    setErrors({});
    setResetSuccess(false);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!email.trim()) {
      errs.email = 'Please enter your email.';
    } else if (!isValidEmail) {
      errs.email = 'Enter a valid email address.';
    }

    if (view === 'login' || view === 'register') {
      if (!password) {
        errs.password = 'Please enter your password.';
      } else if (!hasMinLength) {
        errs.password = 'Password must contain at least 8 characters.';
      }
    }

    if (view === 'register') {
      if (!fullName.trim()) {
        errs.fullName = 'Please enter your full name.';
      }
      if (password !== confirmPassword) {
        errs.confirmPassword = 'Passwords do not match.';
      }
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (view === 'login') {
      const res = await loginUser(email, password);
      if (res.success) {
        setAuthPromptMessage(null);
        setAuthMode(null);
      }
    } else if (view === 'register') {
      const nameToDisplay = fullName.trim() || email.split('@')[0];
      setRegisteredName(nameToDisplay);
      
      const res = await registerUser(fullName, email, password, phone, gender);
      if (res.success) {
        setAuthPromptMessage(null);
        setView('success');
      }
    } else if (view === 'forgot') {
      await sendPasswordReset(email);
      setResetSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        
        {/* LEFT SIDE: Cinematic Scenic Travel Visual */}
        <div className="hidden md:flex flex-1 relative bg-slate-950 flex-col justify-between p-8 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&auto=format&fit=crop&q=80"
            alt="Scenic Travel Road"
            className="absolute inset-0 w-full h-full object-cover opacity-40 brightness-90 scale-105 hover:scale-110 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />

          {/* Top Brand Logo */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-display">Roam<span className="text-sky-400">Mate</span></span>
          </div>

          {/* Value Prop Content */}
          <div className="relative z-10 space-y-4 my-auto">
            <span className="text-[11px] uppercase font-extrabold tracking-widest px-3 py-1 rounded-full bg-sky-950/90 border border-sky-500/50 text-sky-300 backdrop-blur-md inline-flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Location-First Discovery</span>
            </span>
            <h2 className="text-3xl font-extrabold text-white font-display leading-tight drop-shadow-md">
              Your journey starts here.
            </h2>
            <p className="text-sm text-slate-300/90 max-w-sm leading-relaxed">
              Discover stays, food, fuel, transport, attractions and emergency assistance around you wherever your travel takes you.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-time GPS radius service discovery</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant breakdown & medical assistance squad</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Authentic verified places without AI hallucinations</span>
              </div>
            </div>
          </div>

          {/* Footer Badge */}
          <div className="relative z-10 text-[11px] text-slate-400 border-t border-slate-800/80 pt-4 flex items-center justify-between">
            <span>© RoamMate Travel</span>
            <span className="text-sky-400 font-semibold">Smart Local Layer</span>
          </div>
        </div>

        {/* RIGHT SIDE: Interactive Auth Form Card */}
        <div className="w-full md:w-[450px] bg-slate-900 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto relative">
          
          {/* Close Modal Button */}
          <button
            onClick={() => {
              setAuthPromptMessage(null);
              setAuthMode(null);
            }}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors z-20"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Mode Switcher (Visible on login & register views) */}
          {view !== 'success' && (
            <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-4 max-w-[280px]">
              <button
                type="button"
                onClick={() => switchView('register')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  view === 'register'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => switchView('login')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  view === 'login'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
            </div>
          )}

          {/* Guest Protection Access Banner */}
          {authPromptMessage && view !== 'success' && (
            <div className="mb-4 p-3.5 bg-amber-950/90 border border-amber-600/80 rounded-2xl text-xs text-amber-200 shadow-lg animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Account Required to Access Services</span>
              </div>
              <p className="text-[11px] text-amber-200/90 leading-snug">{authPromptMessage}</p>
            </div>
          )}

          {/* Heading Content */}
          {view !== 'success' && (
            <div className="space-y-1 mb-4">
              {view === 'register' && (
                <>
                  <h3 className="text-2xl font-bold text-slate-100 font-display">Start your journey</h3>
                  <p className="text-xs text-slate-400">
                    Create your RoamMate account to access full map services, navigation, and rescue.
                  </p>
                </>
              )}

              {view === 'login' && (
                <>
                  <h3 className="text-2xl font-bold text-slate-100 font-display">Welcome back, traveler</h3>
                  <p className="text-xs text-slate-400">
                    Sign in to discover everything around you, wherever your journey takes you.
                  </p>
                </>
              )}

              {view === 'forgot' && (
                <>
                  <h3 className="text-xl font-bold text-slate-100 font-display">Forgot your password?</h3>
                  <p className="text-xs text-slate-400">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                </>
              )}
            </div>
          )}

          {/* Error Banner */}
          {authError && view !== 'success' && (
            <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800 rounded-2xl flex items-start gap-2.5 text-xs text-rose-200 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* DEDICATED INSTANT & ATTRACTIVE ACCOUNT CREATION SUCCESS SCREEN */}
          {view === 'success' ? (
            <div className="py-6 my-auto text-center space-y-5 animate-in zoom-in-95 duration-300">
              
              {/* Glowing Celebratory Badge */}
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-sky-500 rounded-3xl blur-lg opacity-60 animate-pulse" />
                <div className="relative w-16 h-16 bg-slate-950 border-2 border-emerald-400 rounded-2xl flex items-center justify-center text-emerald-400 shadow-2xl">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>
              </div>

              {/* Title & Personalized Welcome */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 inline-block">
                  Account Created
                </span>
                <h3 className="text-2xl font-extrabold text-white font-display">
                  Welcome Aboard! 🎉
                </h3>
                <p className="text-xs text-slate-300">
                  <strong className="text-sky-400 capitalize">{registeredName || 'Traveler'}</strong>, your RoamMate account is active and all services are unlocked!
                </p>
              </div>

              {/* Unlocked Features List */}
              <div className="bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-2xl space-y-2 text-left text-xs">
                <div className="flex items-center gap-2 text-slate-200 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>📍 GPS Location & Radius discovery unlocked</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>🧭 Navigation, Calls & 15 Categories unlocked</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>⚡ 24/7 Roadside & emergency help ready</span>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={() => {
                  setAuthPromptMessage(null);
                  setAuthMode(null);
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Enter RoamMate Map & Access All Services</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>
          ) : view === 'forgot' && resetSuccess ? (
            /* FORGOT PASSWORD RESET CONFIRMATION */
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Reset Link Sent!</h4>
              <p className="text-xs text-slate-300">
                Password reset instructions have been sent to <strong className="text-sky-400">{email}</strong>.
              </p>
              <button
                type="button"
                onClick={() => switchView('login')}
                className="mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            /* DYNAMIC FORM */
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Full Name (Register Only) */}
              {view === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors(prev => ({ ...prev, fullName: null }));
                      }}
                      placeholder="John Doe"
                      className={`w-full bg-slate-950 border ${errors.fullName ? 'border-rose-500' : 'border-slate-800'} rounded-xl pl-9 pr-9 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors`}
                    />
                    {fullName.trim().length >= 2 && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {errors.fullName && <p className="text-[11px] text-rose-400">{errors.fullName}</p>}
                </div>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                    }}
                    placeholder="traveler@example.com"
                    className={`w-full bg-slate-950 border ${errors.email ? 'border-rose-500' : 'border-slate-800'} rounded-xl pl-9 pr-9 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors`}
                  />
                  {isValidEmail && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {errors.email && <p className="text-[11px] text-rose-400">{errors.email}</p>}
              </div>

              {/* Password (Login & Register) */}
              {(view === 'login' || view === 'register') && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    {view === 'login' && (
                      <button
                        type="button"
                        onClick={() => switchView('forgot')}
                        className="text-[11px] font-semibold text-sky-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                      }}
                      placeholder="••••••••"
                      className={`w-full bg-slate-950 border ${errors.password ? 'border-rose-500' : 'border-slate-800'} rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[11px] text-rose-400">{errors.password}</p>}

                  {/* Password Strength Indicator (Register Only) */}
                  {view === 'register' && password && (
                    <div className="pt-1 space-y-1">
                      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden flex gap-1 p-0.5">
                        <div className={`h-full flex-1 rounded-full transition-all duration-300 ${strength.score >= 33 ? strength.color : 'bg-slate-800'}`} />
                        <div className={`h-full flex-1 rounded-full transition-all duration-300 ${strength.score >= 66 ? strength.color : 'bg-slate-800'}`} />
                        <div className={`h-full flex-1 rounded-full transition-all duration-300 ${strength.score >= 100 ? strength.color : 'bg-slate-800'}`} />
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400">Password strength:</span>
                        <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Confirm Password (Register Only) */}
              {view === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: null }));
                      }}
                      placeholder="••••••••"
                      className={`w-full bg-slate-950 border ${errors.confirmPassword ? 'border-rose-500' : 'border-slate-800'} rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {isPasswordsMatch && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-9 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {errors.confirmPassword && <p className="text-[11px] text-rose-400">{errors.confirmPassword}</p>}
                </div>
              )}

              {/* Phone Number (Register Only) */}
              {view === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              {/* REACTIVE GENDER SELECTOR BUTTONS (Register Only) */}
              {view === 'register' && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold text-slate-300">Select Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('Male')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        gender === 'Male'
                          ? 'bg-sky-950 border-sky-500 text-sky-300 shadow-md shadow-sky-900/30 scale-105 ring-2 ring-sky-500/50'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm">👨</span>
                      <span>Male</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGender('Female')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        gender === 'Female'
                          ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-md shadow-rose-900/30 scale-105 ring-2 ring-rose-500/50'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm">👩</span>
                      <span>Female</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGender('Other')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        gender === 'Other'
                          ? 'bg-purple-950 border-purple-500 text-purple-300 shadow-md shadow-purple-900/30 scale-105 ring-2 ring-purple-500/50'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm">👤</span>
                      <span>Other</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2 group"
              >
                {isAuthLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{view === 'login' ? 'Signing in...' : view === 'register' ? 'Creating account...' : 'Sending link...'}</span>
                  </div>
                ) : (
                  <>
                    <span>{view === 'register' ? 'Create Account & Unlock Services' : view === 'login' ? 'Sign In' : 'Send Reset Link'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Social Auth & Switcher Footer */}
          {view !== 'forgot' && view !== 'success' && (
            <div className="space-y-3 pt-3 border-t border-slate-800/80 mt-3 text-center">
              
              {/* Google Social OAuth */}
              <button
                type="button"
                onClick={loginWithGoogle}
                className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.7-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Bottom Switch Link */}
              <p className="text-xs text-slate-400">
                {view === 'register' ? (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchView('login')}
                      className="text-sky-400 font-bold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchView('register')}
                      className="text-sky-400 font-bold hover:underline cursor-pointer"
                    >
                      Create one
                    </button>
                  </>
                )}
              </p>

            </div>
          )}

          {/* Back to Sign In from Forgot Password */}
          {view === 'forgot' && !resetSuccess && (
            <div className="pt-4 text-center border-t border-slate-800">
              <button
                type="button"
                onClick={() => switchView('login')}
                className="text-xs font-bold text-sky-400 hover:underline cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
