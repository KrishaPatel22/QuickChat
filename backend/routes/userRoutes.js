// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { getAllUsers, getUnreadCounts } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getAllUsers);
router.get("/unread-counts", protect, getUnreadCounts);

module.exports = router;