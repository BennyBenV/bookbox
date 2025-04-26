import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/components/Header.css";

export default function Header() {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
        
    };

    return(
        <header className="header">
            <div className="logo">
                <Link to="/">📚 Bookbox </Link>
            </div>

            <button className="burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="menu">
                ☰
            </button>

            <nav className={`nav ${menuOpen ? "open" : ""}`}>
                {isAuthenticated ? (
                    <>
                        <Link to="/">Accueil</Link>
                        <Link to="/dashboard">Ma Bibliothèque</Link>
                        {/* <Link to="/search">Rechercher un livre</Link> */}
                        <Link to="/stats">Statistiques</Link>
                        <button onClick={handleLogout}>Déconnexion</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Connexion</Link>
                        <Link to="/register">Inscription</Link>
                    </>
                )}
            </nav>
        </header>
    )
}