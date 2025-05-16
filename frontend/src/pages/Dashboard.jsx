// Dashboard.jsx – suppression avec modale de confirmation et review catch
import { useState, useEffect, useContext } from 'react';
import { getBooks, deleteBook } from '../services/bookService';
import { deleteReview } from '../services/reviewService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import "../styles/pages/dashboard.css";
import { toast } from 'react-toastify';

export default function Dashboard() {
    const { isAuthenticated } = useContext(AuthContext);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("recent");

    const [bookToDelete, setBookToDelete] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if(!isAuthenticated) return;
        const fetchBooks = async () => {
            try {
                const data = await getBooks();
                setBooks(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des livres :", error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchBooks();
        }

    }, [isAuthenticated]);

    const handleDelete = async () => {
        try {
            await deleteBook(bookToDelete._id);


            setBooks(books.filter((b) => b._id !== bookToDelete._id));
            toast.success("Livre supprimé ✅");
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            toast.error("Erreur lors de la suppression du livre.");
        } finally {
            setShowConfirmModal(false);
            setBookToDelete(null);
        }
    };

    const normalize = (str) =>
        str?.toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .replace(/\s+/g, "")
          .replace(/[^a-z0-9]/g, "");

    const filteredBooks = books
        .filter((b) => statusFilter === "tous" || statusFilter === "all" || b.status === statusFilter)
        .filter((b) => normalize(b.title).includes(normalize(searchTerm)) || normalize(b.author).includes(normalize(searchTerm)) );

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

    return (
    <div className="dashboard">
        <h2>Ma Bibliothèque</h2>

        <input
        type="text"
        placeholder="Rechercher un livre dans ma bibliothèque..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="library-search"
        />

        <div className="filters">
        {filters.map((f) => (
            <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={statusFilter === f.value ? "active" : ""}
            >
            {f.label}
            </button>
        ))}
        </div>

        <div className="sort-select">
        <label>Trier par :</label>
        <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
        >
            <option value="recent">Plus récent</option>
            <option value="title-asc">Titre A-Z</option>
            <option value="title-desc">Titre Z-A</option>
            <option value="rating">Note</option>
        </select>
        </div>

        {sortBooks.length === 0 ? (
        <p>Aucun livre trouvé pour ce filtre</p>
        ) : (
        <ul className="book-list">
            {sortBooks.map((book) => (
            <li
              key={book._id}
              className="book-card"
              onClick={() => navigate(`/book/${book.googleBookId}`)}
            >
                <img
                src={book.thumbnail?.replace("http:", "https:") || "/default.jpg"}
                alt="cover"
                className="book-cover"
                />
                <div className="book-info">
                    <div className="book-title">{book.title}</div>
                    <div className="book-author">{book.authors}</div>
                    <div className="book-status">{book.status}</div>
                    {book.rating > 0 && (
                        <div className="book-rating">⭐ {book.rating} / 5</div>
                    )}
                </div>
                <div className="book-actions" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => navigate(`/book/${book.googleBookId}`)}>Voir</button>
                    <button onClick={() => {
                      setBookToDelete(book);
                      setShowConfirmModal(true);
                    }}>
                      Supprimer
                    </button>
                </div>
            </li>
            ))}
        </ul>
        )}

        {showConfirmModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h4>Supprimer ce livre ?</h4>
              <p>Cette action supprimera aussi la note et la review associée.</p>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowConfirmModal(false)}>Annuler</button>
                <button className="btn-danger" onClick={handleDelete}>Confirmer la suppression</button>
              </div>
            </div>
          </div>
        )}
    </div>
    );
}
