const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],
    default: ["Auteur inconnu"],
  },
  thumbnail: {
    type: String,
  },
  status: {
    type: String,
    enum: ['à lire', 'en cours', 'lu'],
    default: 'à lire',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  googleBookId: {
    type: String,
    required: true,
    unique: true,
  },
}, { strict: true, timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
