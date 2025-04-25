import { useState, useEffect, useContext } from 'react';
import { getBooks, deleteBook } from '../services/bookService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { isAuthenticated } = useContext(AuthContext);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await getBooks();
                setBooks(data);
            }catch (error) {
                console.error("Erreur lors de la récupération des livres :", error);
            }finally{
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchBooks();
        }

    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <p>Veuillez vous connecter pour voir le tableau de bord.</p>;
    }

    if (loading) {
        return <p>Chargement des livres...</p>;
    }

    return(
        <div>
            <h2>Ma Bibliothèque</h2>
            {books.length === 0 ? (
                <p>Aucun livre ajouté</p>
            ) : (
                <ul>
                    {books.map((book) => (
                        <li key={book._id}>
                            {book.coverId && (
                                <img src={`https://covers.openlibrary.org/b/id/${book.coverId}-S.jpg`} alt={"Couverture"} style={{ width:"60px", marginRight:"10px"}} />
                            )}
                            
                            <strong>{book.title}</strong>  - {book.author || "Auteur inconnu"} ({book.status}) 

                            <button 
                                onClick={async () => {
                                    if (confirm("Supprimer ce livre ?")) {
                                        try{
                                            await deleteBook(book._id);
                                            setBooks(books.filter((b) => b._id !== book._id));
                                        }catch(err){
                                            console.error("Erreur lors de la suppression :", err);
                                            alert("Erreur lors de la suppression du livre.");
                                        }
                                    }
                                }}
                                style={{ marginLeft: "10px", color:"red" }}
                                >
                                    Supprimer
                                </button>

                                <button
                                    onClick={() => navigate(`/books/${book._id}`)}
                                    style={{ marginLeft: "10px" }}
                                >
                                    Voir fiche
                                </button>
                        </li>

                    ))}
                </ul>
            )}
        </div>
    )
}