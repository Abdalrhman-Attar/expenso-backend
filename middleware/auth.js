import { auth } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";
import client from "../db.js"; // adjust path if needed

dotenv.config();

// 1) JWT validation
export const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

// 2) Find or error on your internal user record
export async function requireUser(req, res, next) {
  try {
    const auth0Id = req.auth.payload.sub; // e.g. "auth0|abcdef123"
    const { rows } = await client.query("SELECT id FROM users WHERE auth0_id = $1", [auth0Id]);
    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }
    req.userId = rows[0].id; // attach for downstream
    next();
  } catch (err) {
    console.error("requireUser error", err);
    res.status(500).json({ message: "Server error" });
  }
}
