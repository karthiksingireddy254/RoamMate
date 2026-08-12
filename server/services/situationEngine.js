/**
 * SituationEngine - Prioritizes relevant categories based on real-time situational triggers
 */

function evaluateSituation(situationType = 'NORMAL', context = {}) {
  const normalized = (situationType || 'NORMAL').toUpperCase().replace(/\s+/g, '_');

  const situationProfiles = {
    NORMAL: {
      title: 'Normal Exploration',
      promotedCategories: [],
      bannerText: 'Discovering all nearby services'
    },
    LOW_FUEL: {
      title: 'Low Fuel / Low Range Alert',
      promotedCategories: ['fuel', 'ev'],
      bannerText: '⛽ Low fuel range detected! Fuel and EV charging stations prioritized.'
    },
    BIKE_BREAKDOWN: {
      title: 'Bike / Vehicle Breakdown',
      promotedCategories: ['service', 'towing'],
      bannerText: '🛠️ Vehicle breakdown active. Mobile mechanics, puncture shops, and towing prioritized.'
    },
    CAR_BREAKDOWN: {
      title: 'Car Breakdown',
      promotedCategories: ['service', 'towing'],
      bannerText: '🚗 Car breakdown active. Tow trucks & car mechanics prioritized.'
    },
    FLAT_TYRE: {
      title: 'Flat Tyre Emergency',
      promotedCategories: ['service'],
      bannerText: '🛞 Flat tyre detected! Nearby puncture and tyre repair shops prioritized.'
    },
    RAIN: {
      title: 'Monsoon / Heavy Rain Risk',
      promotedCategories: ['stay', 'food', 'restroom'],
      bannerText: '🌧️ Heavy rain alert! Covered stays, cafes, and rest areas prioritized.'
    },
    MEDICAL_EMERGENCY: {
      title: 'Medical Emergency',
      promotedCategories: ['medical'],
      bannerText: '🚨 Medical Emergency! Nearby 24x7 hospitals, ERs, and pharmacies prioritized.'
    }
  };

  const profile = situationProfiles[normalized] || situationProfiles.NORMAL;

  return {
    situation: normalized,
    ...profile
  };
}

function prioritizePlacesBySituation(places, situationType = 'NORMAL') {
  const profile = evaluateSituation(situationType);
  if (!profile.promotedCategories || profile.promotedCategories.length === 0) {
    return places;
  }

  const promoted = [];
  const regular = [];

  places.forEach(place => {
    if (profile.promotedCategories.includes(place.category)) {
      promoted.push({ ...place, isSituationPromoted: true });
    } else {
      regular.push({ ...place, isSituationPromoted: false });
    }
  });

  return [...promoted, ...regular];
}

module.exports = {
  evaluateSituation,
  prioritizePlacesBySituation
};
