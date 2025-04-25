import { useEffect, useState } from "react";
import { searchBooks } from "../services/searchServices";
import { useNavigate } from "react-router-dom";
import BookSearchCard from "./BookSearchCard";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    // déclenche la recherche après 400ms de délai (débounce) et si la requête est supérieure à 3 caractères
    useEffect(() => {
        if (query.length < 3) return setResults([]); // Réinitialiser les résultats si la requête est trop courte

        const timeout = setTimeout(async () => {
            try{
                const docs = await searchBooks(query);
                setResults(docs.slice(0, 5)); // Limiter à 5 résultats
            }catch(err){
                console.error("Erreur lors de la recherche :", err);
            }
        }, 400); // Délai de 400ms avant d'effectuer la recherche
        return () => clearTimeout(timeout); // Nettoyer le timeout si la requête change avant la fin
    }, [query]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/results?q=${encodeURIComponent(query)}`); // Rediriger vers la page de résultats
        }
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Rechercher un livre" value={query} onChange={(e) => setQuery(e.target.value)} style={{ width : "100%", padding:"1rem", fontSize:"1rem"}} />
            </form>
            
            {results.length > 0 && (
                <ul style={{marginTop:"1rem"}}>
                    {results.map((book) => (
                        <BookSearchCard key={book.key} book={book} />
                    ))}
                </ul>
            )}
        </div>
    )
}