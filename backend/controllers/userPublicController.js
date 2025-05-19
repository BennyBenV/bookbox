const User = require("../models/User");
const Book = require("../models/Book");
const Review = require("../models/Review");

exports.getUserProfile = async (req,res) => {
    try{
        const user = await User.findOne({ username: new RegExp(`^${req.params.username}$`, 'i') });
        if(!user) return res.status(404).json({ success: false, message: "Utilisateur introuvable."});
        res.json({ success: true, user });
    }catch(err) {
        console.error("getUserProfile:", err);
        res.status(500).json({ success : false, message: "Erreur serveur"});
    }
}

exports.getUserBooks = async (req, res) => {
    try {
        const user = await User.findOne({ username: new RegExp(`^${req.params.username}$`, 'i') });
        if(!user) return res.status(404).json({ success: false, message: "Utilisateur introuvable."});

        const books = await Book.find({ userId: user._id }).sort({updatedAt: -1});
        res.json({ success: true, books });
    }catch(err){
        console.error("getUserBooks:", err);
        res.status(500).json({ success: false, message: "Erreur serveur"});
    }
}

exports.getUserStats = async (req, res) => {
    try{
        const user = await User.findOne({ username: new RegExp(`^${req.params.username}$`, 'i') });
        if(!user) return res.status(404).json({ success: false, message: "Utilisateur introuvable."});

        const books = await Book.find({ userId: user._id });

        const total = books.length;
        const lus = books.filter((b) => b.status === "lu").length;
        const enCours = books.filter((b) => b.status === "en cours").length;
        const aLire = books.filter((b) => b.status === "à lire").length;
        const notes = books.filter((b) => typeof b.rating === "number");
        const moyenneNote = notes.reduce((sum,b) => sum + b.rating, 0) / (notes.length || 1);

        res.json({
            success: true,
            total,
            lus,
            enCours,
            aLire,
            moyenneNote: Number(moyenneNote.toFixed(2))
        })
    }catch(err){
        console.error("getUserStats:", err);
        res.status(500).json({success: false, message:"Erreur stats"})
    }
}

exports.getUserReviews = async (req,res) =>{
    try{
        const { username } = req.params;
        const user = await User.findOne({ username: new RegExp(`^${req.params.username}$`, 'i') });
        if(!user) return res.status(404).json({ success : false, message: "Utilisateur introuvable"});

        const reviews = await Review.find({userId: user._id, review: {$ne: ""}}).sort({ updatedAt: -1}).select(" review rating googleBookId updatedAt");

        const reviewsWithBookData = await Promise.all(reviews.map(async (r) => {
            const book = await Book.findOne({ googleBookId: r.googleBookId});
            return {
                review: r.review,
                rating: r.rating,
                googleBookId: r.googleBookId,
                createdAt: r.createdAt,
                book: book
                ? {
                    title: book.title,
                    author: book.authors?.[0] || "Auteur inconnu",
                    thumbnail: book.thumbnail,
                    }
                : null
            };
            }));
        
        res.json({ success: true, reviews: reviewsWithBookData });
    }catch(err){
        console.error("getUserReviews:", err);
        res.status(500).json({success: false, message:"Erreur reviews"})
    }
}

exports.searchUsers = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);

    const users = await User.find({
      username: { $regex: new RegExp(q, "i") },
    }).select("username avatar");

    res.json(users);
  } catch (err) {
    console.error("Erreur recherche utilisateur:", err);
    res.status(500).json({ message: "Erreur lors de la recherche" });
  }
};
