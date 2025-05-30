const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {getReviewsByBook, createOrUpdateReview, getAverageRating, getUserReview,updateReviewText, deleteReview} = require("../controllers/reviewController");

router.get("/:googleBookId/average", getAverageRating);
router.get("/:googleBookId/me", auth, getUserReview); 
router.patch("/:googleBookId/review", auth, updateReviewText); 
router.get("/:googleBookId", getReviewsByBook);
router.post("/", auth, createOrUpdateReview);
router.delete("/:googleBookId", auth, deleteReview);


module.exports = router;