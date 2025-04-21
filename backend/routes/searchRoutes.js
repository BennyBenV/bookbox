const express = require('express');
const router = express.Router();
const {searchBooks} = require('../controllers/searchController');

router.get('/', searchBooks); // Route pour la recherche de livres

module.exports = router; // Exportation du routeur