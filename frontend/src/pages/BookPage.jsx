import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBookById } from "../services/bookService";
import EditBookModal from "./EditBookModal";

export default function BookPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            try{
                const data = await getBookById(id);
                setBook(data);
            }catch(err){
                console.error(err);
                alert("Erreur lors de la récupération du livre.");
            }finally{
                setLoading(false);
            }
        };
        fetchBook();
    }, [id])

    if (loading) return <p>Chargement...</p>;
    if (!book) return <p>Livre introuvable.</p>;

    const { title, author, status, rating, review, coverId } = book;

    return(
        <div>
            <h2>{title}</h2>

            {coverId && (
                <img src = {`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`} alt={"Couverture"} style={{ width:"200px", marginBottom:"10px"}} />
            )}

            <p><strong>Auteur :</strong> {author || "Auteur inconnu"}</p>
            <p><strong>Statut :</strong> {status || "Statut inconnu"}</p>
            <p><strong>Note :</strong> {rating || "Pas de note"}</p>
            <p><strong>Review :</strong> {review || "Pas de review"}</p>

            {showModal && (
                <EditBookModal bookId={id} onClose={() => setShowModal(false)} onUpdated={() => window.location.reload()} />
            )}
            <button onClick={() => setShowModal(true)}>Modifier</button>

        </div>
    )
}