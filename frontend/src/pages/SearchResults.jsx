// SearchResults.jsx - affiche tous les résultats de la recherche
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchBooks } from "../services/searchServices";
import BookSearchCard from "../components/BookSearchCard";
import "../styles/pages/searchResults.css";

export default function SearchResults() {
    const location = useLocation();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const query = new URLSearchParams(location.search).get("q") || "";

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const data = await searchBooks(query);
                setResults(data);
            } catch (err) {
                console.error("Erreur recherche:", err);
            } finally {
                setLoading(false);
            }
        };

        if (query.length > 2) fetchResults();
        else setResults([]);
    }, [query]);

    return (
        <div className="search-results-page">
            <h2>Résultats pour "{query}"</h2>

            {loading ? (
                <p>Chargement...</p>
            ) : results.length === 0 ? (
                <p>Aucun résultat trouvé.</p>
            ) : (
                <div className="search-results-list">
                    {results.map((book, i) => (
                        <BookSearchCard key={book.googleBookId || book.id || i} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
}
