// pages/ProfilePage.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getUserProfile,
  getUserBooks,
  getUserStats,
  getUserReviews
} from "../services/publicUserService";
import "../styles/pages/publicUser.css";

const MEDIA = import.meta.env.VITE_MEDIA_URL;

export default function PublicUser() {
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    const fetchAll = async () => {
      try {
        const [userData, booksData, statsData, reviewsData] = await Promise.all([
          getUserProfile(username),
          getUserBooks(username),
          getUserStats(username),
          getUserReviews(username),
        ]);

        setUser(userData);
        setBooks(booksData);
        setStats(statsData);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Erreur profil:", err);
        setError("Impossible de charger ce profil.");
      }
    };

    fetchAll();
  }, [username]);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Chargement du profil...</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={user.avatar ? `${MEDIA}${user.avatar}` : "/default.jpg"}
          alt="avatar"
          className="profile-avatar"
        />
        <div>
          <h2>{user.username}</h2>
          {user.bio && <p className="profile-bio">{user.bio}</p>}
        </div>
      </div>

      {stats && (
        <div className="profile-stats">
          <h3>Statistiques de lecture</h3>
          <ul>
            <li>Total : {stats.total}</li>
            <li>📘 À lire : {stats.aLire}</li>
            <li>📖 En cours : {stats.enCours}</li>
            <li>✅ Lus : {stats.lus}</li>
          </ul>
        </div>
      )}

      <div className="profile-section">
        <h3>Derniers livres ajoutés</h3>
        <div className="book-grid">
          {books.slice(0, 6).map((b) => (
            <div className="book-tile" key={b._id}>
              <img
                src={b.thumbnail?.replace("http:", "https:") || "/default.jpg"}
                alt={b.title}
              />
              <p>{b.title}</p>
              <p className="book-author">{b.authors?.[0] || "Auteur inconnu"}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-section">
        <h3>Derniers avis</h3>
        {reviews.length === 0 ? (
          <p>Aucun avis pour l'instant.</p>
        ) : (
          reviews.slice(0, 5).map((r, i) => (
            <div className="review-block" key={i}>
              <div className="review-book">
                <img
                  src={r.book?.thumbnail?.replace("http:", "https:") || "/default.jpg"}
                  alt={r.book?.title || "Livre"}
                  className="review-book-cover"
                />
                <div>
                  <p className="review-book-title">{r.book?.title}</p>
                  <p className="review-book-author">{r.book?.author}</p>
                </div>
              </div>
              <p className="rating">{r.rating > 0 && `⭐ ${r.rating}/5`}</p>
              <p>{r.review}</p>
              <Link to={`/book/${r.googleBookId}`} className="review-link">
                Voir le livre associé →
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
