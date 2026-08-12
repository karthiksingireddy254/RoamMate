/**
 * RouteService - Calculates polyline corridors and filters services along a route
 */

const { getDistanceToPolyline, getDistanceKm } = require('./geoService');
const placeProvider = require('./placeProvider');

// Simple polyline generator connecting origin and destination coordinates
function generateRoutePolyline(origin, destination) {
  const steps = 10;
  const polyline = [];
  
  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps;
    const lat = origin.lat + (destination.lat - origin.lat) * ratio;
    const lng = origin.lng + (destination.lng - origin.lng) * ratio;
    polyline.push({ lat: parseFloat(lat.toFixed(4)), lng: parseFloat(lng.toFixed(4)) });
  }

  return polyline;
}

async function getServicesAlongRoute({ origin, destination, maxDetourKm = 3, category = 'all' }) {
  const polyline = generateRoutePolyline(origin, destination);
  
  // Total trip distance
  const totalTripDistanceKm = getDistanceKm(origin.lat, origin.lng, destination.lat, destination.lng);

  // Fetch all places within reasonable distance of midpoint
  const midLat = (origin.lat + destination.lat) / 2;
  const midLng = (origin.lng + destination.lng) / 2;
  const searchRadius = Math.max(totalTripDistanceKm / 1.5, 10);

  const allNearby = await placeProvider.getNearbyServices({
    lat: midLat,
    lng: midLng,
    radiusKm: searchRadius,
    category
  });

  // Filter places that are within maxDetourKm of the polyline corridor
  const routeServices = allNearby
    .map(place => {
      const detourKm = getDistanceToPolyline(place.lat, place.lng, polyline);
      const distanceFromOrigin = getDistanceKm(origin.lat, origin.lng, place.lat, place.lng);
      return {
        ...place,
        detourKm,
        distanceFromOrigin
      };
    })
    .filter(place => place.detourKm <= maxDetourKm)
    .sort((a, b) => a.distanceFromOrigin - b.distanceFromOrigin);

  return {
    origin,
    destination,
    totalTripDistanceKm: parseFloat(totalTripDistanceKm.toFixed(1)),
    polyline,
    servicesCount: routeServices.length,
    services: routeServices
  };
}

module.exports = {
  generateRoutePolyline,
  getServicesAlongRoute
};
