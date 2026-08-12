import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useTravel } from '../context/TravelContext';
import { Navigation, Compass } from 'lucide-react';

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

export default function MapView() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const radiusCircleRef = useRef(null);
  const userMarkerRef = useRef(null);
  const markersLayerGroupRef = useRef(null);

  const {
    currentLocation,
    radiusKm,
    nearbyServices,
    selectedService,
    setSelectedService,
    requestLocation,
    isLoading,
    requireAuth
  } = useTravel();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentLocation.lat, currentLocation.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: 'abc'
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

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { lat, lng } = currentLocation;

    map.flyTo([lat, lng], radiusKm <= 3 ? 14 : radiusKm <= 10 ? 13 : 11, {
      duration: 1.2
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([lat, lng]);
    } else {
      const userIcon = L.divIcon({
        className: 'custom-user-icon',
        html: `<div class="user-location-pin" title="Your Location"></div>`,
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

    nearbyServices.forEach((place) => {
      const isSelected = selectedService && selectedService.id === place.id;
      const catColor = CATEGORY_MARKER_COLORS[place.category] || '#0284c7';
      const imgUrl = place.image || CATEGORY_DEFAULT_IMAGES[place.category] || CATEGORY_DEFAULT_IMAGES.explore;

      bounds.extend([place.lat, place.lng]);

      const markerHtml = `
        <div class="custom-service-marker ${isSelected ? 'active-marker' : ''}" style="border-color: ${catColor}; overflow: hidden;">
          <img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: markerHtml,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon });

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

      <button
        onClick={() => {
          requireAuth(() => requestLocation(), 'Please sign in or create an account to recenter to your location.');
        }}
        className="absolute bottom-6 right-4 z-[400] flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 text-sky-400 border border-slate-700/90 px-3.5 py-2 rounded-full shadow-lg backdrop-blur-md text-xs font-semibold transition-all hover:scale-105 cursor-pointer"
        title="Recenter Map to My Location"
      >
        <Navigation className="w-4 h-4 text-sky-400 animate-pulse" />
        <span>📍 My Location</span>
      </button>

      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-slate-900/90 border border-sky-500/50 text-sky-300 px-4 py-2 rounded-full shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-medium animate-in fade-in duration-200">
          <Compass className="w-4 h-4 text-sky-400 animate-spin" />
          <span>📍 Finding services around you...</span>
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
