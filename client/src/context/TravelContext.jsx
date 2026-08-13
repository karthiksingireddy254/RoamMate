import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, LocalAuthHelper } from '../supabase';

const TravelContext = createContext(null);

export function TravelProvider({ children }) {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 28.6139,
    lng: 77.2090,
    city: 'Detecting Location...',
    state: '',
    displayName: 'Detecting Location...'
  });
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [radiusKm, setRadiusKm] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [nearbyServices, setNearbyServices] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [selectedService, setSelectedService] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const [activeTab, setActiveTab] = useState('discover');
  const [activeSituation, setActiveSituation] = useState('NORMAL');
  const [savedPlaceIds, setSavedPlaceIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAllServicesModalOpen, setIsAllServicesModalOpen] = useState(false);
  const [isHelpMeModalOpen, setIsHelpMeModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [travelMode, setTravelMode] = useState('BIKE');

  // --- Role Choice State: null (landing screen) | 'tourist' | 'provider' ---
  const [roleSelection, setRoleSelection] = useState(() => localStorage.getItem('roammate_role_selection') || null);

  useEffect(() => {
    if (roleSelection) {
      localStorage.setItem('roammate_role_selection', roleSelection);
    } else {
      localStorage.removeItem('roammate_role_selection');
    }
  }, [roleSelection]);

  // --- Theme Mode State (Dark / Light) ---
  const [theme, setTheme] = useState(() => localStorage.getItem('roammate_theme') || 'dark');

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('roammate_theme', nextTheme);
  };

  // --- Traveler Auth State Management ---
  const [user, setUser] = useState(() => LocalAuthHelper.getUser());
  const [authMode, setAuthMode] = useState(null); // null | 'login' | 'register'
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authPromptMessage, setAuthPromptMessage] = useState(null);

  // --- Business Organization / Service Provider Auth State ---
  const [businessUser, setBusinessUser] = useState(() => {
    try {
      const saved = localStorage.getItem('roammate_biz_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [providerAuthMode, setProviderAuthMode] = useState(null); // null | 'login' | 'register'

  // Require Auth Guard Helper
  const requireAuth = (callback, customMessage = 'Please sign in or create an account to access services on RoamMate.') => {
    if (user || businessUser) {
      if (typeof callback === 'function') {
        callback();
      }
      return true;
    } else {
      setAuthPromptMessage(customMessage);
      setAuthMode('register');
      return false;
    }
  };

  // Login handler for Traveler
  const loginUser = async (email, password) => {
    setIsAuthLoading(true);
    setAuthError(null);
    setAuthPromptMessage(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const errMsg = data.error || 'Email or password is incorrect.';
        setAuthError(errMsg);
        setIsAuthLoading(false);
        return { success: false, error: errMsg };
      }

      setUser(data.user);
      LocalAuthHelper.setUser(data.user);
      setRoleSelection('tourist');
      setIsAuthLoading(false);
      return { success: true, user: data.user };
    } catch (err) {
      setAuthError('Unable to connect to server. Please try again.');
      setIsAuthLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Register handler for Traveler
  const registerUser = async (name, email, password, phone = '', gender = 'Male') => {
    setIsAuthLoading(true);
    setAuthError(null);
    setAuthPromptMessage(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, gender })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const errMsg = data.error || 'Registration failed. Please try again.';
        setAuthError(errMsg);
        setIsAuthLoading(false);
        return { success: false, error: errMsg };
      }

      setUser(data.user);
      LocalAuthHelper.setUser(data.user);
      setRoleSelection('tourist');
      setIsAuthLoading(false);
      return { success: true, user: data.user };
    } catch (err) {
      setAuthError('Registration failed. Please check your connection.');
      setIsAuthLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Service Provider Registration
  const registerBusiness = async (businessName, ownerName, email, password, phone, category, licenseNo, city, address, lat, lng, coverageRadiusKm) => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/business/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, ownerName, email, password, phone, category, licenseNo, city, address, lat, lng, coverageRadiusKm })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const errMsg = data.error || 'Service provider registration failed.';
        setAuthError(errMsg);
        setIsAuthLoading(false);
        return { success: false, error: errMsg };
      }

      setBusinessUser(data.provider);
      localStorage.setItem('roammate_biz_user', JSON.stringify(data.provider));
      setRoleSelection('provider');
      setIsAuthLoading(false);
      return { success: true, provider: data.provider };
    } catch (err) {
      setAuthError('Network error. Unable to register service provider account.');
      setIsAuthLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Service Provider Login
  const loginBusiness = async (email, password) => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/business/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const errMsg = data.error || 'Provider email or password is incorrect.';
        setAuthError(errMsg);
        setIsAuthLoading(false);
        return { success: false, error: errMsg };
      }

      setBusinessUser(data.provider);
      localStorage.setItem('roammate_biz_user', JSON.stringify(data.provider));
      setRoleSelection('provider');
      setIsAuthLoading(false);
      return { success: true, provider: data.provider };
    } catch (err) {
      setAuthError('Network error during provider login.');
      setIsAuthLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Service Provider Add Service Place Listing
  const addBusinessServicePlace = async (placeData) => {
    try {
      const res = await fetch('/api/business/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: businessUser?.id || '',
          ...placeData
        })
      });
      const data = await res.json();
      if (data.success && data.place) {
        fetchServices(currentLocation.lat, currentLocation.lng, radiusKm, selectedCategory, searchKeyword, activeSituation);
        return { success: true, place: data.place };
      } else {
        return { success: false, error: data.error || 'Failed to add service listing.' };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Logout handler
  const logoutUser = async () => {
    setUser(null);
    LocalAuthHelper.setUser(null);
    setBusinessUser(null);
    localStorage.removeItem('roammate_biz_user');
    setRoleSelection(null);
    setSelectedService(null);
    setIsProfileModalOpen(false);
    setIsBusinessModalOpen(false);
  };

  // Google OAuth Login
  const loginWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
    } catch (e) {
      const dummyUser = { id: 'usr_google', email: 'traveler@google.com', name: 'Google Traveler', phone: '+91 98000 11223', gender: 'Male' };
      setUser(dummyUser);
      LocalAuthHelper.setUser(dummyUser);
      setRoleSelection('tourist');
      setAuthMode(null);
    }
  };

  // Password Reset Link
  const sendPasswordReset = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return { success: true };
    }
  };

  // Reverse geocode lat/lng via server Nominatim API
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`/api/location/geocode?lat=${lat}&lng=${lng}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentLocation({
          lat: data.lat,
          lng: data.lng,
          city: data.city || 'Current Location',
          state: data.state || '',
          displayName: data.displayName || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        });
      }
    } catch (err) {
      console.warn('Geocode API fallback:', err);
    }
  };

  // Primary service fetcher
  const fetchServices = useCallback(async (lat = currentLocation.lat, lng = currentLocation.lng, rKm = radiusKm, cat = selectedCategory, kw = searchKeyword, sit = activeSituation) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        radiusKm: rKm.toString(),
        category: cat,
        keyword: kw,
        situation: sit
      });

      const res = await fetch(`/api/services/nearby?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setNearbyServices(data.places || []);
        setCategoryCounts(data.categoryCounts || {});
      }
    } catch (err) {
      console.error('Failed to fetch nearby services:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentLocation.lat, currentLocation.lng, radiusKm, selectedCategory, searchKeyword, activeSituation]);

  // Initial geolocation request
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation(prev => ({ ...prev, lat: latitude, lng: longitude }));
        setIsGpsActive(true);
        setLocationError(null);
        reverseGeocode(latitude, longitude);
        fetchServices(latitude, longitude, radiusKm, selectedCategory, searchKeyword, activeSituation);
      },
      (err) => {
        console.warn('Geolocation permission denied:', err.message);
        setLocationError('GPS permission denied. Pick location manually.');
        setIsGpsActive(false);
        reverseGeocode(currentLocation.lat, currentLocation.lng);
        fetchServices(currentLocation.lat, currentLocation.lng, radiusKm, selectedCategory, searchKeyword, activeSituation);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, [radiusKm, selectedCategory, searchKeyword, activeSituation, currentLocation.lat, currentLocation.lng, fetchServices]);

  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    fetchServices(currentLocation.lat, currentLocation.lng, radiusKm, selectedCategory, searchKeyword, activeSituation);
  }, [radiusKm, selectedCategory, searchKeyword, activeSituation, currentLocation.lat, currentLocation.lng, fetchServices]);

  const setManualLocation = (lat, lng, cityName, displayName) => {
    setCurrentLocation({
      lat,
      lng,
      city: cityName,
      state: '',
      displayName: displayName || cityName
    });
    setIsGpsActive(false);
    setLocationError(null);
    setSelectedService(null);
    fetchServices(lat, lng, radiusKm, selectedCategory, searchKeyword, activeSituation);
  };

  const toggleSavePlace = async (placeId) => {
    if (!requireAuth(null, 'Please sign in or create an account to save places to your profile.')) {
      return;
    }
    const isSaved = savedPlaceIds.includes(placeId);
    const updated = isSaved ? savedPlaceIds.filter(id => id !== placeId) : [...savedPlaceIds, placeId];
    setSavedPlaceIds(updated);

    try {
      await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId, isSaved: !isSaved })
      });
    } catch (err) {
      console.error('Failed to sync saved place:', err);
    }
  };

  return (
    <TravelContext.Provider
      value={{
        currentLocation,
        isGpsActive,
        radiusKm,
        setRadiusKm,
        selectedCategory,
        setSelectedCategory,
        searchKeyword,
        setSearchKeyword,
        nearbyServices,
        categoryCounts,
        selectedService,
        setSelectedService,
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        activeSituation,
        setActiveSituation,
        savedPlaceIds,
        toggleSavePlace,
        isLoading,
        locationError,
        requestLocation,
        setManualLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isAllServicesModalOpen,
        setIsAllServicesModalOpen,
        isHelpMeModalOpen,
        setIsHelpMeModalOpen,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isBusinessModalOpen,
        setIsBusinessModalOpen,
        travelMode,
        setTravelMode,
        fetchServices,
        // Role Selection
        roleSelection,
        setRoleSelection,
        // Theme State
        theme,
        toggleTheme,
        // Traveler Auth
        user,
        authMode,
        setAuthMode,
        isAuthLoading,
        authError,
        setAuthError,
        authPromptMessage,
        setAuthPromptMessage,
        requireAuth,
        loginUser,
        registerUser,
        logoutUser,
        loginWithGoogle,
        sendPasswordReset,
        // Business Auth & Management Exports
        businessUser,
        setBusinessUser,
        providerAuthMode,
        setProviderAuthMode,
        registerBusiness,
        loginBusiness,
        addBusinessServicePlace
      }}
    >
      {children}
    </TravelContext.Provider>
  );
}

export function useTravel() {
  const ctx = useContext(TravelContext);
  if (!ctx) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return ctx;
}
