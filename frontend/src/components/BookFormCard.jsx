import { useState, useEffect } from "react";
import { createBook, updateBook } from "../services/bookService";
import { useNavigate } from "react-router-dom";
import "../styles/components/bookFormCard.css";
import { createOrUpdateReview } from "../services/reviewService";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";


export default function BookFormCard({ initialData, title, author, thumbnail, googleBookId, onSuccess }) {

    const [status, setStatus] = useState("à lire");
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [showReviewModal, setShowReviewModal] = useState(false);

    

    useEffect(() => {
        if (initialData) {
          setStatus(initialData.status ?? "à lire");
          setRating(initialData.rating ?? 0);
          setReview(initialData.review ?? "");
        }
      }, [initialData]);
      
    
    const isEdit = Boolean(initialData);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEdit) {
                await updateBook(initialData._id, { status });
                await createOrUpdateReview({ googleBookId , rating, review });
                toast.success("Livre mis à jour avec succès !");
            } else {
                await createBook({ title, author, thumbnail, status, googleBookId });
                await createOrUpdateReview({ googleBookId , rating, review });
                toast.success("Livre ajouté avec succès !");
            }

            onSuccess?.(); // callback vers BookDetails
        } catch (error) {
            console.error("Erreur lors de la sauvegarde :", error);
            toast.error("Erreur !");
        }
    };

    const handleStarClick = (e, index) => {
        const { offsetX } = e.nativeEvent;
        const starWidth = e.currentTarget.offsetWidth;
      
        const clickedLeft = offsetX < starWidth / 2;
        const newRating = clickedLeft ? index + 0.5 : index + 1;

        setRating(newRating);
        if (newRating > 0 && status !== "lu") setStatus("lu");
      };
      
      const renderStars = () => {
        const stars = [];
      
        for (let i = 0; i < 5; i++) {
          const diff = rating - i;
          let icon = regularStar;
          let filled = false;
      
          if (diff >= 1) {
            icon = solidStar;
            filled = true;
          } else if (diff >= 0.5) {
            icon = faStarHalfAlt;
            filled = true;
          }
      
          stars.push(
            <span
              key={i}
              className="star-wrapper"
              onClick={(e) => handleStarClick(e, i)}
            >
              <FontAwesomeIcon
                icon={icon}
                className={`star-icon ${filled ? "filled" : ""}`}
              />
            </span>
          );
        }
      
        return stars;
      };
            
      
    return (
        <form className="book-form-card" onSubmit={handleSubmit}>
            <h3>{isEdit ? "Modifier ce livre" : "Ajouter à ma bibliothèque"}</h3>

            <label>
                Statut :
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="à lire">À lire</option>
                    <option value="en cours">En cours</option>
                    <option value="lu">Lu</option>
                </select>
            </label>

            <label>
                Note :
                <div className="stars-wrapper">
                    {renderStars()}
                </div>

            </label>

            <button type="submit">{isEdit ? "Enregistrer les modifications" : "Ajouter"}</button>

        </form>
    );
}
