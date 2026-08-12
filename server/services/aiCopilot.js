/**
 * AiCopilot - Contextual assistance grounded strictly in discovered local place data
 */

const placeProvider = require('./placeProvider');
const { scoreAndRecommendPlaces } = require('./recommendationEngine');

async function getTravelerAssistantAdvice(query, context) {
  const { currentLocation, radiusKm = 5, travelMode = 'BIKE' } = context || {};
  const lat = currentLocation?.lat || 15.4989;
  const lng = currentLocation?.lng || 73.8278;

  // Search real nearby services
  const realPlaces = await placeProvider.getNearbyServices({
    lat,
    lng,
    radiusKm,
    keyword: query
  });

  const topPicks = scoreAndRecommendPlaces(realPlaces, context);

  let responseMessage = '';
  if (topPicks.length > 0) {
    const top = topPicks[0];
    responseMessage = `Based on your location near ${currentLocation?.city || 'Goa'}, I recommend **${top.name}** (${top.subcategory || top.category}, ${top.distanceKm} km away, ${top.rating}★). ${top.description || ''}`;
  } else {
    responseMessage = `I searched within ${radiusKm} km around ${currentLocation?.city || 'your position'}, but didn't find exact matches for "${query}". Try expanding your radius or checking nearby categories.`;
  }

  return {
    query,
    groundedResultsCount: realPlaces.length,
    responseMessage,
    recommendedPlaces: topPicks
  };
}

module.exports = {
  getTravelerAssistantAdvice
};
