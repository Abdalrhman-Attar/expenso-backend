import { Router } from "express";
import client from "../db.js";
import { checkJwt } from "../middleware/auth.js";
import { ManagementClient } from "auth0";

const router = Router();

const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_MGMT_CLIENT_ID,
  clientSecret: process.env.AUTH0_MGMT_CLIENT_SECRET,
  scope: "update:users update:roles read:roles",
});

// GET /api/users/me → fetch or create the user
router.get("/me", checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    // 1) Look up existing
    let { rows } = await client.query("SELECT id, auth0_id, name, email, subscription, created_at FROM users WHERE auth0_id = $1", [auth0Id]);
    let user = rows[0];
    if (!user) {
      // 2) If missing, insert
      const email = req.auth.payload.email || null;
      const name = req.auth.payload.name || null;
      const insert = `
        INSERT INTO users (auth0_id, name, email)
        VALUES ($1,$2,$3)
        RETURNING id, auth0_id, name, email, subscription, created_at
      `;
      ({ rows } = await client.query(insert, [auth0Id, name, email]));
      user = rows[0];
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// (Optional) PATCH /api/users/me → update profile/subscription
router.patch("/me", checkJwt, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { name, subscription } = req.body;
  try {
    const update = `
      UPDATE users
      SET name=$1,
          subscription=$2,
          updated_at=now()
      WHERE auth0_id=$3
      RETURNING id, auth0_id, name, email, subscription, updated_at
    `;
    const { rows } = await client.query(update, [name, subscription, auth0Id]);
    if (!rows.length) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/upgrade", checkJwt, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const PREMIUM_ROLE_ID = "rol_DXiAmCra9rsdmBR6";

  try {
    await auth0.users.assignRoles({ id: auth0Id }, { roles: [PREMIUM_ROLE_ID] });

    const update = `
      UPDATE users
      SET subscription='Premium',
          updated_at=now()
      WHERE auth0_id=$1
      RETURNING id, auth0_id, name, email, subscription, updated_at
    `;
    const { rows } = await client.query(update, [auth0Id]);
    if (!rows.length) return res.status(404).json({ message: "User not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Failed to upgrade to Premium:", err);
    res.status(500).json({ message: "Server error upgrading user" });
  }
});

export default router;
