// [Backend] api/routes/testRoutes.js
const router = require("express").Router();
const { protect } = require("../middleware/auth");

router.get("/me", protect, (req, res) => {
  res.json({ ok: true, user: req.user });
});

module.exports = router;
