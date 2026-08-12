/**
 * Database Module - PostgreSQL Pool for Supabase
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.supabase_db_url || process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('⚠️ No database URL configured in environment variables (supabase_db_url).');
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

pool.on('connect', () => {
  console.log('🐘 Connected to Supabase PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
