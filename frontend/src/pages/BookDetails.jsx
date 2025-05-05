// src/pages/BookDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { getBooks, createBook, getEditionInfo } from "../services/bookService";
import { getAverageRating, getPublicReviews } from "../services/reviewService";
import BookFormCard from "../components/BookFormCard";
import "../styles/pages/bookDetails.css";

const MEDIA = import.meta.env.VITE_MEDIA_URL;

export default function BookDetails() {
  const { olid } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const [bookOL, setBookOL] = useState(null);
  const [authorsNames, setAuthorsNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userBook, setUserBook] = useState(null);
  const [avgRating, setAvgRating] = useState(null);
  const [publicReviews, setPublicReviews] = useState([]);
  const [genres, setGenres] = useState([]);

  const normalize = (str) =>
    str?.toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");

      useEffect(() => {
        if (!isAuthenticated) return;
      
        const fetchData = async () => {
          console.time("[BookDetails] TOTAL");
      
          try {
            console.time("[BookDetails] Parallel fetches");
            const bookPromise = axios.get(`https://openlibrary.org/works/${olid}.json`);
            const editionPromise = getEditionInfo(olid);
            const authorsPromise = bookPromise.then(async (res) => {
              return await Promise.all(
                (res.data.authors || []).map(async (a) => {
                  const id = a.author.key.replace("/authors/", "");
                  const aRes = await axios.get(`https://openlibrary.org/authors/${id}.json`);
                  return aRes.data.name;
                })
              );
            });
      
            const [bookRes, editionInfo, authorsNames] = await Promise.all([
              bookPromise,
              editionPromise,
              authorsPromise,
            ]);

            // console.timeEnd("[BookDetails] Parallel fetches");
      
            setBookOL({
              ...bookRes.data,
              publishDate: editionInfo.publishDate,
              publisher: editionInfo.publisher,
            });
      
            setAuthorsNames(authorsNames);
      
            const subjects = bookRes.data.subjects || [];
            setGenres(subjects.slice(0, 3));
      
            console.time("[BookDetails] getAverageRating");
            const avg = await getAverageRating(olid);
            setAvgRating(avg);
            // console.timeEnd("[BookDetails] getAverageRating");
      
            console.time("[BookDetails] getBooks");
            const allBooks = await getBooks();
            const found = allBooks.find((b) => normalize(b.title) === normalize(bookRes.data.title));
            setUserBook(found || null);
            // console.timeEnd("[BookDetails] getBooks");
      
            console.time("[BookDetails] getPublicReviews");
            const reviews = await getPublicReviews(olid);
            setPublicReviews(reviews);
            // console.timeEnd("[BookDetails] getPublicReviews");
      
          } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
          } finally {
            // console.timeEnd("[BookDetails] TOTAL");
            setLoading(false);
          }
        };
      
        fetchData();
      }, [olid, isAuthenticated]);
      
  if (loading) return <p>Chargement...</p>;
  if (!bookOL) return <p>Erreur lors de la récupération du livre.</p>;

  const { title, description, covers } = bookOL;
  const coverId = covers?.[0];
  const finalDescription =
    typeof description === "string" ? description : description?.value || "Pas de description disponible.";

  const refreshReviews = async () => {
    try {
      const reviews = await getPublicReviews(olid);
      setPublicReviews(reviews);
    } catch (error) {
      console.error("Erreur lors du rechargement des reviews", error);
    }
  };

  const refreshAverageRating = async () => {
    if (olid) {
      try {
        const res = await getAverageRating(olid);
        setAvgRating(res);
      } catch (err) {
        console.error("Erreur lors du rechargement de la moyenne : ", err);
      }
    }
  };

  return (
    <div className="book-details">
      {coverId && (
        <img
          src={`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`}
          alt="Couverture"
          className="book-cover-large"
          loading="eager"
          width="400"
          height="600"
        />
      )}

      <div className="book-main">
        <h1>{title} ({bookOL.publishDate})</h1>
        <p className="authors"><strong>Auteur(s):</strong> {authorsNames.join(", ")}</p>
        {bookOL.publisher && <p><strong>Éditeur :</strong> {bookOL.publisher}</p>}
        {genres.length > 0 && (
          <p className="genres">
            <strong>Genres :</strong>{" "}
            {genres.map((g, i) => (
              <span key={i} className="genre">{g}</span>
            ))}
          </p>
        )}
        <p className="desc">{finalDescription}</p>
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
            coverId={coverId}
            olid={olid}
            onSuccess={async () => {
              const updated = await getBooks();
              const match = updated.find((b) => normalize(b.title) === normalize(title));
              setUserBook(match || null);
              refreshReviews();
              refreshAverageRating();
            }}
          />
        </div>
      )}

      <div className="book-reviews-wrapper">
        {publicReviews.length > 0 && (
          <div className="public-reviews">
            <h3> Avis des lecteurs </h3>
            {publicReviews.map((r, i) => (
              <div key={i} className="review-item">
                <div className="review-header">
                  {r.avatar && (
                    <img src={r.avatar ? `${MEDIA}${r.avatar}` : "/default.jpg"} alt="avatar" className="review-avatar" />
                  )}
                  <strong>{r.user}</strong>{" "}
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
