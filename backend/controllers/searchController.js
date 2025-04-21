const axios = require('axios');

exports.searchBooks = async (req, res) => {
    const query = req.query.q; // Extrait la chaîne 'q' dans /api/search?q=...

    if (!query) {
        return res.status(400).json({ message: 'Query manquante' });
    }

    try{
        const {data} = await axios.get(`https://www.openlibrary.org/search.json?q=${encodeURIComponent(query)}`); // Requête à l'API Open Library

        //On garde les 10 premiers résultats, formatés
        const results = data.docs.slice(0,10).map(book => ({
            title: book.title,
            author: book.author_name?.join(', '), // Auteur(s) (peut être un tableau)
            year: book.first_publish_year,
            coverId: book.cover_i,
            openLibraryId: book.key, // ID Open Library
        }));

        res.json(results); // Envoie les résultats au frontend
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la recherche de livres' });
    }

}