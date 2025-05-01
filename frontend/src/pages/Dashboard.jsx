import { useState, useEffect, useContext } from 'react';
import { getBooks, deleteBook } from '../services/bookService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "../styles/pages/dashboard.css";
import { toast } from 'react-toastify';

export default function Dashboard() {
    const { isAuthenticated } = useContext(AuthContext);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all"); // "all", "read", "unread"
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("recent");

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
            toast.error("Erreur lors de la suppression du livre.");
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
    
    const sortBooks = [...filteredBooks].sort((a,b) => {
        switch (sortOption){
            case "title-asc":
                return a.title.localeCompare(b.title);
            case "title-desc":
                return b.title.localeCompare(a.title);
            case "rating":
                return (b.rating||0) - (a.rating||0);
            case "recent":
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            default:
                return 0;

        }
    });

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
                    <button key={f.value} onClick= {() => setStatusFilter(f.value)} className={statusFilter === f.value ? "active" : ""}>
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="sort-select">
                <label>Trier par : </label>
                <select value={sortOption} onChange={(e) => {setSortOption(e.target.value);}}>
                    <option value="recent">Plus récent</option>
                    <option value="title-asc">Titre A-Z</option>
                    <option value="title-desc">Titre Z-A</option>
                    <option value="rating">Note</option>
                </select>
            </div>

            {sortBooks.length === 0 ? (
                <p> Aucun livre trouvé pour ce filtre </p>
            ) : (
                <div className="book-list">
                    {sortBooks.map((book) => (
                        <div className="book-card" key={book._id} onClick={() => navigate(`/book/${book.olid}`)}>
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
                                <button onClick={(e) => {e.stopPropagation(); navigate(`/book/${book.olid}`); console.log(book.olid);}}>
                                    Voir fiche
                                </button>
                                <button onClick={(e) => {e.stopPropagation(); handleDelete(book._id);}}> { /*⛔ bloque la redirection du parent*/}
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
}