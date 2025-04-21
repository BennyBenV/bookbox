const Book = require("../models/Book");

exports.getBooks = async (req, res) => { 
    const books = await Book.find({ userId: req.user.id}).sort({ createdAt: -1 });
    res.json(books);
};

exports.createBook = async (req, res) => {
    const { title, author, status, rating, review } = req.body;
    const book = await Book.create({
        title,
        author,
        status,
        rating,
        review,
        userId: req.user.id,
    });
    res.status(201).json(book);
};

exports.updateBook = async (req, res) => {
    const book = await Book.findById(
        { _id : req.params.id, userId: req.user.id },
        req.body,
        { new: true }
    );
    if (!book) return res.status(404).json({ message: "Livre introuvable" });
    res.json(book);
};

exports.deleteBook = async (req, res) => {
    const book = await Book.findByIdAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!book) return res.status(404).json({ message: "Livre introuvable" });
    res.json({ message: "Livre supprimé" });
};