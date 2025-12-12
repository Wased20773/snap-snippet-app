import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Missing authorization token" });
  }

  // Authorization: Bearer <token>
  const [type, token] = header.split(" "); // split to get each string
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user to request
    req.user = decoded;

    // continue to the route handler
    next();
  } catch (e) {
    return res.status(403).json({ message: "Invalid or expired token: ", e });
  }
}
