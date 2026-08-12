/**
 * ContextEngine - Telemetry & active traveler context state store
 */

const { evaluateTravelerStates } = require('./travelerStateEngine');

class ContextEngine {
  constructor() {
    this.currentContext = {
      currentLocation: {
        lat: 28.6139,
        lng: 77.2090,
        city: 'Current Location',
        state: '',
        displayName: 'Current Location'
      },
      radiusKm: 5,
      destination: null,
      speedKmh: 35,
      travelDurationHours: 1.5,
      travelMode: 'BIKE',
      vehicleType: 'MOTORCYCLE',
      estimatedRangeKm: 50,
      fuelLevelPercent: 45,
      weather: { condition: 'CLEAR', tempC: 29 },
      userPreferences: {
        budget: 'MODERATE',
        interests: ['Nature', 'Food', 'History'],
        isBikeFriendlyPreferred: true
      },
      activeIssue: null,
      isEmergency: false
    };
  }

  getContext() {
    const travelerStates = evaluateTravelerStates({
      travelDurationHours: this.currentContext.travelDurationHours,
      estimatedRangeKm: this.currentContext.estimatedRangeKm,
      travelMode: this.currentContext.travelMode,
      vehicleType: this.currentContext.vehicleType,
      weatherCondition: this.currentContext.weather.condition,
      activeIssue: this.currentContext.activeIssue,
      isEmergency: this.currentContext.isEmergency
    });

    return {
      ...this.currentContext,
      travelerStates
    };
  }

  updateContext(updates = {}) {
    this.currentContext = {
      ...this.currentContext,
      ...updates,
      currentLocation: updates.currentLocation ? {
        ...this.currentContext.currentLocation,
        ...updates.currentLocation
      } : this.currentContext.currentLocation,
      weather: updates.weather ? {
        ...this.currentContext.weather,
        ...updates.weather
      } : this.currentContext.weather,
      userPreferences: updates.userPreferences ? {
        ...this.currentContext.userPreferences,
        ...updates.userPreferences
      } : this.currentContext.userPreferences
    };
    return this.getContext();
  }
}

module.exports = new ContextEngine();
