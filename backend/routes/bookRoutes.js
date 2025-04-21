const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Middleware d'authentification
const {getAllBooks, getBookById, createBook, updateBook, deleteBook} = require('../controllers/bookController');

router.use(auth); // protège toutes les routes

router.get('/', getAllBooks); // Récupérer tous les livres de l'utilisateur
router.get('/:id', getBookById); // Récupérer un livre par ID
router.post('/', createBook); // Créer un livre
router.put('/:id', updateBook); // Mettre à jour un livre
router.delete('/:id', deleteBook); // Supprimer un livre

module.exports = router;