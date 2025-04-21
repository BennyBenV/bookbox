const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['à lire', 'en cours', 'lu'],
        default: 'à lire',
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
    review: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
 });

 module.exports = mongoose.model("Book", bookSchema);