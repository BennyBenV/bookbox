const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Middleware d'authentification
const {getAllBooks, getBookById, createBook, updateBook, deleteBook, debugCreateBook, getStats, getAverageRating, getPublicReviews, getTrendingBooks, getGoogleBookById} = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/trending', getTrendingBooks); // Livres les mieux notés récemment

router.use(auth); // protège toutes les routes

router.get('/', getAllBooks); // Récupérer tous les livres de l'utilisateur
router.get('/stats', getStats); // Récupérer les statistiques des livres
router.put('/:id', updateBook); // Mettre à jour un livre
router.post('/', createBook); // Créer un livre
router.delete('/:id', deleteBook); // Supprimer un livre
router.get('/google/:googleBookId', getGoogleBookById);
router.get('/:id', getBookById); // Récupérer un livre par ID

// router.post("/debug", auth, debugCreateBook);

module.exports = router;