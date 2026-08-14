import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useTravel } from '../context/TravelContext';
import { Navigation, Compass, Layers } from 'lucide-react';

const CATEGORY_DEFAULT_IMAGES = {
  stay: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&auto=format&fit=crop&q=80',
  food: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&auto=format&fit=crop&q=80',
  fuel: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=100&auto=format&fit=crop&q=80',
  ev: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=100&auto=format&fit=crop&q=80',
  service: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=100&auto=format&fit=crop&q=80',
  towing: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=100&auto=format&fit=crop&q=80',
  medical: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&auto=format&fit=crop&q=80',
  transport: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&auto=format&fit=crop&q=80',
  explore: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&auto=format&fit=crop&q=80',
  parking: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=100&auto=format&fit=crop&q=80',
  restroom: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=100&auto=format&fit=crop&q=80',
  atm: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=100&auto=format&fit=crop&q=80',
  rental: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=100&auto=format&fit=crop&q=80',
  essentials: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=100&auto=format&fit=crop&q=80',
  convenience: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&auto=format&fit=crop&q=80'
};

const CATEGORY_MARKER_COLORS = {
  stay: '#6366f1',
  food: '#f59e0b',
  fuel: '#10b981',
  ev: '#06b6d4',
  service: '#64748b',
  towing: '#a855f7',
  medical: '#f43f5e',
  transport: '#3b82f6',
  explore: '#14b8a6',
  parking: '#0284c7',
  restroom: '#d97706',
  atm: '#059669',
  rental: '#8b5cf6',
  essentials: '#475569',
  convenience: '#0d9488'
};

// Live Google Maps Tiles Engine URLs
const GOOGLE_MAPS_TILES = {
  streets: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
  hybrid: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
  terrain: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
};

export default function MapView() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const radiusCircleRef = useRef(null);
  const userMarkerRef = useRef(null);
  const markersLayerGroupRef = useRef(null);

  const [mapStyle, setMapStyle] = useState('streets');

  const {
    currentLocation,
    radiusKm,
    setRadiusKm,
    nearbyServices,
    selectedService,
    setSelectedService,
    requestLocation,
    setManualLocation,
    isLoading,
    requireAuth,
    isGpsActive
  } = useTravel();

  const isInternalMoveRef = useRef(false);
  const moveTimeoutRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentLocation.lat, currentLocation.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Up-to-date Google Maps tile layer
      tileLayerRef.current = L.tileLayer(GOOGLE_MAPS_TILES.streets, {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersLayerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Map Click & Map Pan/Drag (moveend) Discovery Event Listeners
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Map Click Event: Discovery location set to tapped point
    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      isInternalMoveRef.current = true;
      setManualLocation(lat, lng, `Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`);
    };

    // 2. Map MoveEnd (Pan/Drag) Event: Discovery location set to new map center after 650ms debounce
    const handleMapMoveEnd = () => {
      if (isInternalMoveRef.current) {
        isInternalMoveRef.current = false;
        return;
      }

      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
      moveTimeoutRef.current = setTimeout(() => {
        const center = map.getCenter();
        const dist = Math.sqrt(Math.pow(center.lat - currentLocation.lat, 2) + Math.pow(center.lng - currentLocation.lng, 2));
        if (dist > 0.003) {
          setManualLocation(center.lat, center.lng, `Map Discovery Center`);
        }
      }, 650);
    };

    map.on('click', handleMapClick);
    map.on('moveend', handleMapMoveEnd);

    return () => {
      map.off('click', handleMapClick);
      map.off('moveend', handleMapMoveEnd);
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    };
  }, [currentLocation.lat, currentLocation.lng, setManualLocation]);

  // Handle live Map Style Switcher (Google Streets vs Hybrid Satellite)
  useEffect(() => {
    if (mapInstanceRef.current && tileLayerRef.current) {
      tileLayerRef.current.setUrl(GOOGLE_MAPS_TILES[mapStyle]);
    }
  }, [mapStyle]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { lat, lng } = currentLocation;

    isInternalMoveRef.current = true;
    map.flyTo([lat, lng], radiusKm <= 3 ? 14 : radiusKm <= 10 ? 13 : 11, {
      duration: 1.0
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([lat, lng]);
    } else {
      const userIcon = L.divIcon({
        className: 'custom-user-icon',
        html: `<div class="user-location-pin" title="Discovery Center"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });
      userMarkerRef.current = L.marker([lat, lng], { icon: userIcon }).addTo(map);
    }

    if (radiusCircleRef.current) {
      radiusCircleRef.current.setLatLng([lat, lng]);
      radiusCircleRef.current.setRadius(radiusKm * 1000);
    } else {
      radiusCircleRef.current = L.circle([lat, lng], {
        radius: radiusKm * 1000,
        color: '#0284c7',
        fillColor: '#0284c7',
        fillOpacity: 0.08,
        weight: 2,
        dashArray: '6, 6'
      }).addTo(map);
    }
  }, [currentLocation.lat, currentLocation.lng, radiusKm]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = markersLayerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    const bounds = L.latLngBounds();
    bounds.extend([currentLocation.lat, currentLocation.lng]);

    const categoryBadges = {
      fuel: '⛽',
      ev: '⚡',
      towing: '🚚',
      service: '🔧'
    };

    nearbyServices.forEach((place) => {
      const isSelected = selectedService && selectedService.id === place.id;
      const catColor = CATEGORY_MARKER_COLORS[place.category] || '#0284c7';
      const imgUrl = place.image || CATEGORY_DEFAULT_IMAGES[place.category] || CATEGORY_DEFAULT_IMAGES.explore;
      const badgeIcon = categoryBadges[place.category] || '📍';

      bounds.extend([place.lat, place.lng]);

      const markerHtml = `
        <div class="custom-service-marker ${isSelected ? 'active-marker' : ''}" style="border-color: ${catColor}; position: relative; overflow: visible;" title="${place.name}">
          <img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
          <span style="position: absolute; bottom: -3px; right: -3px; background: #0f172a; border: 1.5px solid ${catColor}; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 10px;">${badgeIcon}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: markerHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon });

      const popupContent = `
        <div style="min-width: 190px; padding: 4px; font-family: sans-serif;">
          <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 3px;">${place.name}</div>
          <div style="margin-bottom: 5px;">
            <span style="background: ${place.sourceType === 'ROAMMATE_REGISTERED' ? '#dcfce7' : '#e0f2fe'}; color: ${place.sourceType === 'ROAMMATE_REGISTERED' ? '#15803d' : '#0369a1'}; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 9999px;">${place.sourceLabel}</span>
          </div>
          <div style="font-size: 11px; color: #334155; font-weight: 700; margin-bottom: 2px;">
            📍 <b>${place.distanceKm} km</b> away • ⭐ ${place.rating || 4.8}
          </div>
          <div style="font-size: 10px; color: #16a34a; font-weight: 700;">
            🟢 ${place.status || 'Available Now'}
          </div>
        </div>
      `;
      marker.bindPopup(popupContent, { offset: [0, -15] });

      marker.on('click', () => {
        requireAuth(() => {
          setSelectedService(place);
          map.flyTo([place.lat, place.lng], 15, { duration: 0.8 });
        }, `Please sign in or create an account to view service details for ${place.name}.`);
      });

      layerGroup.addLayer(marker);
    });

    if (nearbyServices.length > 0 && !selectedService) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [nearbyServices, selectedService, setSelectedService, currentLocation.lat, currentLocation.lng, requireAuth]);

  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden rounded-2xl border border-slate-800 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Left Radius Quick Switcher Pills */}
      <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 border border-slate-700/90 rounded-xl p-1.5 shadow-lg backdrop-blur-md flex items-center gap-1">
        <span className="text-[11px] font-black text-slate-400 px-1">Radius:</span>
        {[5, 10, 15, 25, 50].map((r) => (
          <button
            key={r}
            onClick={() => setRadiusKm(r)}
            className={`px-2 py-0.5 rounded-lg text-xs font-black transition-all ${
              radiusKm === r
                ? 'bg-sky-600 text-white shadow shadow-sky-600/40 scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {r}km
          </button>
        ))}
      </div>

      {/* Google Maps Style Toggle (Streets vs Hybrid Satellite) */}
      <div className="absolute top-4 right-4 z-[400] bg-slate-900/90 border border-slate-700/90 rounded-xl p-1 shadow-lg backdrop-blur-md flex items-center gap-1">
        <button
          onClick={() => setMapStyle('streets')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${mapStyle === 'streets' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
          title="Google Maps Streets View"
        >
          🗺️ Google Streets
        </button>
        <button
          onClick={() => setMapStyle('hybrid')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${mapStyle === 'hybrid' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
          title="Google Maps Satellite Hybrid View"
        >
          🛰️ Satellite
        </button>
      </div>

      <button
        onClick={() => {
          requireAuth(() => requestLocation(), 'Please sign in or create an account to recenter to your location.');
        }}
        className="absolute bottom-6 right-4 z-[400] flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 text-sky-400 border border-slate-700/90 px-3.5 py-2 rounded-full shadow-lg backdrop-blur-md text-xs font-semibold transition-all hover:scale-105 cursor-pointer"
        title="Recenter Map to My Location"
      >
        <Navigation className="w-4 h-4 text-sky-400 animate-pulse" />
        <span>📍 {isGpsActive ? 'Live GPS Active' : 'My Location'}</span>
      </button>

      {isLoading && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[400] bg-slate-900/90 border border-sky-500/50 text-sky-300 px-4 py-2 rounded-full shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-medium animate-in fade-in duration-200">
          <Compass className="w-4 h-4 text-sky-400 animate-spin" />
          <span>📍 Locating vehicle services around you...</span>
        </div>
      )}

      {!isLoading && nearbyServices.length === 0 && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[400] bg-slate-900/95 border border-slate-700 text-slate-200 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md text-center max-w-xs">
          <p className="text-xs font-semibold text-slate-300">No services found within {radiusKm} km.</p>
          <p className="text-[11px] text-slate-400 mt-1">Try expanding your search radius or selecting a different category.</p>
        </div>
      )}
    </div>
  );
}
