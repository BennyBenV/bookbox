import { useState, useEffect, useContext } from 'react';
import { getBooks, deleteBook } from '../services/bookService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "../styles/pages/dashboard.css";

export default function Dashboard() {
    const { isAuthenticated } = useContext(AuthContext);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all"); // "all", "read", "unread"
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await getBooks();
                setBooks(data);
            }catch (error) {
                console.error("Erreur lors de la récupération des livres :", error);
            }finally{
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchBooks();
        }

    }, [isAuthenticated]);

    const handleDelete = async (id) => {
        if(!confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) return;
        try{
            await deleteBook(id);
            setBooks(books.filter((b) => b._id !== id));
        }catch(err){
            console.error("Erreur lors de la suppression :", err);
            alert("Erreur lors de la suppression du livre.");
        }
    }

    const normalize = (str) =>
        str?.toLowerCase() // pour mettre en minuscule
          .normalize("NFD") // pour enlever les accents
          .replace(/\p{Diacritic}/gu, "") // pour enlever les accents
          .replace(/\s+/g, "") // pour enlever les espaces
          .replace(/[^a-z0-9]/g, ""); // pour enlever ponctuation
      
    const filteredBooks = books
        .filter((b) => statusFilter === "tous" || statusFilter === "all" || b.status === statusFilter)
        .filter((b) => normalize(b.title).includes(normalize(searchTerm)) || normalize(b.author).includes(normalize(searchTerm)) )
    

    const filters = [
      { label: "Tous", value: "all" },
      { label: "À lire", value: "à lire" },
      { label: "En cours", value: "en cours" },
      { label: "Lu", value: "lu" },
    ];
    
    if (!isAuthenticated) {
        return <p>Veuillez vous connecter pour voir le tableau de bord.</p>;
    }

    if (loading) {
        return <p>Chargement des livres...</p>;
    }

    return(
        <div className="dashboard">
            <h2>Ma Bibliothèque</h2>

            <input type="text" placeholder="Rechercher un livre dans ma bibliothèque..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="library-search"/>
            
            <div className="filters">
                {filters.map((f) => (
                    <button key={f} onClick= {() => setStatusFilter(f.value)} className={statusFilter === f ? "active" : ""}>
                        {f.label}
                    </button>
                ))}
            </div>

            {filteredBooks.length === 0 ? (
                <p> Aucun livre trouvé pour ce filtre </p>
            ) : (
                <div className="book-list">
                    {filteredBooks.map((book) => (
                        <div className="book-card" key={book._id} onClick={() => navigate(`/books/${book._id}`)}>
                            {book.coverId ? (
                                <img src={`https://covers.openlibrary.org/b/id/${book.coverId}-S.jpg`} alt="Cover" className="book-cover" />
                            ) : (
                                <div className="book-cover" />
                            )}

                            <div className="book-info">
                                <div className="book-title"> {book.title}</div>
                                <div className="book-author"> {book.author || "Auteur inconnu"}</div>
                                <span className="book-status"> {book.status}</span>
                                {book.rating > 0 && (
                                    <span className="book-rating"> ⭐ {book.rating} / 5</span>
                                )}
                            </div>

                            <div className="book-actions">
                                <button onClick={() => navigate(`/books/${book._id}`)}>Voir fiche</button>
                                <button onClick={() => handleDelete(book._id)}>Supprimer</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
}