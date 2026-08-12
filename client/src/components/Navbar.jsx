import React, { useState, useEffect } from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  MapPin, Navigation, Compass, Route, ShieldAlert, Bookmark, Grid, Map, List, Search, User, LogOut, LogIn, ArrowRight 
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
    setIsAllServicesModalOpen,
    setIsHelpMeModalOpen,
    setIsProfileModalOpen,
    searchKeyword,
    setSearchKeyword,
    setSelectedCategory,
    fetchServices,
    user,
    setAuthMode,
    logoutUser,
    requireAuth
  } = useTravel();

  // Local input state decoupled from context network refetches during typing
  const [queryInput, setQueryInput] = useState(searchKeyword);

  useEffect(() => {
    setQueryInput(searchKeyword);
  }, [searchKeyword]);

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!requireAuth(null, 'Please sign in or create an account to search services on RoamMate.')) {
      return;
    }
    const cleanQuery = queryInput.trim();
    setSearchKeyword(cleanQuery);
    setSelectedCategory('all');
    fetchServices(currentLocation.lat, currentLocation.lng, radiusKm, 'all', cleanQuery);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 px-3 sm:px-4 py-2.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Top Row: Brand & Location Badges */}
        <div className="flex items-center justify-between gap-3 shrink-0">
          
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
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-950 border border-emerald-700 px-1.5 py-0.5 rounded">Live Map</span>
            </div>
          </div>

          {/* Location Badge & Recenter GPS Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                requireAuth(() => setIsLocationModalOpen(true), 'Please sign in or create an account to pick your location.');
              }}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow cursor-pointer shrink-0"
              title="Change location"
            >
              <MapPin className={`w-3.5 h-3.5 ${isGpsActive ? 'text-sky-400' : 'text-amber-400'}`} />
              <span className="max-w-[110px] sm:max-w-[170px] truncate">{currentLocation.city || 'Select Location'}</span>
            </button>

            <button
              onClick={() => {
                requireAuth(() => requestLocation(), 'Please sign in or create an account to sync your GPS location.');
              }}
              className="flex items-center gap-1 bg-sky-950 hover:bg-sky-900 border border-sky-600 text-sky-300 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0"
              title="Recenter to my GPS location"
            >
              <Navigation className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span className="hidden sm:inline">My Location</span>
            </button>
          </div>

          {/* View Switcher (Mobile) */}
          <div className="flex sm:hidden items-center bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded ${viewMode === 'map' ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
              title="Map View"
            >
              <Map className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Middle / High Visibility Bright Search Bar */}
        <div className="flex items-center gap-2 flex-1 min-w-[260px] max-w-2xl w-full">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 flex items-center gap-2 w-full">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700 font-bold z-10" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="🔎 Search services & attractions (e.g. Mechanic, Taj Mahal, Hotel, Petrol)"
                style={{ color: '#000000', backgroundColor: '#ffffff', fontWeight: '800' }}
                className="w-full text-black bg-white placeholder-slate-500 text-xs sm:text-sm font-extrabold rounded-full pl-10 pr-9 py-2 border-2 border-sky-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/30 focus:outline-none shadow-xl transition-all"
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
              className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-black text-xs shadow-lg shadow-sky-500/30 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 uppercase tracking-wide"
              title="Search Services"
            >
              <Search className="w-3.5 h-3.5 text-white" />
              <span>Search</span>
            </button>
          </form>

          {/* Radius Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-full px-2.5 py-1 text-xs text-slate-300 shrink-0">
            <span className="hidden lg:inline text-[11px] text-slate-400 font-bold">Radius:</span>
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

        {/* Right Row: Navigation Tabs, User Profile / Auth Button */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs shrink-0">
          
          <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-colors ${activeTab === 'discover' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Discover</span>
            </button>
            
            <button
              onClick={() => {
                requireAuth(() => setActiveTab('explore'), 'Please sign in or create an account to access Explore mode.');
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-colors ${activeTab === 'explore' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <span>Explore</span>
            </button>

            <button
              onClick={() => {
                requireAuth(() => setActiveTab('route'), 'Please sign in or create an account to access On Route corridor discovery.');
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-colors ${activeTab === 'route' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Route className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">On Route</span>
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

          {/* Desktop View Switcher */}
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

          {/* User Auth Profile Button */}
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
    </header>
  );
}
