const express = require('express');
const router = express.Router();
const {searchBooks, searchBooksFromGoogle} = require('../controllers/searchController');

// router.get('/', searchBooks); // Route pour la recherche de livres
router.get('/google', searchBooksFromGoogle);


module.exports = router; // Exportation du routeur