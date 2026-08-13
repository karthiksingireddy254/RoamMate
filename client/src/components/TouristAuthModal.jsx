import React, { useState, useEffect } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  X, Eye, EyeOff, Lock, Mail, User, Phone, 
  MapPin, CheckCircle2, ShieldCheck, ArrowRight, Loader2 
} from 'lucide-react';

export default function TouristAuthModal() {
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
    user,
    setRoleSelection,
    theme
  } = useTravel();

  const isLight = theme === 'light';

  // Active view: 'login' | 'register' | 'forgot'
  const [view, setView] = useState('login');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetSuccess, setResetSuccess] = useState(false);

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
      errs.email = 'Please enter your email address.';
    } else if (!isValidEmail) {
      errs.email = 'Enter a valid email address.';
    }

    if (view === 'login' || view === 'register') {
      if (!password) {
        errs.password = 'Please enter your password.';
      } else if (!hasMinLength) {
        errs.password = 'Password must be at least 8 characters.';
      }
    }

    if (view === 'register') {
      if (!fullName.trim()) {
        errs.fullName = 'Full name is required.';
      }
      if (!confirmPassword) {
        errs.confirmPassword = 'Please confirm your password.';
      } else if (password !== confirmPassword) {
        errs.confirmPassword = 'Passwords do not match.';
      }
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});

    if (view === 'login') {
      const res = await loginUser(email, password);
      if (res.success) {
        setRoleSelection('tourist');
        setAuthMode(null);
      }
    } else if (view === 'register') {
      const res = await registerUser(fullName, email, password, phone);
      if (res.success) {
        setRoleSelection('tourist');
        setAuthMode(null);
      }
    } else if (view === 'forgot') {
      const res = await sendPasswordReset(email);
      if (res.success) {
        setResetSuccess(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      
      {/* Modal Split-Screen Card */}
      <div className={`max-w-4xl w-full rounded-3xl border shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative transition-all duration-300 ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        
        {/* Close Button */}
        <button
          onClick={() => setAuthMode(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-slate-700/80 backdrop-blur-md transition-colors"
          title="Close authentication"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Desktop LEFT Column: Scenic Travel Identity Visual */}
        <div className="hidden md:flex relative flex-col justify-between p-8 bg-gradient-to-br from-sky-600 via-sky-700 to-emerald-700 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80')] bg-cover bg-center" />
          
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="font-black tracking-tight text-lg">RoamMate</span>
            </div>
            <p className="text-xs uppercase tracking-widest font-black text-sky-200">Traveler Discovery Portal</p>
          </div>

          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl font-black leading-tight drop-shadow-md">
              "Discover what you need, wherever your journey takes you."
            </h2>
            <div className="space-y-2 text-xs font-bold text-sky-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>GPS radius search for nearby vehicle services</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>24/7 Roadside emergency assistance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Direct navigate & one-tap phone calls</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[11px] font-bold text-sky-200">
            Real-time travel service network • Powered by GPS
          </div>
        </div>

        {/* Right Column: Authentication Card Form */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          
          {/* Header */}
          <div className="space-y-2">
            {authPromptMessage && (
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-600 text-xs font-bold mb-3">
                {authPromptMessage}
              </div>
            )}

            <span className="text-[10px] font-black uppercase tracking-wider text-sky-500">
              👤 Tourist Account
            </span>

            {view === 'login' && (
              <>
                <h3 className="text-2xl font-black font-display">Welcome back, traveler</h3>
                <p className="text-xs font-bold text-slate-500">Sign in and continue your journey with RoamMate.</p>
              </>
            )}

            {view === 'register' && (
              <>
                <h3 className="text-2xl font-black font-display">Start your journey</h3>
                <p className="text-xs font-bold text-slate-500">Create your RoamMate account and discover useful services around you.</p>
              </>
            )}

            {view === 'forgot' && (
              <>
                <h3 className="text-2xl font-black font-display">Forgot your password?</h3>
                <p className="text-xs font-bold text-slate-500">Enter your email and we'll send you a password reset link.</p>
              </>
            )}
          </div>

          {/* Auth Error Notification */}
          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-600 text-xs font-black">
              {authError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name (Sign Up only) */}
            {view === 'register' && (
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
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white' : 'bg-slate-950 border-slate-800 text-slate-100'
                    }`}
                  />
                </div>
                {errors.fullName && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.fullName}</p>}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="text-xs font-black uppercase text-slate-500 mb-1 block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="traveler@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white' : 'bg-slate-950 border-slate-800 text-slate-100'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.email}</p>}
            </div>

            {/* Phone (Optional for Sign Up) */}
            {view === 'register' && (
              <div>
                <label className="text-xs font-black uppercase text-slate-500 mb-1 block">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="+91 98000 11223"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white' : 'bg-slate-950 border-slate-800 text-slate-100'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            {view !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black uppercase text-slate-500">Password</label>
                  {view === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchView('forgot')}
                      className="text-[11px] text-sky-500 font-black hover:underline"
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
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white' : 'bg-slate-950 border-slate-800 text-slate-100'
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

                {/* Password Strength Indicator (Small & Unobtrusive) */}
                {view === 'register' && password && (
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

            {/* Confirm Password (Sign Up only) */}
            {view === 'register' && (
              <div>
                <label className="text-xs font-black uppercase text-slate-500 mb-1 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white' : 'bg-slate-950 border-slate-800 text-slate-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-black text-xs transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAuthLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{view === 'login' ? 'Signing In...' : view === 'register' ? 'Creating Account...' : 'Sending Reset Link...'}</span>
                </>
              ) : (
                <span>{view === 'login' ? 'Sign In' : view === 'register' ? 'Create Account' : 'Send Reset Link'}</span>
              )}
            </button>
          </form>

          {/* Social Google Login Button (for Login / Register) */}
          {view !== 'forgot' && (
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

              <div className="text-center text-xs font-bold">
                {view === 'login' ? (
                  <p className="text-slate-500">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => switchView('register')} className="text-sky-500 font-black hover:underline">
                      Create one
                    </button>
                  </p>
                ) : (
                  <p className="text-slate-500">
                    Already have an account?{' '}
                    <button type="button" onClick={() => switchView('login')} className="text-sky-500 font-black hover:underline">
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Reset link success message */}
          {resetSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold text-center">
              Password reset instructions have been sent to your email.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
