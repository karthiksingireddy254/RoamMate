/**
 * AnalyticsEngine - Logs search metrics into Supabase PostgreSQL
 */

const db = require('../db');

class AnalyticsEngine {
  async logSearchEvent({ lat, lng, radiusKm, category, keyword, resultsCount }) {
    try {
      await db.query(`
        INSERT INTO analytics_events (event_type, lat, lng, category, keyword, results_count)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, ['SEARCH_NEARBY', lat, lng, category || 'all', keyword || '', resultsCount || 0]);
    } catch (err) {
      console.warn('Analytics DB log failed:', err.message);
    }
  }

  async getMetrics() {
    try {
      const totalRes = await db.query(`SELECT COUNT(*) FROM analytics_events;`);
      const recentRes = await db.query(`SELECT * FROM analytics_events ORDER BY created_at DESC LIMIT 10;`);
      return {
        totalSearches: parseInt(totalRes.rows[0].count, 10),
        recentEvents: recentRes.rows
      };
    } catch (err) {
      return { totalSearches: 0, recentEvents: [] };
    }
  }
}

module.exports = new AnalyticsEngine();
