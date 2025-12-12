import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // needed for Neon SSL
  },
});

try {
  const client = await pool.connect();
  console.log("Connected to PostgreSQL Neon database");

  // test for actual connection by running a query
  //   const res = await client.query("SELECT NOW()");
  //   console.log("DB time: ", res.rows[0]);

  client.release();
} catch (e) {
  console.error("Failed to connect to PostgreSQL Neon database:", e);
}

export default pool;
