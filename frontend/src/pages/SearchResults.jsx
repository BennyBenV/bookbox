import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getBooks, getStats, getTrending } from "../services/bookService";
import SearchBar from "../components/SearchBar";
import { getDiscoverBooks } from "../services/searchServices";
import "../styles/pages/home.css";

export default function Home() {
    const { isAuthenticated } = useContext(AuthContext);
    const [books, setBooks] = useState([]);
    const [stats, setStats] = useState(null);
    const [discover, setDiscover] = useState([]);
    const [trending, setTrending] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        const start = performance.now();

        const fetchCoreData = async () => {
            try {
                const [booksData, statsData, trendingData] = await Promise.all([
                    getBooks(),
                    getStats(),
                    getTrending()
                ]);
                setBooks(booksData);
                setStats(statsData);
                setTrending(trendingData);

            } catch (err) {
                console.error(err);
            }
        };
        fetchCoreData();
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchDiscover = async () => {
            const data = await getDiscoverBooks();
            setDiscover(data);
        };
        fetchDiscover();
    }, []);

    const topRated = books.filter((book) => book.rating >= 4);
    const enCours = books.filter((book) => book.status === "En cours");
    const recentlyAdded = [...books].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);

    const handleClick = (olid) => {
        if (olid) navigate(`/book/${olid}`);
    }

    const renderBook = (book) => (
        <li key={book._id} className="book-card-grid" onClick={() => handleClick(book.olid)}>
            {book.coverId && (
                <img src={book.coverUrl} alt="Cover" className="book-cover-sm" loading="lazy" width="160" height="240" />
            )}
            <div className="book-title">{book.title}</div>
            <div className="book-author">{book.author}</div>
        </li>
    )

    return (
        <div className="home">
            <h1> Bienvenue sur BookBox 📚</h1>
            <p className="intro">Commencez une nouvelle lecture ou poursuivez vos livres en cours !</p>

            <div className="search-section">
                <SearchBar />
            </div>

            {trending.length > 0 && (
                <div className="section">
                    <h2>🔥 Livres en tendances</h2>
                    <div className="book-grid">
                        {trending
                            .filter((b) => b.source === "google")
                            .map((b) => (
                                <div key={b._id} className="book-card-grid" onClick={() => navigate(`/book/${b.olid}`)}>
                                    <img src={b.coverUrl} alt="Couverture" loading="lazy" width="160" height="240" />
                                    <div className="book-title">{b.title}</div>
                                    <div className="book-author">{b.author}</div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {stats && (
                <div className="section stats">
                    <h2> Mes Statistiques </h2>
                    <p>📘 Total : {stats.total} livres</p>
                    <p>📖 À lire : {stats.aLire} | ⏳ En cours : {stats.enCours} | ✅ Lus : {stats.lus} </p>
                    <p>⭐ Note moyenne : {stats.moyenneNote}/5</p>
                </div>
            )}

            {enCours.filter((book) => book.source === "google").length > 0 && (
                <div className="section current-reading">
                    <h2>📚 Lecture actuelle</h2>
                    <ul>
                        {enCours.filter((book) => book.source === "google").map(renderBook)}
                    </ul>
                </div>
            )}

            {topRated.filter((book) => book.source === "google").length > 0 && (
                <div className="section favorites">
                    <h2>⭐ Livres mieux notés</h2>
                    <ul>
                        {topRated.filter((book) => book.source === "google").map(renderBook)}
                    </ul>
                </div>
            )}
        </div>
    )
}
