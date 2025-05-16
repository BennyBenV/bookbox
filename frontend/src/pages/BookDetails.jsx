// BookDetails.jsx — synchro review & BookFormCard après suppression
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import BookFormCard from "../components/BookFormCard";
import { AuthContext } from "../context/AuthContext";
import { getBooks, getGoogleBookById } from "../services/bookService";
import { getPublicReviews, getAverageRating, createOrUpdateReview, getUserReview, deleteReview } from "../services/reviewService";
import { toast } from "react-toastify";
import "../styles/pages/bookDetails.css";
import { Link } from "react-router-dom";

const MEDIA = import.meta.env.VITE_MEDIA_URL;

const normalize = (str) =>
  str?.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");

export default function BookDetails() {
  const { id } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);

  const [bookData, setBookData] = useState(null);
  const [userBook, setUserBook] = useState(null);
  const [publicReviews, setPublicReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [error, setError] = useState(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [userReview, setUserReview] = useState(null);

  const [showCoverModal, setShowCoverModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBookDetails = async () => {
      try {
        const data = await getGoogleBookById(id);
        if (data.error) {
          setError(data.error.message || "Erreur API Google");
        } else {
          setBookData(data);
        }
      } catch (err) {
        setError("Impossible de charger les données du livre.");
        console.error(err);
      }
    };

    fetchBookDetails();
    fetchReviews();
    fetchUserReview();
    getAverageRating(id).then(setAvgRating);
  }, [id]);

  const fetchUserReview = async () => {
    if (!user) return;
    const review = await getUserReview(id);
    setUserReview(review);
  };

  const fetchReviews = async () => {
    const res = await getPublicReviews(id);
    setPublicReviews(res.reviews || []);
  };

  useEffect(() => {
    if (!bookData?.title || !isAuthenticated) return;

    getBooks().then((books) => {
      const match = books.find((b) => normalize(b.title) === normalize(bookData.title));
      setUserBook(match || null);
    });
  }, [bookData]);

  const openReviewModal = () => {
    setReviewText(userReview?.review || "");
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async () => {
    try {
      await createOrUpdateReview({ googleBookId: id, review: reviewText });
      toast.success("Avis enregistré ✅");
      setShowReviewModal(false);
      await fetchReviews();
      await fetchUserReview();
      getAverageRating(id).then(setAvgRating);
    } catch (err) {
      toast.error("Erreur lors de la soumission de l'avis ❌");
    }
  };

  const handleDeleteReview = async () => {
    const confirmDelete = window.confirm("Supprimer votre avis ?");
    if (!confirmDelete) return;

    try {
      await deleteReview(id);
      toast.success("Avis supprimé ✅");
      setUserReview(null);
      setReviewText("");
      setUserBook((prev) => ({ ...prev, rating: 0 })); // 🆕 reset rating dans BookFormCard
      setShowReviewModal(false);
      await fetchReviews();
      getAverageRating(id).then(setAvgRating);
    } catch (err) {
      toast.error("Erreur lors de la suppression ❌");
    }
  };

  if (!id) return <p>ID de livre manquant.</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!bookData) return <p>Chargement...</p>;

  const title = bookData.title || "Titre inconnu";
  const authorsNames = bookData.authors || [];
  const coverUrl = bookData.image?.replace("http:", "https:");
  const publisher = bookData.publisher;
  const publishDate = bookData.publishedDate;
  const description = bookData.description?.replace(/<[^>]+>/g, "") || "Pas de description disponible.";
  const categories = [];

  return (
    <div className="book-details">
      {coverUrl && (
        <img
          src={coverUrl}
          alt="Couverture"
          className="book-cover-large"
          loading="eager"
          style={{ cursor: "zoom-in" }}
        />
      )}

      <div className="book-main">
        <h1>{title} {publishDate && <>({publishDate})</>}</h1>
        <p className="authors"><strong>Auteur(s):</strong> {authorsNames.join(", ")}</p>
        {publisher && <p><strong>Éditeur :</strong> {publisher}</p>}
        {categories.length > 0 && <p><strong>Genres :</strong> {categories.join(", ")}</p>}
        <p className="desc">{description}</p>
        {avgRating?.average && (
          <p className="avg-rating">
            ⭐ Moyenne : {avgRating.average} / 5 ({avgRating.count} vote{avgRating.count > 1 ? "s" : ""})
          </p>
        )}
      </div>

      {isAuthenticated && (
        <div className="user-zone">
          <BookFormCard
            initialData={userBook}
            title={title}
            author={authorsNames.join(", ")}
            thumbnail={coverUrl}
            googleBookId={id}
            onSuccess={async () => {
              const updated = await getBooks();
              const match = updated.find((b) => normalize(b.title) === normalize(title));
              setUserBook(match || null);
              await fetchReviews();
              getAverageRating(id).then(setAvgRating);
              await fetchUserReview();
            }}
          />
        </div>
      )}

      <div className="book-reviews-wrapper">
        {isAuthenticated && (
          <div className="review-button">
            <button className="review-btn" onClick={openReviewModal}>
              {userReview ? "✏️ Modifier mon avis" : "✍️ Ajouter un avis"}
            </button>
          </div>
        )}

        {showReviewModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h4>{userReview ? "Modifier mon avis" : "Exprime-toi !"}</h4>
              <textarea
                rows={8}
                placeholder="Qu'as-tu pensé de ce livre ?"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowReviewModal(false)}>Annuler</button>
                <button className="btn-primary" onClick={handleReviewSubmit}>
                  {userReview ? "Mettre à jour" : "Publier"}
                </button>
                {userReview && (
                  <button className="btn-danger" onClick={handleDeleteReview}>Supprimer mon avis</button>
                )}
              </div>
            </div>
          </div>
        )}

        {publicReviews.length > 0 && (
          <div className="public-reviews">
            <h3> Avis des lecteurs </h3>
            {publicReviews.map((r, i) => (
              <div key={i} className="review-item">
                <div className="review-header">
                  <Link to={`/user/${r.user}`} className="review-user-link">
                    {r.avatar && (
                      <img
                        src={r.avatar ? `${MEDIA}${r.avatar}` : "/default.jpg"}
                        alt="avatar"
                        className="review-avatar"
                      />
                    )}
                    <strong>{r.user}</strong>
                  </Link>
                  {r.rating > 0 && <> - {r.rating}/5</>}
                </div>

                <p>{r.review}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
