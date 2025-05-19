const Book = require("../models/Book");
const Review = require("../models/Review");

exports.getAllBooks = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const userId = req.user.id;

    const books = await Book.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "reviews",
          let: { bookId: "$googleBookId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$googleBookId", "$$bookId"] },
                    { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] }
                  ]
                }
              }
            },
            { $limit: 1 }
          ],
          as: "userReview"
        }
      },
      {
        $addFields: {
          review: { $arrayElemAt: ["$userReview.review", 0] },
          rating: { $arrayElemAt: ["$userReview.rating", 0] }
        }
      },
      { $project: { userReview: 0 } }
    ]);

    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des livres" });
  }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id, userId: req.user.id });
        if (!book) return res.status(404).json({ message: "Livre introuvable" });
        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du livre" });
    }
};

exports.createBook = async (req, res) => {
    const { title, author, status, googleBookId, thumbnail, rating } = req.body;

    try {
        const book = await Book.create({
            title,
            authors: [author],
            status,
            googleBookId,
            thumbnail,
            rating,
            userId: req.user.id,
        });
        res.status(201).json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création du livre" });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findOneAndUpdate(
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
    try {
        const book = await Book.findByIdAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!book) return res.status(404).json({ message: "Livre introuvable" });

        // ⬇️ Supprime la review associée à ce livre pour cet utilisateur
        await Review.deleteOne({
          userId: req.user.id,
          googleBookId: book.googleBookId,
        });

        res.json({ message: "Livre supprimé" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la suppression du livre" });
    }
};

exports.getStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const books = await Book.find({ userId });

        const total = books.length;
        const lus = books.filter((b) => b.status === "lu").length;
        const enCours = books.filter((b) => b.status === "en cours").length;
        const aLire = books.filter((b) => b.status === "à lire").length;

        const notes = books.filter((b) => typeof b.rating === "number");
        const moyenneNote = notes.reduce((sum, b) => sum + b.rating, 0) / (notes.length || 1);

        const auteursMap = {};
        for (const book of books) {
            if (!book.author) continue;
            const author = book.author;
            auteursMap[author] = (auteursMap[author] || 0) + 1;
        }

        const topAuteurs = Object.entries(auteursMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(entry => entry[0]);

        res.json({
            total,
            lus,
            enCours,
            aLire,
            moyenneNote: Number(moyenneNote.toFixed(2)),
            topAuteurs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
    }
};

exports.getTrendingBooks = async (req, res) => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
      const trending = await Review.aggregate([
        {
          $match: {
            rating: { $gt: 0 },
            updatedAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: "$googleBookId",
            averageRating: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
        {
          $match: { _id: { $ne: null } },
        },
        {
          $sort: { averageRating: -1, count: -1 },
        },
        {
          $limit: 20,
        },
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "googleBookId",
            as: "bookData",
          },
        },
        {
          $unwind: "$bookData",
        },
        {
          $project: {
            googleBookId: "$_id",
            title: "$bookData.title",
            author: "$bookData.authors",
            thumbnail: {
              $ifNull: ["$bookData.thumbnail", null]
            },
            averageRating: 1,
            count: 1,
          },
        },
        {
          $group: {
            _id: "$googleBookId",
            doc: { $first: "$$ROOT" }, // ✅ prend un seul doc par livre
          },
        },
        {
          $replaceRoot: { newRoot: "$doc" },
        },
        {
          $limit: 10,
        },
      ]);
  
      res.json(trending);
    } catch (error) {
      console.error("Erreur trending:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des livres tendance" });
    }
  };
  
  
  
exports.getBookById = async (req, res) => {
    const { googleBookId } = req.params;  // Récupère l'ID de l'URL
    console.log("ID Google Books reçu dans le backend:", googleBookId);  // Vérifie si l'ID est correct
    console.log("BookOL après fetch:", {
        title: data.title,
        description: data.description,
        authors: data.authors || ["Auteur inconnu"],
        publisher: data.publisher,
        publishDate: data.publishedDate,
        cover: data.imageLinks?.thumbnail,
        categories: data.categories || [],
      });
      
  
    if (!googleBookId) {
      return res.status(400).json({
        success: false,
        message: "ID Google Books manquant.",
      });
    }
  
    try {
      const book = await Book.findOne({ googleBookId });
      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Livre non trouvé.",
        });
      }
      return res.json(book);  // Renvoyer les données du livre
    } catch (error) {
      console.error("Erreur lors de la récupération du livre :", error.message);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur lors de la récupération du livre.",
      });
    }
  };
  

  const axios = require("axios");

  exports.getGoogleBookById = async (req, res) => {
    const { googleBookId } = req.params;
  
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${googleBookId}`);
      const volume = response.data.volumeInfo;
  
      res.json({
        googleId: googleBookId,
        title: volume?.title ?? 'Titre inconnu',
        authors: volume?.authors ?? [],
        description: volume?.description ?? '',
        publishedDate: volume?.publishedDate ?? null,
        publisher: volume?.publisher ?? null,
        image: volume?.imageLinks?.thumbnail ?? null,
        isbn: volume?.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier ?? null,
      });
    } catch (error) {
      console.error(`Erreur GoogleBooks API : ${error.message}`);
      res.status(404).json({ error: 'Livre Google introuvable' });
    }
  };
  
