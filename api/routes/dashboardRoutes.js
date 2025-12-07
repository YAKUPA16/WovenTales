// [Backend] api/routes/dashboardRoutes.js
const router = require("express").Router();
const { protect } = require("../middleware/auth");
const { getDashboard } = require("../controllers/dashboardController");

router.get("/", protect, getDashboard);

module.exports = router;
