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

// --- AUTHENTICATION ENDPOINTS (Supabase PostgreSQL Backed) ---

// 0A. Register New User Account
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

    console.log(`👤 New user registered in Supabase DB: ${cleanEmail} (${gender})`);

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

// 0B. Sign In User Account (STRICT PASSWORD MATCH VERIFICATION)
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
      // STRICT ERROR: Wrong password! DO NOT ALLOW ACCESS!
      console.warn(`🔒 Failed login attempt for ${cleanEmail} - Incorrect Password`);
      return res.status(400).json({ error: 'Email or password is incorrect.' });
    }

    console.log(`🔑 Successful login for ${cleanEmail}`);

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

// 1. Live Geocode & Reverse Geocode via OpenStreetMap Nominatim
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

  let targetCategories = ['service', 'towing', 'medical', 'fuel'];
  if (issueType === 'BIKE_BREAKDOWN' || issueType === 'FLAT_TYRE') {
    targetCategories = ['service', 'towing'];
  } else if (issueType === 'OUT_OF_FUEL') {
    targetCategories = ['fuel', 'ev', 'towing'];
  } else if (issueType === 'MEDICAL_EMERGENCY') {
    targetCategories = ['medical'];
  } else if (issueType === 'NEED_STAY') {
    targetCategories = ['stay'];
  }

  const allServices = await placeProvider.getNearbyServices({ lat, lng, radiusKm });
  const emergencyMatches = allServices.filter(p => targetCategories.includes(p.category));

  // Record assistance request in Supabase PostgreSQL
  try {
    await db.query(`
      INSERT INTO assistance_requests (issue_type, lat, lng, status)
      VALUES ($1, $2, $3, $4);
    `, [issueType, lat, lng, 'OPEN']);
  } catch (e) {}

  return res.json({
    issueType,
    totalMatches: emergencyMatches.length,
    emergencyContacts: [
      { name: 'National Emergency Helpline', phone: '112' },
      { name: 'Ambulance Emergency', phone: '108' },
      { name: 'Roadside Towing Helpline', phone: '1800 102 1100' }
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
