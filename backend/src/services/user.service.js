import pool from "../db/index.js";

// Query to find user profile by ID
export async function findUserById(id) {
  const res = await pool.query(
    `SELECT u.name, u.email, u."createdAt", s.tier, s.status, s.renewal_date, s.daily_scan_limit, s.last_reset_date, s.scans_used_today FROM users u LEFT JOIN subscription s ON (u.id = s."usersId") WHERE u.id = $1;`,
    [id]
  );
  return res.rows[0];
}
