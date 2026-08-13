/**
 * DbInit - Supabase PostgreSQL Database Table Migration & Real-World Dataset Engine
 */

const db = require('../db');

const SEED_VEHICLE_SERVICES = [
  // --- FUEL STATIONS (fuel) ---
  {
    id: 'fuel-01',
    name: 'Indian Oil Swagat Mega Fuel Care 24x7',
    category: 'fuel',
    subcategory: 'Highway Fuel Station',
    lat: 17.6320,
    lng: 78.4850,
    address: 'NH44 North Highway, Medchal Mandal, Medchal, Telangana, 501400',
    rating: 4.6,
    reviews_count: 850,
    status: 'Available Now',
    phone: '+91 94400 12345',
    amenities: JSON.stringify(['XP95 Petrol', 'High Speed Diesel', 'Air Pressure Checking', 'Clean Washroom', '24x7 Card Accepted']),
    description: 'Major 24-hour Swagat highway fuel plaza with automated pumps and nitrogen air.',
    tags: JSON.stringify(['fuel', 'petrol', 'diesel', 'medchal', '24x7']),
    image: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'fuel-02',
    name: 'HPCL Auto Care Fuel Pump - Panaji City',
    category: 'fuel',
    subcategory: 'Petrol & Diesel Station',
    lat: 15.4989,
    lng: 73.8278,
    address: 'Patto Plaza Circle, Panaji, Goa, 403001',
    rating: 4.5,
    reviews_count: 620,
    status: 'Available Now',
    phone: '+91 832 243 8000',
    amenities: JSON.stringify(['Power Petrol', 'Diesel', '24x7 Card Payment', 'Free Tyre Air']),
    description: 'Central fuel station in Panaji city center equipped with digital payments and air checking.',
    tags: JSON.stringify(['fuel', 'petrol', 'panaji', 'goa']),
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'fuel-03',
    name: 'BPCL Smart Auto Fuel & Nitrogen Center',
    category: 'fuel',
    subcategory: '24x7 Fuel Station',
    lat: 17.4420,
    lng: 78.3850,
    address: 'Gachibowli Main Road, Cyberabad, Hyderabad, 500032',
    rating: 4.7,
    reviews_count: 1240,
    status: 'Available Now',
    phone: '+91 40 2300 4545',
    amenities: JSON.stringify(['Speed Petrol', 'Hi-Speed Diesel', 'Nitrogen Air Inflation', 'EV Quick Charging']),
    description: 'Modern BPCL automated smart station with digital pay and quick lube service.',
    tags: JSON.stringify(['fuel', 'petrol', 'gachibowli', 'hyderabad']),
    image: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=600&auto=format&fit=crop&q=80'
  },

  // --- EV CHARGING HUBS (ev) ---
  {
    id: 'ev-01',
    name: 'Tata Power 60kW DC Fast EV Charging Hub',
    category: 'ev',
    subcategory: 'EV Fast Charger',
    lat: 17.4486,
    lng: 78.3808,
    address: 'Cyber Towers Basement, HITEC City, Hyderabad, 500081',
    rating: 4.8,
    reviews_count: 430,
    status: 'Available Now',
    phone: '1800 209 5161',
    amenities: JSON.stringify(['60kW Dual DC Fast Charger', 'CCS2 & Type-2 Compatible', 'Covered Bay', 'EZ Charge App']),
    description: 'Ultra-fast EV charging station compatible with Nexon EV, ZS EV, Ioniq, and Ather.',
    tags: JSON.stringify(['ev', 'fastcharger', 'hiteccity', 'hyderabad']),
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'ev-02',
    name: 'Ather Grid Fast Charger Station - Medchal Hub',
    category: 'ev',
    subcategory: '2-Wheeler EV Charger',
    lat: 17.6210,
    lng: 78.4790,
    address: 'Medchal Market Road, Medchal, Telangana, 501400',
    rating: 4.7,
    reviews_count: 180,
    status: 'Available Now',
    phone: '1800 121 4000',
    amenities: JSON.stringify(['Ather Fast Charger', 'Ather 450X & Apex Compatible', '24x7 Access']),
    description: 'High-speed 2-wheeler EV charging point for Ather and compatible electric scooters.',
    tags: JSON.stringify(['ev', 'ather', 'medchal', 'scooter']),
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80'
  },

  // --- MECHANICS & REPAIR GARAGES (service) ---
  {
    id: 'service-01',
    name: 'Express Bike & Scooter Doctor Garage',
    category: 'service',
    subcategory: 'Bike Mechanic',
    lat: 17.6280,
    lng: 78.4830,
    address: 'Near Medchal Bus Terminus, Medchal mandal, Telangana, 501400',
    rating: 4.9,
    reviews_count: 510,
    status: 'Available Now',
    phone: '+91 98490 55123',
    amenities: JSON.stringify(['Instant Tubeless Puncture Repair', 'Engine Oil Replacement', 'Chain Lube', 'Brake Tuning']),
    description: 'Top-rated motorcycle & scooter repair garage specializing in instant punctures and highway breakdowns.',
    tags: JSON.stringify(['mechanic', 'bike', 'scooter', 'puncture', 'medchal']),
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'service-02',
    name: 'Royal Enfield Authorised Service Workshop',
    category: 'service',
    subcategory: 'Superbike Garage',
    lat: 15.4920,
    lng: 73.8310,
    address: 'Mala Bypass Road, Panaji, Goa, 403001',
    rating: 4.8,
    reviews_count: 820,
    status: 'Available Now',
    phone: '+91 832 242 1100',
    amenities: JSON.stringify(['RE Genuine Spare Parts', 'Touring Setup', 'Clutch Cable Repair', 'Engine Wash']),
    description: 'Official Royal Enfield motorcycle service garage for Classic, Bullet, Himalayan, and Interceptor.',
    tags: JSON.stringify(['mechanic', 'royalenfield', 'goa', 'bike']),
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'service-03',
    name: 'Bosch Car Service Center & Multi-Brand Garage',
    category: 'service',
    subcategory: 'Car Service Center',
    lat: 17.4390,
    lng: 78.4410,
    address: 'Road No. 12, Banjara Hills, Hyderabad, Telangana, 500034',
    rating: 4.8,
    reviews_count: 1450,
    status: 'Available Now',
    phone: '+91 40 2335 9999',
    amenities: JSON.stringify(['Computerized Engine Diagnostics', 'Wheel Alignment', 'AC Gas Refill', 'Brake Pad Replacement']),
    description: 'Authorized multi-brand car repair workshop with certified mechanics and genuine spares.',
    tags: JSON.stringify(['mechanic', 'car', 'garage', 'banjarahills', 'hyderabad']),
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80'
  },

  // --- TOWING & ROADSIDE RESCUE (towing) ---
  {
    id: 'towing-01',
    name: 'National 24x7 Highway Towing & Flatbed Recovery',
    category: 'towing',
    subcategory: 'Flatbed Tow Truck',
    lat: 17.6150,
    lng: 78.4750,
    address: 'NH44 Highway Emergency Zone, Medchal, Telangana, 501400',
    rating: 4.9,
    reviews_count: 640,
    status: 'Available Now',
    phone: '+91 98221 00999',
    amenities: JSON.stringify(['Flatbed Towing', 'Bike Carrier', 'Emergency Fuel Delivery', 'Battery Jumpstart']),
    description: 'Emergency 24-hour towing and roadside recovery for cars, SUVs, and motorbikes.',
    tags: JSON.stringify(['towing', 'breakdown', 'recovery', '24x7', 'medchal']),
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'towing-02',
    name: 'Coastal Roadside Assistance & Towing Services',
    category: 'towing',
    subcategory: '24x7 Towing Squad',
    lat: 15.5450,
    lng: 73.7650,
    address: 'Calangute - Mapusa Road, North Goa, 403507',
    rating: 4.8,
    reviews_count: 420,
    status: 'Available Now',
    phone: '+91 98225 11223',
    amenities: JSON.stringify(['Hydraulic Tow Truck', 'Lockout Key Assistance', 'Tyre Change Onsite']),
    description: 'Instant 24-hour towing service across Goa highways and beach roads.',
    tags: JSON.stringify(['towing', 'assistance', 'goa', 'rescue']),
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=80'
  }
];

async function initializeDatabase() {
  try {
    console.log('🐘 Initializing Supabase PostgreSQL database schema...');

    // 1. Create Places Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS places (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        subcategory VARCHAR(100),
        lat DOUBLE PRECISION NOT NULL,
        lng DOUBLE PRECISION NOT NULL,
        address TEXT,
        rating NUMERIC(3, 2) DEFAULT 4.5,
        reviews_count INT DEFAULT 50,
        status VARCHAR(100) DEFAULT 'Available Now',
        phone VARCHAR(100),
        amenities JSONB DEFAULT '[]'::jsonb,
        description TEXT,
        tags JSONB DEFAULT '[]'::jsonb,
        image TEXT,
        provider_id VARCHAR(100),
        verification_status VARCHAR(50) DEFAULT 'VERIFIED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_places_lat_lng ON places(lat, lng);`);

    // 2. PURGE NON-VEHICLE PLACES FROM DATABASE
    await db.query(`DELETE FROM places WHERE category NOT IN ('service', 'towing', 'fuel', 'ev', 'parking', 'rental');`);

    // 3. Create Saved Places Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS saved_places (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100) DEFAULT 'default_user',
        place_id VARCHAR(100) REFERENCES places(id) ON DELETE CASCADE,
        saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, place_id)
      );
    `);

    // 4. Create Tourist Users Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        gender VARCHAR(50) DEFAULT 'Male',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Create Service Providers Table (Business Organizations)
    await db.query(`
      CREATE TABLE IF NOT EXISTS service_providers (
        id VARCHAR(100) PRIMARY KEY,
        business_name VARCHAR(255) NOT NULL,
        owner_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        license_no VARCHAR(100),
        city VARCHAR(100),
        address TEXT,
        lat DOUBLE PRECISION DEFAULT 28.6139,
        lng DOUBLE PRECISION DEFAULT 77.2090,
        coverage_radius_km INT DEFAULT 15,
        availability_status VARCHAR(50) DEFAULT 'AVAILABLE',
        is_24_7_emergency BOOLEAN DEFAULT TRUE,
        verification_status VARCHAR(50) DEFAULT 'VERIFIED',
        vehicle_types JSONB DEFAULT '["Bike", "Car", "SUV"]'::jsonb,
        description TEXT,
        operating_hours VARCHAR(100) DEFAULT '24 Hours Open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Create Provider Services Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS provider_services (
        id VARCHAR(100) PRIMARY KEY,
        provider_id VARCHAR(100) REFERENCES service_providers(id) ON DELETE CASCADE,
        service_name VARCHAR(255) NOT NULL,
        description TEXT,
        vehicle_types JSONB DEFAULT '[]'::jsonb,
        price_range VARCHAR(100) DEFAULT 'Standard Rate',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Supabase PostgreSQL vehicle & provider database schema verified.');

    // Upsert vehicle-related services into Supabase PostgreSQL
    for (const p of SEED_VEHICLE_SERVICES) {
      await db.query(`
        INSERT INTO places (id, name, category, subcategory, lat, lng, address, rating, reviews_count, status, phone, amenities, description, tags, image, verification_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          subcategory = EXCLUDED.subcategory,
          address = EXCLUDED.address,
          rating = EXCLUDED.rating,
          reviews_count = EXCLUDED.reviews_count,
          phone = EXCLUDED.phone,
          description = EXCLUDED.description,
          image = EXCLUDED.image,
          verification_status = EXCLUDED.verification_status;
      `, [
        p.id, p.name, p.category, p.subcategory, p.lat, p.lng,
        p.address, p.rating, p.reviews_count, p.status, p.phone,
        p.amenities, p.description, p.tags, p.image, 'VERIFIED'
      ]);
    }
    console.log('🌱 Database seeded with verified vehicle services.');

  } catch (err) {
    console.error('❌ Error initializing PostgreSQL database schema:', err.message);
  }
}

module.exports = {
  initializeDatabase
};
