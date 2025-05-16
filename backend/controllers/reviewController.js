const Review = require("../models/Review");

// GET - All reviews for a Google Book ID
exports.getReviewsByBook = async (req, res) => {
  try {
    const { googleBookId } = req.params;
    if (!googleBookId)
      return res.status(400).json({ success: false, message: "Missing Google Book ID." });

    const reviews = await Review.find({ googleBookId })
      .sort({ createdAt: -1 })
      .populate("userId", "username avatar");

    const formatted = reviews.map((r) => ({
      rating: r.rating,
      review: r.review,
      user: r.userId?.username || "Anonymous",
      avatar: r.userId?.avatar || "uploads/avatars/default.jpg",
      createdAt: r.createdAt,
    }));

    res.json({ success: true, reviews: formatted });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ success: false, message: "Erreur getReviewsByBook" });
  }
};


// POST - Create or update a review for a Google Book
exports.createOrUpdateReview = async (req, res) => {
  try {
    const { googleBookId, rating, review } = req.body;
    const userId = req.user?.id;

    if (!googleBookId || !userId) {
      return res.status(400).json({ success: false, message: "Google Book ID or user ID missing." });
    }

    const existingReview = await Review.findOne({ userId, googleBookId });

    if (existingReview) {
      if (rating !== undefined) existingReview.rating = rating;
      if (review !== undefined) existingReview.review = review;
      await existingReview.save();
      return res.json({ success: true, review: existingReview });
    }

    const newReview = await Review.create({
      userId,
      googleBookId,
      rating: rating ?? 0,
      review: review ?? "",
    });

    res.status(201).json({ success: true, review: newReview });
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).json({ success: false, message: "Erreur createOrUpdateReview" });
  }
};

// GET - Get current user's review for a specific Google Book
exports.getUserReview = async (req, res) => {
  try {
    const { googleBookId } = req.params;
    const userId = req.user?.id;

    if (!googleBookId || !userId) {
      return res.status(400).json({ success: false, message: "Google Book ID or user ID missing." });
    }

    const review = await Review.findOne({ googleBookId, userId });

    if (!review) {
      return res.json({ success: true, review: null });
    }

    res.json({
      success: true,
      review: {
        rating: review.rating,
        review: review.review,
        createdAt: review.createdAt,
      },
    });
  } catch (err) {
    console.error("Erreur getUserReview:", err);
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};


//Update only the review text
exports.updateReviewText = async (req, res) => {
  try {
    const { googleBookId } = req.params;
    const { review } = req.body;
    const userId = req.user?.id;

    if (!googleBookId || !userId) {
      return res.status(400).json({ success: false, message: "Missing parameters." });
    }

    const existingReview = await Review.findOne({ googleBookId, userId });
    if (!existingReview) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    existingReview.review = review;
    await existingReview.save();

    res.json({ success: true, review: existingReview });
  } catch (err) {
    console.error("Erreur updateReviewText:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// GET - Average rating for a Google Book ID
exports.getAverageRating = async (req, res) => {
  try {
    const { googleBookId } = req.params;
    if (!googleBookId) return res.status(400).json({ success: false, message: "Missing Google Book ID." });

    const reviews = await Review.find({ googleBookId, rating: { $gt: 0 } });

    if (!reviews.length) {
      return res.json({ success: true, average: null, count: 0 });
    }

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const average = total / reviews.length;

    res.json({ success: true, average: Number(average.toFixed(2)), count: reviews.length });
  } catch (err) {
    console.error("Erreur calcul moyenne note:", err);
    res.status(500).json({ success: false, message: "Erreur lors du calcul de la moyenne." });
  }
};

// DELETE - Remove a user's review for a book
exports.deleteReview = async (req, res) => {
  try{
    const { googleBookId } = req.params;
    const userId = req.user?.id;

    if(!googleBookId || !userId) {
      return res.status(400).json({ success: false, message: "Missing parameters."});
    }
    
    const deleted = await Review.findOneAndDelete({ googleBookId, userId });

    if(!deleted){
      return res.status(400).json({ success: false, message: "Review not found."});
    }

    res.json({ success: true, message: "Review deleted "});
  }catch(err){
    console.error("Erreur deleteReview:", err);
    res.status(500).json({ success: false, message: "Erreur suppression review" });
  }
}