import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Header.css";

export default function Header() {
    const { isAuthenticated, logout } = useContext(AuthContext);
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

            <nav className="nav">
                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard">Ma Bibliothèque</Link>
                        <Link to="/search">Rechercher un livre</Link>
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