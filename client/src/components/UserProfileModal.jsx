import React from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  X, User, Mail, Phone, MapPin, Bookmark, LogOut, ShieldCheck, Sparkles 
} from 'lucide-react';

export default function UserProfileModal() {
  const { 
    user, 
    isProfileModalOpen, 
    setIsProfileModalOpen, 
    logoutUser, 
    currentLocation, 
    savedPlaceIds 
  } = useTravel();

  if (!isProfileModalOpen || !user) return null;

  const genderEmoji = user.gender === 'Female' ? '👩' : user.gender === 'Other' ? '👤' : '👨';
  const initial = user.name ? user.name[0].toUpperCase() : 'U';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header Cover Banner */}
        <div className="relative h-28 bg-gradient-to-r from-sky-900 via-emerald-950 to-slate-950 p-4 flex items-start justify-between">
          <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold bg-emerald-950/80 border border-emerald-700/80 px-2.5 py-1 rounded-full backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified RoamMate Traveler</span>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-950/80 hover:bg-slate-900 rounded-full border border-slate-700 transition-colors"
            title="Close Profile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Avatar & Primary Info (Overlapping header) */}
        <div className="px-6 pb-6 relative -mt-10 space-y-4">
          
          <div className="flex items-end justify-between">
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 p-0.5 shadow-xl">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl font-extrabold text-white">
                {initial}
              </div>
              <span className="absolute -bottom-1 -right-1 text-base bg-slate-900 border border-slate-700 p-0.5 rounded-full">
                {genderEmoji}
              </span>
            </div>

            <span className="text-[11px] font-semibold text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1 rounded-full">
              Member ID: {user.id ? user.id.slice(0, 10) : 'RM-9982'}
            </span>
          </div>

          <div className="space-y-0.5">
            <h3 className="text-xl font-extrabold text-white font-display flex items-center gap-2">
              <span>{user.name}</span>
              <Sparkles className="w-4 h-4 text-sky-400 fill-sky-400" />
            </h3>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>

          {/* User Details Grid */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            
            {/* Phone */}
            <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-sky-400" />
                <span>Phone Number:</span>
              </div>
              <span className="font-bold text-slate-100">{user.phone || 'Not Provided'}</span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-sky-400" />
                <span>Email Address:</span>
              </div>
              <span className="font-bold text-slate-100 max-w-[180px] truncate">{user.email}</span>
            </div>

            {/* Gender */}
            <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400">
                <User className="w-4 h-4 text-sky-400" />
                <span>Gender:</span>
              </div>
              <span className="font-bold text-sky-300 bg-sky-950 border border-sky-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span>{genderEmoji}</span>
                <span>{user.gender || 'Male'}</span>
              </span>
            </div>

            {/* Current Location */}
            <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>Active Zone:</span>
              </div>
              <span className="font-bold text-slate-100 max-w-[160px] truncate">{currentLocation.city || 'Panaji, Goa'}</span>
            </div>

            {/* Saved Bookmarks */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>Saved Places:</span>
              </div>
              <span className="font-bold text-amber-300 bg-amber-950 border border-amber-800 px-2.5 py-0.5 rounded-full">
                {savedPlaceIds.length} Saved
              </span>
            </div>

          </div>

          {/* Action Footer */}
          <div className="pt-2">
            <button
              onClick={logoutUser}
              className="w-full py-3 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Account</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
