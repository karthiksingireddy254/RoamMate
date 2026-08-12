/**
 * CommunityService - Manages saved places & user bookmarks in Supabase PostgreSQL
 */

const db = require('../db');

class CommunityService {
  async savePlace(placeId, userId = 'default_user') {
    try {
      await db.query(`
        INSERT INTO saved_places (user_id, place_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, place_id) DO NOTHING;
      `, [userId, placeId]);
      return { success: true };
    } catch (err) {
      console.warn('Database save place failed:', err.message);
      return { success: false, error: err.message };
    }
  }

  async unsavePlace(placeId, userId = 'default_user') {
    try {
      await db.query(`
        DELETE FROM saved_places
        WHERE user_id = $1 AND place_id = $2;
      `, [userId, placeId]);
      return { success: true };
    } catch (err) {
      console.warn('Database unsave place failed:', err.message);
      return { success: false, error: err.message };
    }
  }

  async getSavedPlaceIds(userId = 'default_user') {
    try {
      const res = await db.query(`
        SELECT place_id FROM saved_places WHERE user_id = $1;
      `, [userId]);
      return res.rows.map(row => row.place_id);
    } catch (err) {
      console.warn('Database get saved places failed:', err.message);
      return [];
    }
  }
}

module.exports = new CommunityService();
