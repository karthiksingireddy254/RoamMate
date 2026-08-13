/**
 * DbInit - Supabase PostgreSQL Database Table Migration & Vehicle Services Dataset
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
    status: 'Open 24 Hours',
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
    status: 'Open 24 Hours',
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
    status: 'Open 24 Hours',
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
    status: 'Available 24 Hours',
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
    status: 'Available 24 Hours',
    phone: '1800 121 4000',
    amenities: JSON.stringify(['Ather Fast Charger', 'Ather 450X & Apex Compatible', '24x7 Access']),
    description: 'High-speed 2-wheeler EV charging point for Ather and compatible electric scooters.',
    tags: JSON.stringify(['ev', 'ather', 'medchal', 'scooter']),
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'ev-03',
    name: 'Jio-bp pulse 150kW Ultra Fast EV Charger',
    category: 'ev',
    subcategory: 'Superfast Charger',
    lat: 15.5480,
    lng: 73.7610,
    address: 'Chogm Road, Porvorim, North Goa, 403521',
    rating: 4.9,
    reviews_count: 310,
    status: 'Available 24 Hours',
    phone: '1800 891 9000',
    amenities: JSON.stringify(['150kW Ultra Fast DC', 'Multi-Vehicle Simultaneous Charge', 'Cafeteria Onsite']),
    description: 'High-power ultra-fast EV charging station supporting all electric cars and SUVs.',
    tags: JSON.stringify(['ev', 'jio-bp', 'goa', 'fastcharger']),
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80'
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
    status: 'Open now (7:30 AM - 9:30 PM)',
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
    status: 'Open now (9:00 AM - 7:00 PM)',
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
    status: 'Open now (8:30 AM - 8:00 PM)',
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
    status: 'Available 24 Hours',
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
    status: 'Available 24 Hours',
    phone: '+91 98225 11223',
    amenities: JSON.stringify(['Hydraulic Tow Truck', 'Lockout Key Assistance', 'Tyre Change Onsite']),
    description: 'Instant 24-hour towing service across Goa highways and beach roads.',
    tags: JSON.stringify(['towing', 'assistance', 'goa', 'rescue']),
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=80'
  },

  // --- VEHICLE PARKING (parking) ---
  {
    id: 'parking-01',
    name: 'City Center Multi-Level Automated Parking Plaza',
    category: 'parking',
    subcategory: 'Multi-Level Car Parking',
    lat: 17.4320,
    lng: 78.4480,
    address: 'Panjagutta Junction, Hyderabad, Telangana, 500082',
    rating: 4.6,
    reviews_count: 1890,
    status: 'Open 24 Hours',
    phone: '+91 40 2341 0000',
    amenities: JSON.stringify(['CCTV Security 24x7', 'Covered Slots', 'FASTag Automated Entry', 'EV Charging Slots']),
    description: 'Modern 6-storey automated car and bike parking complex with security cameras.',
    tags: JSON.stringify(['parking', 'car', 'bike', 'hyderabad']),
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'parking-02',
    name: 'Medchal Market Secure Vehicle Parking',
    category: 'parking',
    subcategory: 'Paid Parking Space',
    lat: 17.6245,
    lng: 78.4805,
    address: 'Medchal Main Market Road, Medchal, Telangana, 501400',
    rating: 4.5,
    reviews_count: 310,
    status: 'Open (6:00 AM - 11:00 PM)',
    phone: '+91 94400 98765',
    amenities: JSON.stringify(['Two Wheeler Slots', 'Car Bay', 'Guarded Entry']),
    description: 'Safe parking facility located right next to Medchal market and bus stand.',
    tags: JSON.stringify(['parking', 'medchal', 'bike']),
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80'
  },

  // --- VEHICLE RENTALS (rental) ---
  {
    id: 'rental-01',
    name: 'Tourist Scooter & Bike Rental Agency',
    category: 'rental',
    subcategory: 'Bike & Scooter Rental',
    lat: 15.5420,
    lng: 73.7580,
    address: 'Calangute Circle, North Goa, 403516',
    rating: 4.8,
    reviews_count: 1240,
    status: 'Open (8:00 AM - 9:00 PM)',
    phone: '+91 94220 56789',
    amenities: JSON.stringify(['Activa Scooters', 'Royal Enfield Himalayan', 'Helmets Included', 'Zero Deposit Option']),
    description: 'Top-rated tourist self-drive vehicle agency offering scooters, motorbikes, and open jeeps.',
    tags: JSON.stringify(['rental', 'scooter', 'bike', 'goa', 'selfdrive']),
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'rental-02',
    name: 'Royal Self Drive Cars & SUV Rentals',
    category: 'rental',
    subcategory: 'Car Rental',
    lat: 17.4410,
    lng: 78.3820,
    address: 'HITEC City Metro Station, Hyderabad, 500081',
    rating: 4.7,
    reviews_count: 650,
    status: 'Open (7:00 AM - 10:00 PM)',
    phone: '+91 40 4012 3456',
    amenities: JSON.stringify(['Self-Drive Hatchbacks & SUVs', 'Sanitized Vehicles', 'Unlimited Kilometers']),
    description: 'Premium self-drive car rental agency with Thar, Creta, Swift, and Baleno available.',
    tags: JSON.stringify(['rental', 'car', 'selfdrive', 'hyderabad']),
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80'
  }
];

async function initializeDatabase() {
  try {
    console.log('🐘 Initializing Supabase PostgreSQL database tables...');

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
        status VARCHAR(100) DEFAULT 'Open Now',
        phone VARCHAR(100),
        amenities JSONB DEFAULT '[]'::jsonb,
        description TEXT,
        tags JSONB DEFAULT '[]'::jsonb,
        image TEXT,
        provider_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_places_lat_lng ON places(lat, lng);`);

    // 2. PURGE NON-VEHICLE PLACES (hotels, restaurants, ATMs, toilets, tourism) FROM DATABASE
    await db.query(`DELETE FROM places WHERE category NOT IN ('service', 'towing', 'fuel', 'ev', 'parking', 'rental');`);
    console.log('🧹 Purged non-vehicle places (hotels, restaurants, ATMs, tourism) from Supabase DB.');

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

    // 4. Create Users Table
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

    // 5. Create Business Organizations / Service Providers Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS business_providers (
        id VARCHAR(100) PRIMARY KEY,
        business_name VARCHAR(255) NOT NULL,
        owner_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        license_no VARCHAR(100),
        city VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Supabase PostgreSQL vehicle database tables verified.');

    // Upsert vehicle-related services into Supabase PostgreSQL
    console.log('🌱 Upserting vehicle-related services into Supabase PostgreSQL...');
    for (const p of SEED_VEHICLE_SERVICES) {
      await db.query(`
        INSERT INTO places (id, name, category, subcategory, lat, lng, address, rating, reviews_count, status, phone, amenities, description, tags, image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          subcategory = EXCLUDED.subcategory,
          address = EXCLUDED.address,
          rating = EXCLUDED.rating,
          reviews_count = EXCLUDED.reviews_count,
          phone = EXCLUDED.phone,
          description = EXCLUDED.description,
          image = EXCLUDED.image;
      `, [
        p.id, p.name, p.category, p.subcategory, p.lat, p.lng,
        p.address, p.rating, p.reviews_count, p.status, p.phone,
        p.amenities, p.description, p.tags, p.image
      ]);
    }
    console.log('🌱 Database loaded with vehicle-only services.');

  } catch (err) {
    console.error('❌ Error initializing PostgreSQL database schema:', err.message);
  }
}

module.exports = {
  initializeDatabase
};
