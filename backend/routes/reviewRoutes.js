const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {getReviewsByBook, createOrUpdateReview, getAverageRating} = require("../controllers/reviewController");

router.get("/:olid/average", getAverageRating);
router.get("/:olid", getReviewsByBook);
router.post("/", auth, createOrUpdateReview);

module.exports = router;