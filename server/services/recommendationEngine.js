/**
 * RecommendationEngine - Multi-factor scoring engine over actual discovered place dataset
 */

function scoreAndRecommendPlaces(places, context = {}) {
  const { travelMode = 'BIKE', userPreferences = {}, travelerStates = [] } = context;

  const scored = places.map(place => {
    let score = 0;
    const matchReasons = [];

    // 1. Distance scoring (up to 30 points)
    const dist = place.distanceKm || 0;
    const distScore = Math.max(0, 30 - dist * 3);
    score += distScore;
    if (dist <= 2) {
      matchReasons.push(`📍 Very close (${dist} km away)`);
    } else if (dist <= 5) {
      matchReasons.push(`📍 Within quick radius (${dist} km)`);
    }

    // 2. Rating scoring (up to 25 points)
    const rating = place.rating || 4.0;
    const ratingScore = (rating / 5) * 25;
    score += ratingScore;
    if (rating >= 4.5) {
      matchReasons.push(`⭐ Top rated (${rating}★)`);
    }

    // 3. Travel Mode Relevance (up to 25 points)
    if (travelMode === 'BIKE') {
      if (place.category === 'service' || place.tags?.includes('bike') || place.tags?.includes('scooter')) {
        score += 25;
        matchReasons.push('🏍️ Ideal for bike/scooter traveler');
      }
      if (place.amenities?.some(a => a.toLowerCase().includes('bike'))) {
        score += 15;
        matchReasons.push('🅿️ Bike friendly parking');
      }
    } else if (travelMode === 'EV') {
      if (place.category === 'ev') {
        score += 30;
        matchReasons.push('⚡ Essential EV Charging Station');
      }
    } else if (travelMode === 'CAR') {
      if (place.category === 'parking' || place.amenities?.some(a => a.toLowerCase().includes('parking'))) {
        score += 15;
        matchReasons.push('🚗 Verified parking space');
      }
    }

    // 4. Traveler Situation State match (up to 20 points)
    if (travelerStates.includes('LOW_FUEL') && (place.category === 'fuel' || place.category === 'ev')) {
      score += 25;
      matchReasons.push('⛽ Fulfills low fuel alert');
    }
    if (travelerStates.includes('NEEDS_REST') && (place.category === 'food' || place.category === 'stay' || place.category === 'restroom')) {
      score += 20;
      matchReasons.push('☕ Ideal rest stop for long drive');
    }

    return {
      ...place,
      recommendationScore: Math.round(score),
      matchReasons
    };
  });

  return scored
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 5);
}

module.exports = {
  scoreAndRecommendPlaces
};
