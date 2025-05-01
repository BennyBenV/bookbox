import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios, { all } from "axios";
import { AuthContext } from "../context/AuthContext";
import { getBooks, createBook, getEditionInfo} from "../services/bookService";
import { getAverageRating, getPublicReviews } from "../services/reviewService";
import BookFormCard from "../components/BookFormCard";
import "../styles/pages/BookDetails.css";
const MEDIA = import.meta.env.VITE_MEDIA_URL;

export default function BookDetails() {
  const { olid } = useParams(); //ID Open Library
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const [bookOL, setBookOL] = useState(null);
  const [ authorsNames, setAuthorsNames] = useState([]);
  const [ loading, setLoading] = useState(true);
  const [ userBook, setUserBook] = useState(null);
  const [avgRating, setAvgRating] = useState(null);
  const [publicReviews, setPublicReviews] = useState([]);
  const [genres, setGenres] = useState([]);

  // Normalisation pour comparer les titres
  const normalize = (str) => {
    return str?.toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");
  }
  

  // Chargement au montage de la page
  useEffect(() => {
    const fetchData = async () => {
      try{
        const res = await axios.get(`https://openlibrary.org/works/${olid}.json`);
        setBookOL(res.data);

        const authors = await Promise.all((res.data.authors || []).map(async (a) => {
        const id = a.author.key.replace("/authors/", "");
        const aRes = await axios.get(`https://openlibrary.org/authors/${id}.json`);
        return aRes.data.name;
      })
    );
    
      setAuthorsNames(authors);
      const subjects = res.data.subjects || [];
      setGenres(subjects.slice(0,3));
        if (olid) {
          const res = await getAverageRating(olid);
          setAvgRating(res);
        }
         //Si connecté, on vérifier si ce livre est dans la bibliothèque de l'utilisateur
        if (isAuthenticated){
          const allBooks = await getBooks();
          const found = allBooks.find((b) => normalize(b.title) === normalize(res.data.title));
          setUserBook(found || null);
        }
        const reviews = await getPublicReviews(olid);
        setPublicReviews(reviews);
        const edition = await getEditionInfo(olid);
        setBookOL({
          ...res.data,
          publishDate: edition.publishDate,
          publisher: edition.publisher,
        });
      }catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [olid, isAuthenticated]);

  if (loading) return <p>Chargement...</p>;
  if (!bookOL) return <p>Erreur lors de la récupération du livre.</p>;

  const { title, description, covers } = bookOL;
  const coverId = covers?.[0];
  const finalDescription = typeof description === "string" ? description : description?.value || "Pas de description disponible.";

  const refreshReviews = async () => {
    try{
      const reviews = await getPublicReviews(olid);
      setPublicReviews(reviews);
    }catch(error){
      console.error("Erreur lors du rechargement des reviews", error);
    }
  }

  const refreshAverageRating = async () => {
    if(olid){
      try{
        const res = await getAverageRating(olid);
        setAvgRating(res);
      }catch(err){
        console.error("Erreur lors du rechargement de la moyenne : ", err)
      }
    }
  }

  return(
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
            {genres.map((g,i) => (
              <span key={i} className="genre">{g}</span>
            ))}
          </p>
        )}

        <p className="desc">{finalDescription}</p>
        {avgRating?.average && (
          <p className="avg-rating">⭐ Moyenne : {avgRating.average} / 5 ({avgRating.count} vote{avgRating.count > 1 ? "s" : ""})</p>
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
                    <img src={`${MEDIA}${r.avatar}`} alt="avatar" className="review-avatar" />
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

  )

  
}