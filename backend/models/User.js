const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "uploads/avatars/default.jpg",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }],
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);