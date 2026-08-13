/**
 * RoamMate Server - Location-First Travel Service Discovery REST API
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const crypto = require('crypto');

dotenv.config();

const db = require('./db');
const { initializeDatabase } = require('./services/dbInit');
const geoService = require('./services/geoService');
const placeProvider = require('./services/placeProvider');
const contextEngine = require('./services/contextEngine');
const { prioritizePlacesBySituation } = require('./services/situationEngine');
const { scoreAndRecommendPlaces } = require('./services/recommendationEngine');
const routeService = require('./services/routeService');
const aiCopilot = require('./services/aiCopilot');
const communityService = require('./services/communityService');
const analyticsEngine = require('./services/analyticsEngine');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Password Hash Helper
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initialize Supabase PostgreSQL Database Tables & Indexes
initializeDatabase().catch(err => console.error('Database initialization error:', err));

// --- TOURIST AUTHENTICATION ENDPOINTS ---

// 0A. Register New Tourist Account
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, gender } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await db.query(`SELECT * FROM users WHERE email = $1;`, [cleanEmail]);
    if (existing.rows && existing.rows.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const userId = 'usr_' + Date.now();
    const pwdHash = hashPassword(password);

    await db.query(`
      INSERT INTO users (id, name, email, password_hash, phone, gender)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [userId, name || cleanEmail.split('@')[0], cleanEmail, pwdHash, phone || 'Not Provided', gender || 'Male']);

    console.log(`👤 New Tourist registered: ${cleanEmail} (${gender})`);

    return res.json({
      success: true,
      user: {
        id: userId,
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: phone || 'Not Provided',
        gender: gender || 'Male'
      }
    });
  } catch (err) {
    console.error('Registration API Error:', err.message);
    return res.status(500).json({ error: 'Failed to create account.' });
  }
});

// 0B. Sign In Tourist Account
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const userRes = await db.query(`SELECT * FROM users WHERE email = $1;`, [cleanEmail]);

    if (!userRes.rows || userRes.rows.length === 0) {
      return res.status(400).json({ error: 'Email or password is incorrect.' });
    }

    const userRow = userRes.rows[0];
    const pwdHash = hashPassword(password);

    if (userRow.password_hash !== pwdHash) {
      console.warn(`🔒 Failed login attempt for ${cleanEmail}`);
      return res.status(400).json({ error: 'Email or password is incorrect.' });
    }

    console.log(`🔑 Successful Tourist login: ${cleanEmail}`);

    return res.json({
      success: true,
      user: {
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        phone: userRow.phone,
        gender: userRow.gender
      }
    });
  } catch (err) {
    console.error('Login API Error:', err.message);
    return res.status(500).json({ error: 'Failed to authenticate user.' });
  }
});

// --- SERVICE PROVIDER AUTHENTICATION & MANAGEMENT ENDPOINTS ---

// 0C. Register Service Provider
app.post('/api/business/register', async (req, res) => {
  try {
    const { 
      businessName, ownerName, email, password, phone, category, 
      licenseNo, city, address, lat, lng, coverageRadiusKm, 
      vehicleTypes, operatingHours, is247Emergency, description 
    } = req.body;

    if (!email || !password || !businessName || !phone) {
      return res.status(400).json({ error: 'Business name, email, password, and phone number are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await db.query(`SELECT * FROM service_providers WHERE email = $1;`, [cleanEmail]);
    if (existing.rows && existing.rows.length > 0) {
      return res.status(400).json({ error: 'A service provider account with this email already exists.' });
    }

    const providerId = 'prov_' + Date.now();
    const pwdHash = hashPassword(password);
    const vehicleTypesArr = Array.isArray(vehicleTypes) ? vehicleTypes : ['Bike', 'Car', 'SUV'];

    await db.query(`
      INSERT INTO service_providers (
        id, business_name, owner_name, email, password_hash, phone, category, 
        license_no, city, address, lat, lng, coverage_radius_km, 
        availability_status, is_24_7_emergency, verification_status, vehicle_types, description, operating_hours
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19);
    `, [
      providerId, businessName, ownerName || businessName, cleanEmail, pwdHash, phone, category || 'service',
      licenseNo || '', city || 'Agra', address || 'Central Service Zone', parseFloat(lat) || 28.6139, parseFloat(lng) || 77.2090,
      parseInt(coverageRadiusKm) || 15, 'AVAILABLE', is247Emergency !== false, 'VERIFIED',
      JSON.stringify(vehicleTypesArr), description || 'Verified vehicle service workshop.', operating_hours || '24 Hours Open'
    ]);

    // Also insert into places table for immediate tourist discovery
    const placeId = 'place_prov_' + providerId;
    await db.query(`
      INSERT INTO places (id, name, category, subcategory, lat, lng, address, rating, reviews_count, status, phone, amenities, description, image, provider_id, verification_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      ON CONFLICT (id) DO NOTHING;
    `, [
      placeId, businessName, category || 'service', 'Verified Workshop', parseFloat(lat) || 28.6139, parseFloat(lng) || 77.2090,
      address || 'Central Service Zone', 4.9, 12, 'Available Now', phone,
      JSON.stringify(['24x7 Roadside Assistance', 'Onsite Repair', 'Verified Workshop']), description || 'Verified Workshop',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80', providerId, 'VERIFIED'
    ]);

    console.log(`🏢 Service Provider registered: ${businessName} (${cleanEmail})`);

    return res.json({
      success: true,
      provider: {
        id: providerId,
        businessName,
        ownerName: ownerName || businessName,
        email: cleanEmail,
        phone,
        category: category || 'service',
        licenseNo: licenseNo || '',
        city: city || 'Agra',
        address: address || 'Central Service Zone',
        lat: parseFloat(lat) || 28.6139,
        lng: parseFloat(lng) || 77.2090,
        coverageRadiusKm: parseInt(coverageRadiusKm) || 15,
        availabilityStatus: 'AVAILABLE',
        is247Emergency: true,
        verificationStatus: 'VERIFIED',
        vehicleTypes: vehicleTypesArr,
        description: description || 'Verified vehicle service workshop.'
      }
    });
  } catch (err) {
    console.error('Provider Registration API Error:', err.message);
    return res.status(500).json({ error: 'Failed to register service provider account.' });
  }
});

// 0D. Service Provider Sign In
app.post('/api/business/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const providerRes = await db.query(`SELECT * FROM service_providers WHERE email = $1;`, [cleanEmail]);

    if (!providerRes.rows || providerRes.rows.length === 0) {
      return res.status(400).json({ error: 'Provider email or password is incorrect.' });
    }

    const row = providerRes.rows[0];
    const pwdHash = hashPassword(password);

    if (row.password_hash !== pwdHash) {
      console.warn(`🔒 Failed provider login for ${cleanEmail}`);
      return res.status(400).json({ error: 'Provider email or password is incorrect.' });
    }

    console.log(`🔑 Successful Service Provider login: ${cleanEmail}`);

    return res.json({
      success: true,
      provider: {
        id: row.id,
        businessName: row.business_name,
        ownerName: row.owner_name,
        email: row.email,
        phone: row.phone,
        category: row.category,
        licenseNo: row.license_no,
        city: row.city,
        address: row.address,
        lat: parseFloat(row.lat),
        lng: parseFloat(row.lng),
        coverageRadiusKm: row.coverage_radius_km,
        availabilityStatus: row.availability_status || 'AVAILABLE',
        is247Emergency: row.is_24_7_emergency !== false,
        verificationStatus: row.verification_status || 'VERIFIED',
        vehicleTypes: typeof row.vehicle_types === 'string' ? JSON.parse(row.vehicle_types) : (row.vehicle_types || ['Bike', 'Car', 'SUV']),
        description: row.description
      }
    });
  } catch (err) {
    console.error('Provider Login API Error:', err.message);
    return res.status(500).json({ error: 'Failed to authenticate service provider.' });
  }
});

// 0E. Fetch Service Provider Dashboard Details
app.get('/api/provider/dashboard/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;
    const providerRes = await db.query(`SELECT * FROM service_providers WHERE id = $1;`, [providerId]);
    if (!providerRes.rows || providerRes.rows.length === 0) {
      return res.status(404).json({ error: 'Service provider profile not found.' });
    }

    const p = providerRes.rows[0];

    // Fetch individual services
    const servicesRes = await db.query(`SELECT * FROM provider_services WHERE provider_id = $1;`, [providerId]);
    const services = (servicesRes.rows || []).map(s => ({
      id: s.id,
      serviceName: s.service_name,
      description: s.description,
      priceRange: s.price_range,
      vehicleTypes: typeof s.vehicle_types === 'string' ? JSON.parse(s.vehicle_types) : s.vehicle_types
    }));

    return res.json({
      provider: {
        id: p.id,
        businessName: p.business_name,
        ownerName: p.owner_name,
        email: p.email,
        phone: p.phone,
        category: p.category,
        licenseNo: p.license_no,
        city: p.city,
        address: p.address,
        lat: parseFloat(p.lat),
        lng: parseFloat(p.lng),
        coverageRadiusKm: p.coverage_radius_km,
        availabilityStatus: p.availability_status || 'AVAILABLE',
        is247Emergency: p.is_24_7_emergency !== false,
        verificationStatus: p.verification_status || 'VERIFIED',
        vehicleTypes: typeof p.vehicle_types === 'string' ? JSON.parse(p.vehicle_types) : (p.vehicle_types || []),
        description: p.description,
        operatingHours: p.operating_hours
      },
      services
    });
  } catch (err) {
    console.error('Provider Dashboard API Error:', err.message);
    return res.status(500).json({ error: 'Failed to load provider dashboard.' });
  }
});

// 0F. Real-Time Provider Availability Toggle (Syncs to Tourist Discovery)
app.put('/api/provider/availability', async (req, res) => {
  try {
    const { providerId, availabilityStatus, is247Emergency } = req.body;
    if (!providerId || !availabilityStatus) {
      return res.status(400).json({ error: 'Provider ID and availability status are required.' });
    }

    await db.query(`
      UPDATE service_providers
      SET availability_status = $1, is_24_7_emergency = $2
      WHERE id = $3;
    `, [availabilityStatus, is247Emergency !== false, providerId]);

    // Map availability status for Tourist side: AVAILABLE -> Available Now, BUSY -> Busy / Limited, UNAVAILABLE -> Currently Unavailable
    let statusText = 'Available Now';
    if (availabilityStatus === 'BUSY') statusText = 'Busy / Limited';
    if (availabilityStatus === 'UNAVAILABLE') statusText = 'Currently Unavailable';

    await db.query(`
      UPDATE places
      SET status = $1
      WHERE provider_id = $2;
    `, [statusText, providerId]);

    console.log(`🟢 Provider ${providerId} updated availability status to: ${availabilityStatus}`);

    return res.json({
      success: true,
      availabilityStatus,
      is247Emergency,
      statusText
    });
  } catch (err) {
    console.error('Update Availability API Error:', err.message);
    return res.status(500).json({ error: 'Failed to update availability status.' });
  }
});

// 0G. Provider Update Business Details & Location
app.put('/api/provider/business', async (req, res) => {
  try {
    const { providerId, businessName, phone, address, lat, lng, coverageRadiusKm, description } = req.body;
    if (!providerId) {
      return res.status(400).json({ error: 'Provider ID is required.' });
    }

    await db.query(`
      UPDATE service_providers
      SET business_name = $1, phone = $2, address = $3, lat = $4, lng = $5, coverage_radius_km = $6, description = $7
      WHERE id = $8;
    `, [businessName, phone, address, parseFloat(lat), parseFloat(lng), parseInt(coverageRadiusKm), description, providerId]);

    await db.query(`
      UPDATE places
      SET name = $1, phone = $2, address = $3, lat = $4, lng = $5, description = $7
      WHERE provider_id = $8;
    `, [businessName, phone, address, parseFloat(lat), parseFloat(lng), description, providerId]);

    return res.json({ success: true, message: 'Business profile updated successfully.' });
  } catch (err) {
    console.error('Update Business Details API Error:', err.message);
    return res.status(500).json({ error: 'Failed to update business profile.' });
  }
});

// 0H. Add Provider Service Item
app.post('/api/provider/services', async (req, res) => {
  try {
    const { providerId, serviceName, description, vehicleTypes, priceRange } = req.body;
    if (!providerId || !serviceName) {
      return res.status(400).json({ error: 'Provider ID and service name are required.' });
    }

    const serviceId = 'srv_' + Date.now();
    const vehicleTypesArr = Array.isArray(vehicleTypes) ? vehicleTypes : ['Bike', 'Car'];

    await db.query(`
      INSERT INTO provider_services (id, provider_id, service_name, description, vehicle_types, price_range)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [serviceId, providerId, serviceName, description || '', JSON.stringify(vehicleTypesArr), priceRange || 'Standard']);

    return res.json({
      success: true,
      service: {
        id: serviceId,
        serviceName,
        description,
        vehicleTypes: vehicleTypesArr,
        priceRange: priceRange || 'Standard'
      }
    });
  } catch (err) {
    console.error('Add Provider Service API Error:', err.message);
    return res.status(500).json({ error: 'Failed to add service item.' });
  }
});

// 1. Live Geocode & Reverse Geocode
app.get('/api/location/geocode', async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ error: 'Valid lat and lng required' });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`;
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 4000
    });

    if (response.data && response.data.address) {
      const addr = response.data.address;
      const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || 'Current Location';
      const state = addr.state || addr.region || addr.country || '';
      const displayName = response.data.display_name || `${city}, ${state}`;

      contextEngine.updateContext({
        currentLocation: { lat, lng, city, state, displayName }
      });

      return res.json({ lat, lng, city, state, displayName });
    }
  } catch (err) {
    console.warn('Nominatim reverse geocode fallback:', err.message);
  }

  const fallback = {
    lat,
    lng,
    city: 'Current Location',
    state: '',
    displayName: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  };
  contextEngine.updateContext({ currentLocation: fallback });
  return res.json(fallback);
});

// Search location by query string
app.get('/api/location/search', async (req, res) => {
  const query = req.query.q;
  if (!query || !query.trim()) {
    return res.json({ results: [] });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 4000
    });

    if (response.data && Array.isArray(response.data)) {
      const results = response.data.map(item => ({
        name: item.display_name,
        city: item.name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      }));
      return res.json({ results });
    }
  } catch (err) {
    console.error('Location search error:', err.message);
  }

  return res.json({ results: [] });
});

// 2. Nearby Services Discovery (Location + Radius + Category + Search)
app.get('/api/services/nearby', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Valid lat and lng required' });
    }

    const radiusKm = parseFloat(req.query.radiusKm) || 5;
    const category = req.query.category || 'all';
    const keyword = req.query.keyword || '';
    const situation = req.query.situation || 'NORMAL';

    const rawPlaces = await placeProvider.getNearbyServices({
      lat,
      lng,
      radiusKm,
      category,
      keyword
    });

    const places = prioritizePlacesBySituation(rawPlaces, situation);
    const counts = await placeProvider.getCategoryCounts(lat, lng, radiusKm);

    analyticsEngine.logSearchEvent({
      lat,
      lng,
      radiusKm,
      category,
      keyword,
      resultsCount: places.length
    });

    return res.json({
      location: { lat, lng },
      radiusKm,
      activeCategory: category,
      activeSituation: situation,
      totalCount: places.length,
      categoryCounts: counts,
      places
    });
  } catch (error) {
    console.error('Error fetching nearby services:', error);
    return res.status(500).json({ error: 'Failed to fetch nearby services' });
  }
});

// 3. Category Counts Endpoint
app.get('/api/services/category-counts', async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  const radiusKm = parseFloat(req.query.radiusKm) || 5;

  const counts = await placeProvider.getCategoryCounts(lat, lng, radiusKm);
  return res.json({ radiusKm, counts });
});

// 4. Search Services
app.get('/api/services/search', async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  const radiusKm = parseFloat(req.query.radiusKm) || 5;
  const q = req.query.q || '';

  const places = await placeProvider.getNearbyServices({
    lat,
    lng,
    radiusKm,
    keyword: q
  });

  return res.json({ query: q, totalCount: places.length, places });
});

// 5. Service Details by ID
app.get('/api/services/details/:id', async (req, res) => {
  const place = await placeProvider.getPlaceById(req.params.id);
  if (!place) {
    return res.status(404).json({ error: 'Service place not found' });
  }
  return res.json({ place });
});

// 6. Traveler Telemetry Context
app.get('/api/context', (req, res) => {
  return res.json(contextEngine.getContext());
});

app.post('/api/context', (req, res) => {
  const updated = contextEngine.updateContext(req.body);
  return res.json(updated);
});

// 7. Contextual Recommendations
app.get('/api/recommendations', async (req, res) => {
  const context = contextEngine.getContext();
  const { lat, lng } = context.currentLocation;
  const radiusKm = context.radiusKm || 5;

  const nearby = await placeProvider.getNearbyServices({ lat, lng, radiusKm });
  const recommendations = scoreAndRecommendPlaces(nearby, context);

  return res.json({ recommendations });
});

// 8. On My Route Corridor Discovery
app.get('/api/route/services', async (req, res) => {
  try {
    const originLat = parseFloat(req.query.originLat);
    const originLng = parseFloat(req.query.originLng);
    const destLat = parseFloat(req.query.destLat);
    const destLng = parseFloat(req.query.destLng);
    const maxDetourKm = parseFloat(req.query.maxDetourKm) || 3;
    const category = req.query.category || 'all';

    const routeData = await routeService.getServicesAlongRoute({
      origin: { lat: originLat, lng: originLng },
      destination: { lat: destLat, lng: destLng },
      maxDetourKm,
      category
    });

    return res.json(routeData);
  } catch (error) {
    console.error('Error fetching route services:', error);
    return res.status(500).json({ error: 'Failed to calculate route services' });
  }
});

// 9. Help Me Now - Assistance Endpoint
app.post('/api/assistance/help', async (req, res) => {
  const { issueType, lat, lng, radiusKm = 10 } = req.body;

  let targetCategories = ['service', 'towing', 'fuel', 'ev'];
  if (issueType === 'BIKE_BREAKDOWN' || issueType === 'FLAT_TYRE') {
    targetCategories = ['service', 'towing'];
  } else if (issueType === 'OUT_OF_FUEL') {
    targetCategories = ['fuel', 'ev', 'towing'];
  }

  const allServices = await placeProvider.getNearbyServices({ lat, lng, radiusKm });
  const emergencyMatches = allServices.filter(p => targetCategories.includes(p.category));

  return res.json({
    issueType,
    totalMatches: emergencyMatches.length,
    emergencyContacts: [
      { name: 'National Emergency Helpline', phone: '112' },
      { name: 'Highway Patrol Towing', phone: '1033' },
      { name: 'Roadside Breakdown Recovery', phone: '1800 102 1100' }
    ],
    services: emergencyMatches.slice(0, 8)
  });
});

// 10. Saved Places
app.get('/api/saved', async (req, res) => {
  const savedIds = await communityService.getSavedPlaceIds();
  const places = [];
  for (const id of savedIds) {
    const p = await placeProvider.getPlaceById(id);
    if (p) places.push(p);
  }
  return res.json({ savedCount: places.length, places });
});

app.post('/api/saved', async (req, res) => {
  const { placeId, isSaved } = req.body;
  if (isSaved) {
    await communityService.savePlace(placeId);
  } else {
    await communityService.unsavePlace(placeId);
  }
  const currentSavedIds = await communityService.getSavedPlaceIds();
  return res.json({ success: true, isSaved, savedIds: currentSavedIds });
});

// 11. AI Copilot Chat Assistant
app.post('/api/ai/ask', async (req, res) => {
  const { query } = req.body;
  const context = contextEngine.getContext();
  const advice = await aiCopilot.getTravelerAssistantAdvice(query, context);
  return res.json(advice);
});

// 12. Analytics Metrics
app.get('/api/analytics', async (req, res) => {
  const metrics = await analyticsEngine.getMetrics();
  return res.json(metrics);
});

app.listen(PORT, () => {
  console.log(`🚀 RoamMate Server running on http://localhost:${PORT}`);
});
