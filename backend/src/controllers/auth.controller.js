import {
  createUser,
  findUserByEmail,
  generateJwt,
  validatePassword,
} from "../services/auth.service.js";

// Registers a new account into the database
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, Email, and password are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const result = await createUser(name, email, password);

    res.status(201).json({
      message: "User created successfully",
      user: result.user,
      token: result.token,
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({
        message: "Internal server error while trying to register",
        error: e.message,
      });
  }
}

// Logs user into their account
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValid = await validatePassword(
      password,
      existingUser.hashed_password
    );
    if (!isValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateJwt(existingUser.id, existingUser.email);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Internal server error while trying to login",
      error: e.message,
    });
  }
}
