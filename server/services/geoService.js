/**
 * GeoService - Haversine distance, bounding box & spatial math
 */

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}

function getBoundingBox(lat, lon, radiusKm) {
  const latDelta = radiusKm / 111.0;
  const lonDelta = radiusKm / (111.0 * Math.cos(toRad(lat)));

  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLon: lon - lonDelta,
    maxLon: lon + lonDelta
  };
}

function filterByRadius(places, userLat, userLon, radiusKm) {
  return places
    .map(place => {
      const dist = getDistanceKm(userLat, userLon, place.lat, place.lng);
      return {
        ...place,
        distanceKm: dist
      };
    })
    .filter(place => place.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

// Distance from point to line segment
function getDistanceToSegment(pLat, pLon, aLat, aLon, bLat, bLon) {
  const l2 = Math.pow(bLat - aLat, 2) + Math.pow(bLon - aLon, 2);
  if (l2 === 0) return getDistanceKm(pLat, pLon, aLat, aLon);

  let t = ((pLat - aLat) * (bLat - aLat) + (pLon - aLon) * (bLon - aLon)) / l2;
  t = Math.max(0, Math.min(1, t));

  const projLat = aLat + t * (bLat - aLat);
  const projLon = aLon + t * (bLon - aLon);

  return getDistanceKm(pLat, pLon, projLat, projLon);
}

// Distance from point to polyline
function getDistanceToPolyline(pLat, pLon, polyline) {
  if (!polyline || polyline.length < 2) return Infinity;

  let minDistance = Infinity;
  for (let i = 0; i < polyline.length - 1; i++) {
    const ptA = polyline[i];
    const ptB = polyline[i + 1];
    const dist = getDistanceToSegment(
      pLat, pLon,
      ptA.lat || ptA[0], ptA.lng || ptA[1],
      ptB.lat || ptB[0], ptB.lng || ptB[1]
    );
    if (dist < minDistance) {
      minDistance = dist;
    }
  }
  return parseFloat(minDistance.toFixed(2));
}

module.exports = {
  getDistanceKm,
  getBoundingBox,
  filterByRadius,
  getDistanceToPolyline
};
