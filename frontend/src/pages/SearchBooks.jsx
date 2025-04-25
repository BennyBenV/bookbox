import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchBooks } from "../services/searchServices";
import { Link } from "react-router-dom";
export default function SearchBooks() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const books = await searchBooks(query);
            setResults(books);
        }catch(err){
            console.error("Erreur lors de la recherche :", err);
            alert("Erreur lors de la recherche !");
        }finally{
            setLoading(false);
        }
    }

    const handleAdd = (book) => {
        navigate("/add-book", { state: { book } }); // envoie les infos au formulaire
    }

    return(
        <div>
            <h2>Rechercher un livre</h2>
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Titre du livre" value={query} onChange={(e) => setQuery(e.target.value)} />
                <button type="submit">Rechercher</button>
            </form>

            {loading ? (
                <p>Recherche...</p>
            ) : (
                <ul>
                    {results.map((book, idx) => (
                        <li key={idx}>
                            <strong>{book.title}</strong> - {book.author || "Auteur inconnu"}{" "}
                            <button onClick={() => handleAdd(book)}>Ajouter</button>
                            <Link to={`/book/${book.openLibraryId.replace("/works/", "")}`}>Voir fiche</Link>                            
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
