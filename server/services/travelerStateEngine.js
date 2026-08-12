/**
 * TravelerStateEngine - Rule evaluation engine for traveler active state flags
 */

function evaluateTravelerStates({
  travelDurationHours = 0,
  estimatedRangeKm = 100,
  travelMode = 'BIKE',
  vehicleType = 'MOTORCYCLE',
  weatherCondition = 'CLEAR',
  activeIssue = null,
  isEmergency = false
}) {
  const states = [];

  if (isEmergency) {
    states.push('EMERGENCY');
  }

  if (activeIssue) {
    const issue = activeIssue.toUpperCase();
    if (issue.includes('BREAKDOWN') || issue.includes('PUNCTURE') || issue.includes('ENGINE')) {
      states.push('VEHICLE_BREAKDOWN');
    }
    if (issue.includes('FUEL') || issue.includes('GAS')) {
      states.push('LOW_FUEL');
    }
    if (issue.includes('EV') || issue.includes('BATTERY')) {
      states.push('EV_CHARGING_REQUIRED');
    }
    if (issue.includes('MEDICAL') || issue.includes('INJURY')) {
      states.push('MEDICAL_EMERGENCY');
    }
    if (issue.includes('TOW')) {
      states.push('NEEDS_TOWING');
    }
  }

  if (estimatedRangeKm <= 20) {
    if (vehicleType === 'EV' || travelMode === 'EV') {
      states.push('EV_CHARGING_REQUIRED');
    } else {
      states.push('LOW_FUEL');
    }
  }

  if (travelDurationHours >= 2.0) {
    states.push('NEEDS_REST');
    states.push('LONG_DISTANCE_TRAVEL');
  }

  if (['RAIN', 'THUNDERSTORM', 'HEAVY_RAIN'].includes(weatherCondition.toUpperCase())) {
    states.push('WEATHER_RISK');
  }

  if (states.length === 0) {
    states.push('NORMAL');
  }

  return [...new Set(states)];
}

module.exports = {
  evaluateTravelerStates
};
