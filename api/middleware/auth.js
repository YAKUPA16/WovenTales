// [Backend] api/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) return res.status(401).json({ message: "Not authorized, no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) return res.status(401).json({ message: "Not authorized, invalid token payload" });

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(401).json({ message: "Not authorized, user not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protect };
