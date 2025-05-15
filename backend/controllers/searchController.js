const axios = require('axios');

// exports.searchBooks = async (req, res) => {
//     const query = req.query.q;
//     if (!query) return res.status(400).json({ message: 'Query manquante' });

//     try {
//         const { data } = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
//         const results = data.docs.slice(0, 10).map(book => ({
//             title: book.title,
//             author: book.author_name?.join(', '),
//             year: book.first_publish_year,
//             coverId: book.cover_i,
//             openLibraryId: book.key,
//         }));

//         res.json(results);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Erreur lors de la recherche de livres' });
//     }
// };

// Recherche via Google Books API
exports.searchBooksFromGoogle = async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Query manquante' });

    try {
        const { data } = await axios.get(`https://www.googleapis.com/books/v1/volumes`, {
            params: {
                q: query,
                maxResults: 10,
                key: "AIzaSyBckVEc1psixcNT4wywefuWaitN3WuxXDA"
            }
        });

        const results = (data.items || []).map(item => {
            const info = item.volumeInfo;
            return {
                title: info.title || '',
                author: (info.authors || []).join(', '),
                year: info.publishedDate || '',
                thumbnail: info.imageLinks?.thumbnail || null,
                googleId: item.id
            };
        });

        res.json(results);
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ message: 'Erreur lors de la recherche Google Books' });
    }
};
