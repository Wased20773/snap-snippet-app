import pool from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

// Check if a user exists by email
export async function findUserByEmail(email) {
  const res = await pool.query(`SELECT email FROM users WHERE email = $1`, [
    email,
  ]);
  return res.rows[0];
}

// create a new user and return a JWT token
export async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const res = await pool.query(
    `INSERT INTO users (name, email, hashed_password) VALUES ($1, $2, $3) RETURNING id, email`,
    [name, email, hashedPassword]
  );

  const user = res.rows[0];

  // Generate JWT
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return { user, token };
}
