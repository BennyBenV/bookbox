import { useNavigate } from "react-router-dom";

export default function BookSearchCard({ book }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/book/${book.id}`); // ID Google Books
    };

    const coverUrl = book.cover ?? null;

    return (
        <li
            onClick={handleClick}
            style={{
                cursor: "pointer",
                padding: "0.75rem",
                borderBottom: "1px solid #eee",
                display: "flex",
                alignItems: "center",
            }}
        >
            {coverUrl ? (
                <img
                    src={coverUrl}
                    alt="Cover"
                    style={{
                        width: "40px",
                        height: "60px",
                        marginRight: "1rem",
                        objectFit: "cover",
                    }}
                />
            ) : (
                <div
                    style={{
                        width: "40px",
                        height: "60px",
                        marginRight: "1rem",
                        backgroundColor: "#ddd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        color: "#888",
                    }}
                >
                    No Cover
                </div>
            )}

            <div>
                <div style={{ fontWeight: "bold" }}>{book.title}</div>
                <div style={{ fontSize: "0.9rem", color: "#555" }}>
                    {book.author || "Auteur inconnu"}
                </div>
            </div>
        </li>
    );
}
