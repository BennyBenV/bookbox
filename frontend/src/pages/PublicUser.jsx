// pages/ProfilePage.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getUserProfile,
  getUserBooks,
  getUserStats,
  getUserReviews
} from "../services/publicUserService";
import {
  getFollowers,
  getFollowing,
  checkFollowStatus,
  followUser,
  unfollowUser
} from "../services/followService";
import "../styles/pages/publicUser.css";

const MEDIA = import.meta.env.VITE_MEDIA_URL;

export default function PublicUser() {
  const { username } = useParams();
  const { user } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const isOwnProfile = user?.username?.toLowerCase() === username.toLowerCase();

  const fetchAll = async () => {
    try {
      const [profile, booksData, statsData, reviewsData, followersData, followingData] = await Promise.all([
        getUserProfile(username),
        getUserBooks(username),
        getUserStats(username),
        getUserReviews(username),
        getFollowers(username),
        getFollowing(username)
      ]);

      setUserData(profile);
      setBooks(booksData);
      setStats(statsData);
      setReviews(reviewsData);
      setFollowers(followersData);
      setFollowing(followingData);

      if (!isOwnProfile) {
        const status = await checkFollowStatus(username);
        setIsFollowing(status.following);
      }
    } catch (err) {
      console.error("Erreur profil:", err);
      setError("Impossible de charger ce profil.");
    }
  };

  useEffect(() => {
    if (username) fetchAll();
  }, [username]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(username);
      } else {
        await followUser(username);
      }
      await fetchAll();
    } catch (err) {
      console.error("Erreur follow/unfollow:", err);
    }
  };

  if (error) return <p>{error}</p>;
  if (!userData) return <p>Chargement du profil...</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={userData.avatar ? `${MEDIA}${userData.avatar}` : "/default.jpg"}
          alt="avatar"
          className="profile-avatar"
        />
        <div>
          <h2>{userData.username}</h2>
          {userData.bio && <p className="profile-bio">{userData.bio}</p>}
          <p className="follower-count">
            
            <span className="clickable" onClick={() => setShowFollowersModal(true)}>
              {followers.length} abonnés
            </span>{" "}-{" "}
            <span className="clickable" onClick={() => setShowFollowingModal(true)}>
              {following.length} abonnements
            </span>
          </p>
          {!isOwnProfile && (
            <button className={`follow-btn ${isFollowing ? "unsubscribe" : ""}`} onClick={handleFollowToggle}>
              {isFollowing ? "Se désabonner" : "S'abonner"}
            </button>
          )}
        </div>
      </div>

      {showFollowersModal && (
        <div className="modal-overlay" onClick={() => setShowFollowersModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4 className="modal-title">Abonnés</h4>
            <div className="follow-list">
              {followers.map((f) => (
                <Link
                  key={f._id}
                  to={`/user/${f.username}`}
                  onClick={() => setShowFollowersModal(false)}
                  className="follow-item"
                >
                  <img
                    src={f.avatar ? `${MEDIA}${f.avatar}` : "/default.jpg"}
                    alt="avatar"
                    className="follower-avatar"
                  />
                  <span>{f.username}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {showFollowingModal && (
        <div className="modal-overlay" onClick={() => setShowFollowingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4 className="modal-title">Abonnements</h4>
            <div className="follow-list">
              {following.map((f) => (
                <Link
                  key={f._id}
                  to={`/user/${f.username}`}
                  onClick={() => setShowFollowingModal(false)}
                  className="follow-item"
                >
                  <img
                    src={f.avatar ? `${MEDIA}${f.avatar}` : "/default.jpg"}
                    alt="avatar"
                    className="follower-avatar"
                  />
                  <span>{f.username}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}


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
            <Link
              to={`/book/${b.googleBookId}`}
              className="book-tile"
              key={b._id}
            >
              <img
                src={b.thumbnail?.replace("http:", "https:") || "/default.jpg"}
                alt={b.title}
              />
              <p>{b.title}</p>
              <p className="book-author">{b.authors?.[0] || "Auteur inconnu"}</p>
            </Link>
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
