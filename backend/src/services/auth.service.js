import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/index.js";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

// Check if a user exists by email
export async function findUserByEmail(email) {
  const res = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
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
    expiresIn: "7d", // maybe ask user if they want to stay logged in?
  });

  return { user, token };
}

// Validating user input password -> true or false
export async function validatePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// Generates the JWT token after login
export function generateJwt(id, email) {
  return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: "7d" });
}
