const Book = require("../models/Book");

exports.getAllBooks = async (req, res) => { 
    try{
        const books = await Book.find({ userId: req.user.id}).sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {   
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des livres" });
    }
};

exports.getBookById = async (req, res) => {
    try{
        const book = await Book.findById({_id: req.params.id, userId: req.user.id});
        if (!book) return res.status(404).json({ message: "Livre introuvable" });
        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du livre" });
    }
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
    try{
        const book = await Book.findByIdAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );
            
        if (!book) return res.status(404).json({ message: "Livre introuvable" });
        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour du livre" });
    }
};

exports.deleteBook = async (req, res) => {
    const book = await Book.findByIdAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!book) return res.status(404).json({ message: "Livre introuvable" });
    res.json({ message: "Livre supprimé" });
};