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
    const { title, author, status, rating, review, coverId } = req.body;
    const book = await Book.create({
        title,
        author,
        status,
        rating,
        review,
        coverId,
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

exports.getStats= async (req, res) => {
    try{
        const userId = req.user.id;
        const books = await Book.find({ userId });

        const total = books.length;
        const lus = books.filter((b) => b.status === "lu").length;
        const enCours = books.filter((b) => b.status === "en cours").length;
        const aLire = books.filter((b) => b.status === "à lire").length;

        const notes = books.filter((b) => typeof b.rating === "number");
        const moyenneNote = notes.reduce((sum, b) => sum + b.rating, 0) / (notes.length || 1);

        const auteursMap = {};
        for (const book of books){
            if(!book.author) continue;
            const author = book.author;
            auteursMap[author] = (auteursMap[author] || 0) + 1;
        }

        const topAuteurs = Object.entries(auteursMap).sort((a,b) => b[1] - a[1]).slice(0,3).map(entry => entry[0]);

        res.json({
            total,
            lus,
            enCours,
            aLire,
            moyenneNote: Number(moyenneNote.toFixed(2)),
            topAuteurs,
        });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
    }
}





// exports.debugCreateBook = async (req, res) => {
//     try {
//       console.log("🟨 Données reçues dans le body :", req.body);
  
//       const book = await Book.create(req.body);
  
//       console.log("🟩 Livre créé :", book);
  
//       res.status(201).json(book);
//     } catch (err) {
//       console.error("🟥 Erreur Mongo :", err.message);
//       res.status(500).json({ message: "Erreur lors de la création du livre" });
//     }
//   };
  