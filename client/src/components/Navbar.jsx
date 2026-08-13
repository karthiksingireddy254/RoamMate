import React, { useState, useEffect } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  MapPin, Navigation, Compass, ShieldAlert, Map, List, Search, LogIn, Sun, Moon, Building2, PlusCircle 
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

  const isLight = theme === 'light';

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
      isLight ? 'bg-white border-slate-200 text-slate-900 shadow-md' : 'bg-slate-950 border-slate-800 text-slate-100'
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
                <span className={`text-xl font-black tracking-tight font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Roam<span className="text-sky-500">Mate</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider font-black text-emerald-600 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded">
                  Vehicle Services
                </span>
              </div>
            </div>

            {/* Location Badge & Recenter GPS Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  requireAuth(() => setIsLocationModalOpen(true), 'Please sign in or create an account to pick your location.');
                }}
                className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-full text-xs font-black transition-all shadow cursor-pointer ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-700'
                }`}
                title="Change location"
              >
                <MapPin className={`w-3.5 h-3.5 ${isGpsActive ? 'text-sky-500' : 'text-amber-500'}`} />
                <span className="max-w-[120px] sm:max-w-[180px] truncate">{currentLocation.city || 'Select Location'}</span>
              </button>

              <button
                onClick={() => {
                  requireAuth(() => requestLocation(), 'Please sign in or create an account to sync your GPS location.');
                }}
                className="flex items-center gap-1 bg-sky-600 hover:bg-sky-500 text-white px-2.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-md"
                title="Recenter to my GPS location"
              >
                <Navigation className="w-3.5 h-3.5 text-white animate-pulse" />
                <span className="hidden sm:inline">My Location</span>
              </button>
            </div>
          </div>

          {/* Right Controls: Theme Switcher, Business Portal & User Auth */}
          <div className="flex items-center gap-2 text-xs">
            
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all active:scale-95 shadow cursor-pointer flex items-center gap-1.5 font-black ${
                isLight ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200' : 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
              }`}
              title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
            >
              {isLight ? (
                <>
                  <Moon className="w-4 h-4 text-sky-600" />
                  <span className="hidden md:inline text-xs font-black text-slate-900">Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline text-xs font-black text-amber-300">Light Mode</span>
                </>
              )}
            </button>



            {/* Navigation Tabs */}
            <nav className={`flex items-center gap-1 p-1 rounded-xl border ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-900 border-slate-800'
            }`}>
              <button
                onClick={() => setActiveTab('discover')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-black transition-colors ${
                  activeTab === 'discover' ? 'bg-sky-600 text-white shadow-sm' : isLight ? 'text-slate-700 hover:text-black' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Discover</span>
              </button>

              <button
                onClick={() => {
                  requireAuth(() => setIsHelpMeModalOpen(true), 'Please sign in or create an account to trigger Help Me emergency assistance.');
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-black bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer shadow-sm"
                title="Help Me Now emergency assistance"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-white animate-bounce" />
                <span>Help</span>
              </button>
            </nav>

            {/* View Switcher */}
            <div className={`hidden sm:flex items-center p-1 rounded-xl border ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-900 border-slate-800'
            }`}>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-black text-xs transition-colors ${
                  viewMode === 'map' ? 'bg-sky-600 text-white shadow' : isLight ? 'text-slate-700 hover:text-black' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-black text-xs transition-colors ${
                  viewMode === 'list' ? 'bg-sky-600 text-white shadow' : isLight ? 'text-slate-700 hover:text-black' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>

            {/* Traveler Auth Button */}
            {user ? (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl font-black transition-all shadow-md group cursor-pointer ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300' : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-700'
                }`}
                title="View Profile Details"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-500 to-emerald-500 text-white font-black text-xs flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="max-w-[90px] truncate hidden md:inline font-black">{user.name || 'Profile'}</span>
                <span className="text-xs">{user.gender === 'Female' ? '👩' : user.gender === 'Other' ? '👤' : '👨'}</span>
              </button>
            ) : (
              <button
                onClick={() => setAuthMode('register')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-black transition-all shadow-md animate-pulse cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            )}

          </div>

        </div>

        {/* Row 2: Dedicated Full-Width Prominent Search Bar */}
        <div className={`w-full p-2 rounded-2xl border shadow-xl flex items-center gap-2 ${
          isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <form onSubmit={handleSearchSubmit} className="relative flex-1 flex items-center gap-2 w-full">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700 font-bold z-10" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="🔎 Search vehicle services (e.g. Mechanic, Towing, Car Breakdown, Fuel, EV Charger)"
                style={{ color: '#000000', backgroundColor: '#ffffff', fontWeight: '800' }}
                className="w-full text-black bg-white placeholder-slate-500 text-sm font-black rounded-full pl-10 pr-9 py-2.5 border-2 border-sky-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/30 focus:outline-none shadow-xl transition-all"
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
          <div className={`flex items-center gap-1.5 border rounded-full px-3 py-1.5 text-xs shrink-0 ${
            isLight ? 'bg-white border-slate-300 text-slate-900 font-black' : 'bg-slate-950 border-slate-700 text-slate-300 font-bold'
          }`}>
            <span className="text-[11px] text-slate-500 font-black">Radius:</span>
            <select
              value={radiusKm}
              onChange={(e) => {
                const val = Number(e.target.value);
                requireAuth(() => setRadiusKm(val), 'Please sign in or create an account to change search radius.');
              }}
              className="bg-transparent text-sky-600 font-black focus:outline-none cursor-pointer text-xs"
            >
              <option value={1} className={isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}>1 km</option>
              <option value={3} className={isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}>3 km</option>
              <option value={5} className={isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}>5 km</option>
              <option value={10} className={isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}>10 km</option>
              <option value={25} className={isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}>25 km</option>
            </select>
          </div>
        </div>

      </div>
    </header>
  );
}
