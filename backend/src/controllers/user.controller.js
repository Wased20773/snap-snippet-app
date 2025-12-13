import { findUserById } from "../services/user.service.js";

// Get the profile data of the user
export async function getProfile(req, res) {
  try {
    const userId = req.user.id;

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // only sending public info
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      subscription: {
        tier: user.tier,
        status: user.status,
        renewal_date: user.renewal_date,
        daily_scan_limit: user.daily_scan_limit,
        last_reset_date: user.last_reset_date,
        scans_used_today: user.scans_used_today,
      },
      createdAt: user.createdAt,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error fetching profile info" });
  }
}
