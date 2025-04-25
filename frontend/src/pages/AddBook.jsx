import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createBook } from "../services/bookService";

export default function AddBook() {
    const { state } = useLocation(); // infos passées depuis search
    const navigate = useNavigate();

    const [title, setTitle] = useState(state?.title || ""); 
    const [author, setAuthor] = useState(state?.author || "");
    const [status, setStatus] = useState("à lire");
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const coverId = state?.coverId; // id de la couverture

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await createBook({ title, author, coverId, status, rating, review });
            alert("Livre ajouté avec succès !");
            navigate("/dashboard"); // redirection vers le dashboard après l'ajout
        }catch(err){
            console.error(err);
            alert("Erreur lors de l'ajout du livre.");
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <h2>Ajouter un livre</h2>

            <input type="text" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input type="text" placeholder="Auteur" value={author} onChange={(e) => setAuthor(e.target.value)} />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="à lire">À lire</option>
                <option value="en cours">En cours</option>
                <option value="lu">Lu</option>
            </select>
            <input type="number" placeholder="Note (0 à 5)" min={0} max={5} value={rating} onChange={(e) => setRating(e.target.value)} />
            <textarea placeholder="Commentaire" value={review} onChange={(e) => setReview(e.target.value)}></textarea>

            <button type="submit">Ajouter à ma Bibliothèque</button>
        </form>
    )
}