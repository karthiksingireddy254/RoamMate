import React, { useState, useEffect } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  MapPin, Navigation, Compass, Route, ShieldAlert, Map, List, Search, User, LogIn, Sun, Moon, Building2, Briefcase, PlusCircle 
} from 'lucide-react';

export default function Navbar() {
  const {
    currentLocation,
    isGpsActive,
    radiusKm,
    setRadiusKm,
    requestLocation,
    setIsLocationModalOpen,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    setIsHelpMeModalOpen,
    setIsProfileModalOpen,
    setIsBusinessModalOpen,
    searchKeyword,
    setSearchKeyword,
    setSelectedCategory,
    fetchServices,
    theme,
    toggleTheme,
    user,
    businessUser,
    setAuthMode,
    requireAuth
  } = useTravel();

  // Local input state decoupled from context network refetches during typing
  const [queryInput, setQueryInput] = useState(searchKeyword);

  useEffect(() => {
    setQueryInput(searchKeyword);
  }, [searchKeyword]);

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!requireAuth(null, 'Please sign in or create an account to search vehicle services on RoamMate.')) {
      return;
    }
    const cleanQuery = queryInput.trim();
    setSearchKeyword(cleanQuery);
    setSelectedCategory('all');
    fetchServices(currentLocation.lat, currentLocation.lng, radiusKm, 'all', cleanQuery);
  };

  return (
    <header className={`sticky top-0 z-40 border-b px-3 sm:px-4 py-2.5 shadow-xl transition-colors ${
      theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-900 border-slate-700 text-white'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
        
        {/* Row 1: Brand Logo, Location Badges, Theme Toggle, Business Portal & Auth Buttons */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          
          {/* Brand Logo & Location Badges */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => {
                setSelectedCategory('all');
                setSearchKeyword('');
                setQueryInput('');
                setActiveTab('discover');
              }}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white font-display">Roam<span className="text-sky-400">Mate</span></span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-950 border border-emerald-700 px-1.5 py-0.5 rounded">Vehicle Services</span>
              </div>
            </div>

            {/* Location Badge & Recenter GPS Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  requireAuth(() => setIsLocationModalOpen(true), 'Please sign in or create an account to pick your location.');
                }}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow cursor-pointer"
                title="Change location"
              >
                <MapPin className={`w-3.5 h-3.5 ${isGpsActive ? 'text-sky-400' : 'text-amber-400'}`} />
                <span className="max-w-[120px] sm:max-w-[180px] truncate">{currentLocation.city || 'Select Location'}</span>
              </button>

              <button
                onClick={() => {
                  requireAuth(() => requestLocation(), 'Please sign in or create an account to sync your GPS location.');
                }}
                className="flex items-center gap-1 bg-sky-950 hover:bg-sky-900 border border-sky-600 text-sky-300 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer"
                title="Recenter to my GPS location"
              >
                <Navigation className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span className="hidden sm:inline">My Location</span>
              </button>
            </div>
          </div>

          {/* Right Controls: Theme Switcher, Business Portal & User Auth */}
          <div className="flex items-center gap-2 text-xs">
            
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 transition-transform active:scale-95 shadow cursor-pointer flex items-center gap-1"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline text-[11px] font-bold text-amber-300">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-sky-400" />
                  <span className="hidden md:inline text-[11px] font-bold text-sky-300">Dark</span>
                </>
              )}
            </button>

            {/* Dedicated Business Organization / Partner Portal Button */}
            {businessUser ? (
              <button
                onClick={() => setIsBusinessModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-extrabold shadow-md cursor-pointer"
                title="Business Partner Dashboard - Add / Update Services"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="max-w-[100px] truncate">{businessUser.businessName}</span>
                <PlusCircle className="w-3.5 h-3.5 text-amber-100" />
              </button>
            ) : (
              <button
                onClick={() => setIsBusinessModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/60 text-amber-400 font-extrabold shadow cursor-pointer transition-all hover:border-amber-400"
                title="Business Organizations & Workshop Service Providers Sign In / Register"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Business Partner</span>
              </button>
            )}

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('discover')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-colors ${activeTab === 'discover' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Discover</span>
              </button>

              <button
                onClick={() => {
                  requireAuth(() => setIsHelpMeModalOpen(true), 'Please sign in or create an account to trigger Help Me emergency assistance.');
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-extrabold bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900 transition-colors cursor-pointer"
                title="Help Me Now emergency assistance"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                <span>Help</span>
              </button>
            </nav>

            {/* View Switcher */}
            <div className="hidden sm:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs transition-colors ${viewMode === 'map' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs transition-colors ${viewMode === 'list' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>

            {/* Traveler Auth Button */}
            {user ? (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 border border-slate-700 text-slate-100 px-3 py-1.5 rounded-xl font-bold transition-all shadow-md group cursor-pointer"
                title="View Profile Details"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-500 to-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="max-w-[90px] truncate hidden md:inline font-black text-white">{user.name || 'Profile'}</span>
                <span className="text-xs">{user.gender === 'Female' ? '👩' : user.gender === 'Other' ? '👤' : '👨'}</span>
              </button>
            ) : (
              <button
                onClick={() => setAuthMode('register')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-extrabold transition-all shadow-md animate-pulse cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            )}

          </div>

        </div>

        {/* Row 2: Dedicated Full-Width Prominent Search Bar */}
        <div className="w-full bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shadow-2xl flex items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 flex items-center gap-2 w-full">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700 font-bold z-10" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="🔎 Search vehicle services (e.g. Mechanic, Fuel, EV Fast Charger, Towing, Parking)"
                style={{ color: '#000000', backgroundColor: '#ffffff', fontWeight: '800' }}
                className="w-full text-black bg-white placeholder-slate-500 text-sm font-extrabold rounded-full pl-10 pr-9 py-2.5 border-2 border-sky-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/30 focus:outline-none shadow-xl transition-all"
              />
              {queryInput && (
                <button
                  type="button"
                  onClick={() => {
                    setQueryInput('');
                    setSearchKeyword('');
                    setSelectedCategory('all');
                    fetchServices(currentLocation.lat, currentLocation.lng, radiusKm, 'all', '');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 hover:text-black text-xs font-black cursor-pointer bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center transition-colors z-10"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-black text-xs sm:text-sm shadow-lg shadow-sky-500/30 transition-all flex items-center gap-2 cursor-pointer shrink-0 uppercase tracking-wider"
              title="Search Vehicle Services"
            >
              <Search className="w-4 h-4 text-white" />
              <span>SEARCH</span>
            </button>
          </form>

          {/* Radius Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-full px-3 py-1.5 text-xs text-slate-300 shrink-0">
            <span className="text-[11px] text-slate-400 font-bold">Radius:</span>
            <select
              value={radiusKm}
              onChange={(e) => {
                const val = Number(e.target.value);
                requireAuth(() => setRadiusKm(val), 'Please sign in or create an account to change search radius.');
              }}
              className="bg-transparent text-sky-400 font-extrabold focus:outline-none cursor-pointer text-xs"
            >
              <option value={1} className="bg-slate-900 text-slate-100">1 km</option>
              <option value={3} className="bg-slate-900 text-slate-100">3 km</option>
              <option value={5} className="bg-slate-900 text-slate-100">5 km</option>
              <option value={10} className="bg-slate-900 text-slate-100">10 km</option>
              <option value={25} className="bg-slate-900 text-slate-100">25 km</option>
            </select>
          </div>
        </div>

      </div>
    </header>
  );
}
