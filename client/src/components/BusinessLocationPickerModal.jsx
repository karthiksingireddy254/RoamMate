import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { X, Search, Navigation, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import { useTravel } from '../context/TravelContext';

const GOOGLE_MAPS_TILES = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

export default function BusinessLocationPickerModal({ isOpen, onClose, onConfirmLocation, initialLat, initialLng, initialAddress }) {
  const { currentLocation, requestLocation, theme } = useTravel();
  const isLight = theme === 'light';

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const startLat = parseFloat(initialLat) || currentLocation?.lat || 27.1767;
  const startLng = parseFloat(initialLng) || currentLocation?.lng || 78.0081;

  const [selectedLat, setSelectedLat] = useState(startLat);
  const [selectedLng, setSelectedLng] = useState(startLng);
  const [addressText, setAddressText] = useState(initialAddress || 'Selected Location');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedLat, selectedLng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer(GOOGLE_MAPS_TILES, {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const markerIcon = L.divIcon({
        className: 'custom-business-picker-marker',
        html: `
          <div style="background: #ea580c; color: white; padding: 6px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });

      const marker = L.marker([selectedLat, selectedLng], {
        icon: markerIcon,
        draggable: true
      }).addTo(map);

      // Handle marker drag end
      marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        updateLocation(lat, lng, true);
      });

      // Handle map click
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        updateLocation(lat, lng, true);
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  const updateLocation = async (lat, lng, reverseGeocode = false) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
    setIsConfirmed(false);

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([lat, lng]);
    }

    if (reverseGeocode) {
      setIsGeocoding(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.display_name) {
            setAddressText(data.display_name);
          }
        }
      } catch (err) {
        console.warn('Reverse geocode failed:', err);
      } finally {
        setIsGeocoding(false);
      }
    }
  };

  const handleGPSLocation = () => {
    requestLocation();
    if (currentLocation?.lat && currentLocation?.lng) {
      updateLocation(currentLocation.lat, currentLocation.lng, true);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data || []);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    setAddressText(item.display_name);
    setSearchResults([]);
    setSearchQuery('');
    updateLocation(lat, lng, false);
  };

  const handleConfirm = () => {
    if (selectedLat < -90 || selectedLat > 90 || selectedLng < -180 || selectedLng > 180) {
      alert('Invalid latitude or longitude range.');
      return;
    }
    setIsConfirmed(true);
    onConfirmLocation({
      lat: selectedLat,
      lng: selectedLng,
      address: addressText,
      city: addressText.split(',')[1]?.trim() || addressText.split(',')[0]?.trim() || 'Selected City'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      
      {/* Modal Container */}
      <div className={`max-w-2xl w-full rounded-3xl border shadow-2xl overflow-hidden flex flex-col relative transition-all ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 block">
              📍 Business Location Selector
            </span>
            <h3 className="text-xl font-black font-display">Select Business Location</h3>
            <p className="text-xs font-bold text-slate-500">
              Select the exact location of your business so travelers can find you easily.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-200/50 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* 1. Search Location & GPS Auto-detect Controls */}
          <div className="space-y-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for a business location (e.g. Karimnagar Main Road)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-bold ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs transition-all shadow-md shrink-0 flex items-center gap-1.5"
              >
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Search</span>
              </button>
            </form>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="p-2 rounded-xl border bg-slate-950/90 border-slate-800 space-y-1 max-h-40 overflow-y-auto z-30">
                <span className="text-[10px] font-black uppercase text-amber-500 px-2">Matching Search Locations</span>
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSearchResult(item)}
                    className="w-full text-left p-2 rounded-lg text-xs font-bold text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{item.display_name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* GPS Auto-detect Button */}
            <button
              type="button"
              onClick={handleGPSLocation}
              className="w-full py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-600 font-black text-xs flex items-center justify-center gap-2 hover:bg-sky-500/20 transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-sky-500 animate-pulse" />
              <span>📍 Use My Current Location</span>
            </button>
          </div>

          {/* 2. Interactive Map (Click or Drag Marker) */}
          <div className="relative w-full h-64 rounded-2xl border overflow-hidden shadow-inner">
            <div ref={mapContainerRef} className="w-full h-full" />
            <div className="absolute top-2 left-2 z-[400] bg-slate-950/80 text-white text-[10px] font-bold px-3 py-1 rounded-full border border-slate-700 backdrop-blur-md">
              💡 Click map or drag marker to set exact location
            </div>
          </div>

          {/* 3. Selected Coordinates & Resolved Address Summary */}
          <div className="p-4 rounded-2xl border bg-slate-500/5 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-black">
              <div className="flex items-center gap-1.5 text-amber-600">
                <MapPin className="w-4 h-4" />
                <span>📍 Latitude: {selectedLat.toFixed(6)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-600">
                <MapPin className="w-4 h-4" />
                <span>📍 Longitude: {selectedLng.toFixed(6)}</span>
              </div>
            </div>

            <div className="text-xs font-bold text-slate-500">
              <span className="font-black text-slate-700 dark:text-slate-300">Resolved Address: </span>
              {isGeocoding ? 'Resolving address...' : addressText}
            </div>
          </div>

          {/* 4. Confirm Location Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleConfirm}
              className={`w-full py-3 rounded-xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                isConfirmed
                  ? 'bg-emerald-600 text-white border border-emerald-500'
                  : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isConfirmed ? '✓ Business Location Confirmed' : 'Confirm Location'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
