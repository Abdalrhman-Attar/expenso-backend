import { auth } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";
import client from "../db.js";

dotenv.config();

export const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

export async function requireUser(req, res, next) {
  try {
    const auth0Id = req.auth.payload.sub;
    const { rows } = await client.query("SELECT id FROM users WHERE auth0_id = $1", [auth0Id]);
    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }
    req.userId = rows[0].id;
    next();
  } catch (err) {
    console.error("requireUser error", err);
    res.status(500).json({ message: "Server error" });
  }
}
