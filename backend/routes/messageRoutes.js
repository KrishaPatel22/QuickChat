// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const { getMessages, sendMessage, markAsRead } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:userId", protect, getMessages);
router.post("/", protect, sendMessage);
router.put("/read/:senderId", protect, markAsRead);

module.exports = router;