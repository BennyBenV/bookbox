import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/components/header.css";

export default function Header() {
    const MEDIA = import.meta.env.VITE_MEDIA_URL;
    const { isAuthenticated, logout, user } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)){
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                        <div className="user-menu" ref={dropdownRef}>
                            <button className="user-icon" onClick={() => setDropdownOpen(!dropdownOpen)} aria-label="account">
                                <img src={`${MEDIA}${user.avatar}`} alt="avatar" className="avatar" />
                            </button>

                            <div className={`user-dropdown ${dropdownOpen ? "open" : ""}`}>
                                <div className="user-dropdown-header">
                                    <img src={`${MEDIA}${user.avatar}`} alt="avatar" className="avatar" />
                                    <p className="dropdown-username">{user?.username}</p>
                                </div>
                                <Link to="/user">Modifier le profil</Link>
                                <button onClick={handleLogout}>Déconnexion</button> 

                            </div>
                        
                        </div>
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