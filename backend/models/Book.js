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
    coverId: {
        type: Number,
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
    // createdAt: {
    //     type: String,
    //     default: () => new Date().toLocaleDateString('fr-FR'),
    // },
    olid: {
        type: String,
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },

    

}, {strict: true, timestamps: true});

 module.exports = mongoose.model("Book", bookSchema);