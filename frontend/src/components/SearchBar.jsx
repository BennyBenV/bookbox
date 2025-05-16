// SearchBar.jsx - version corrigée sans <li> imbriqués
import { useEffect, useState } from "react";
import { searchBooks } from "../services/searchServices";
import { useNavigate } from "react-router-dom";
import BookSearchCard from "./BookSearchCard";
import "../styles/components/searchbar.css";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (query.length < 3) return setResults([]);

        const timeout = setTimeout(async () => {
            try {
                const docs = await searchBooks(query);
                setResults(docs.slice(0, 5));
            } catch (err) {
                console.error("Erreur lors de la recherche :", err);
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [query]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/results?q=${encodeURIComponent(query)}`);
        }
    };

    const handleClickResult = (id) => {
        navigate(`/book/${id}`);
        setQuery("");
        setResults([]);
    };

    return (
        <div className="searchbar-wrapper">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Rechercher un livre"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="searchbar-input"
                />
            </form>

            {results.length > 0 && (
                <div className="search-suggestions">
                    {results.map((book, index) => (
                        <div
                            key={book.googleBookId || book.id || index}
                            className="search-result-item"
                            onClick={() => handleClickResult(book.id)}
                        >
                            <BookSearchCard book={book} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
