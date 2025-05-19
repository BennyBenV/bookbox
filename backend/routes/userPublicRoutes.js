const express = require("express");
const router = express.Router();
const { getUserProfile, getUserBooks, getUserStats, getUserReviews, searchUsers} = require ("../controllers/userPublicController");
const User = require("../models/User");

router.get("/search", searchUsers);
router.get("/:username", getUserProfile);
router.get("/:username/books", getUserBooks);
router.get("/:username/stats", getUserStats);
router.get("/:username/reviews", getUserReviews);



module.exports = router;