const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  googleBookId: {
    type: mongoose.Schema.Types.String,
    required: true,
    // ref: "Book"
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  review: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
