import { useEffect, useState } from "react";
import { getBookById, updateBook } from "../services/bookService";

export default function EditBookModal({ bookId, onClose, onUpdated }) {
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect (() => {
        const fetchBook = async () => {
            try{
                const data = await getBookById(bookId);
                setBook(data);
            }catch(err){
                console.error(err);
                alert("Erreur lors de la récupération du livre.");
            }finally{
                setLoading(false);
            }
        };
        fetchBook();
    }, [bookId])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await updateBook(bookId, book);
            alert("Modification enregistrée !");
            onUpdated(); // Callback pour rafraîchir l'affichage parent
            onClose(); // Ferme la modale
        }catch(err){
            console.error(err);
            alert("Erreur lors de la mise à jour du livre.");
        }
    }

    if (loading) return <div className="modal">Chargement...</div>;
    if (!book) return <div className="modal">Livre introuvable.</div>;

    return(
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <h3>Modifier le livre</h3>

                <input type="text" name="title" value={book.title} onChange={handleChange} required />
                <input type="text" name="author" value={book.author} onChange={handleChange} />
                <select name="status" value={book.status} onChange={handleChange}>
                    <option value="à lire">À lire</option>
                    <option value="en cours">En cours</option>
                    <option value="lu">Lu</option>
                </select>
                <input type="number" name="rating" min={0} max={5} value={book.rating} onChange={handleChange} />
                <textarea name="review" value={book.review} onChange={handleChange}/>

                <button type="submit"> Enregistrer </button>
                <button type="button" onClick={onClose}>Annuler</button>

            </form>
        </div>
    )

    
}