import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchBooks } from "../services/searchServices";
import BookSearchCard from "../components/BookSearchCard";
import SearchBar from "../components/SearchBar";

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || ""; // Récupérer le paramètre de recherche dans l'URL
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!query) return;
        const fetch = async () => {
            const docs = await searchBooks(query);
            setResults(docs);
        }
        fetch();
    }, [query]);

    return(
        <div>
            <h2> Résultats pour : "{query}"</h2>
            <SearchBar />
            {results.length === 0 ? (
                <p> Aucun résultat trouvé </p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {results.map((book) => (
                        <BookSearchCard key={book.key} book={book} />
                    ))}                
                </ul>
            )}
        </div>
    )
}