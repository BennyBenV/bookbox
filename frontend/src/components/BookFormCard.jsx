import { useState } from "react";
import { createBook, updateBook } from "../services/bookService";
import { useNavigate } from "react-router-dom";
import "../styles/components/BookFormCard.css"
import { createOrUpdateReview } from "../services/reviewService";
import { toast } from "react-toastify";

export default function BookFormCard({ initialData, title, author, coverId, olid, onSuccess }) {
    const [status, setStatus] = useState(initialData?.status || "à lire");
    const [rating, setRating] = useState(initialData?.rating || 0);
    const [review, setReview] = useState(initialData?.review || "");
    const isEdit = Boolean(initialData);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            if(isEdit) {
                await updateBook(initialData._id, { status });
                await createOrUpdateReview({ olid, rating, review });
                toast.success("Livre mis à jour avec succès !");
            } else{
                await createBook({title, author, coverId, status, olid});
                await createOrUpdateReview({ olid, rating, review });               
                toast.success("Livre ajouté avec succès !");
            }

            onSuccess?.(); //callback pour BookDetails
        }catch (error) {
            console.error("Erreur lors de la sauvegarde :", error);
            toast.error("Erreur !");
        }
        
    }

    return(
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
                <input type="number" min={0} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
            </label>
            <label>
                Review : 
                <textarea value={review} onChange={(e) => setReview(e.target.value)} />
            </label>

            <button type="submit">{isEdit ? "Enregistrer les modifications" : "Ajouter"}</button>
        </form>
    )
}