// src/pages/Home.jsx
import { useContext, useEffect, useState } from "react";
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

    const fetchCoreData = async () => {
      try {
        const [booksData, statsData, trendingData] = await Promise.all([
          getBooks(),
          getStats(),
          getTrending(),
        ]);
        setBooks(booksData);
        setStats(statsData);
        setTrending(trendingData);
      } catch (err) {
        console.error("Erreur fetchCoreData:", err);
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
  const recentlyAdded = [...books]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const handleClick = (id) => {
    if (id) navigate(`/book/${id}`);
  };

// 🔁 dans renderBook, gère aussi bien book.googleBookId que book.id
const renderBook = (book) => (
  <div
    key={book._id || book.googleBookId || book.id}
    className="book-card-grid"
    onClick={() => handleClick(book.googleBookId || book.id)}
  >
    {book.thumbnail || book.cover ? (
      <img
        src={(book.thumbnail || book.cover).replace("http:", "https:")}
        alt="Couverture"
        loading="lazy"
        width="160"
        height="240"
        className="book-cover-sm"
      />
    ) : (
      <div className="no-cover">Pas de couverture</div>
    )}
    <div className="book-title">{book.title}</div>
    <div className="book-author">
      {Array.isArray(book.authors) ? book.authors[0] : book.author || "Auteur inconnu"}
    </div>
  </div>
);

  return (
    <div className="home">
      <h1> Bienvenue sur BookBox 📚</h1>
      <p className="intro">
        Commencez une nouvelle lecture ou poursuivez vos livres en cours !
      </p>

      <div className="search-section">
        <SearchBar />
      </div>

      {trending.length > 0 && (
        <div className="section">
          <h2>🔥 Livres en tendances</h2>
          <div className="book-grid">{trending.map(renderBook)}</div>
        </div>
      )}

      {stats && (
        <div className="section stats">
          <h2> Mes Statistiques </h2>
          <p>📘 Total : {stats.total} livres</p>
          <p>📖 À lire : {stats.aLire} | ⏳ En cours : {stats.enCours} | ✅ Lus : {stats.lus} </p>
        </div>
      )}

      {enCours.length > 0 && (
        <div className="section current-reading">
          <h2>📚 Lecture actuelle</h2>
          <ul>{enCours.map(renderBook)}</ul>
        </div>
      )}

      {topRated.length > 0 && (
        <div className="section favorites">
          <h2>❤️ Mes livres préférés </h2>
          <ul>{topRated.map(renderBook)}</ul>
        </div>
      )}

      {discover.length > 0 && (
        <div className="section discover">
          <h2>🎯 Découvrir</h2>
          <div className="book-grid">{discover.map(renderBook)}</div>
        </div>
      )}

    </div>
  );
}
