import { useNavigate } from "react-router-dom";

export default function BookSearchCard({ book }) {
    const navigate = useNavigate();
    const olid = book.key.split("/works/")[1]; // Récupérer l'ID de l'ouvrage
    const coverUrl = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg` : null; // URL de la couverture

    const handleClick = () => {
        navigate(`/book/${olid}`); // Naviguer vers la page du livre
    }

    return(
        <li onClick={handleClick} style={{ cursor: "pointer", padding: "0.75rem", borderBottom: "1px solid #eee", display: "flex", alignItems: "center"}}>
            {coverUrl ? (
                <img src={coverUrl} alt="Couverture" style={{ width: "40px", height: "60px", marginRight: "1rem", objectFit: "cover"}} />
            ) : (
                <div style={{ width: "40px", height: "60px", marginRight: "1rem", backgroundColor: "#ddd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "#888"}}>
                    No Cover
                </div>
            )}

            <div>
                <div style={{ fontWeight: "bold"}}>{book.title}</div>
                <div style={{ fontSize: "0.9rem", color: "#555"}}>
                    {book.author_name?.[0] || "Auteur inconnu"}
                </div>
            </div>
        </li>
    )
}
