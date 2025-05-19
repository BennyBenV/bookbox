import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { searchUsers } from "../services/publicUserService";
import axios from "axios";
import "../styles/components/Header.css";

export default function Header() {
    const MEDIA = import.meta.env.VITE_MEDIA_URL;
    const API = import.meta.env.VITE_API_URL;
    const { isAuthenticated, logout, user } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [userResults, setUserResults] = useState([]);
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

    useEffect(() => {
    const fetchUsers = async () => {
        if (query.length < 2) return setUserResults([]);
        try {
        const data = await searchUsers(query);
        setUserResults(data || []);
        } catch (err) {
        console.error("Erreur searchUsers:", err);
        setUserResults([]);
        }
    };

  const timeout = setTimeout(fetchUsers, 300);
  return () => clearTimeout(timeout);
}, [query]);


    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return(
        <header className="header">
            <div className="logo">
                <Link to="/">📚 Bookbox </Link>
            </div>

            <div className="user-search">
                <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                    <ul className="user-search-results">
                        {userResults.length > 0 ? (
                            userResults.map((u) => (
                                <li key={u._id} onClick={() => {
                                    navigate(`/user/${u.username}`);
                                    setQuery("");
                                    setUserResults([]);
                                }}>
                                    <img src={u.avatar ? `${MEDIA}${u.avatar}` : "/default.jpg"} alt="avatar" className="user-avatar" />
                                    <span>{u.username}</span>
                                </li>
                            ))
                        ) : (
                            <li className="no-result">Aucun utilisateur trouvé</li>
                        )}
                    </ul>
                )}
            </div>

            <button className="burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="menu">
                ☰
            </button>

            <nav className={`nav ${menuOpen ? "open" : ""}`}>
                {isAuthenticated ? (
                    <>
                        <Link to="/">Accueil</Link>
                        <Link to="/dashboard">Ma Bibliothèque</Link>
                        <Link to={`/user/${user?.username}`}>Mon profil</Link>
                        <div className="user-menu" ref={dropdownRef}>
                            <button className="user-icon" onClick={() => setDropdownOpen(!dropdownOpen)} aria-label="account">
                                <img src={user?.avatar ? `${MEDIA}${user.avatar}` : "/default.jpg"} alt="avatar" className="avatar" />
                            </button>

                            <div className={`user-dropdown ${dropdownOpen ? "open" : ""}`}>
                                <div className="user-dropdown-header">
                                    <img src={user?.avatar ? `${MEDIA}${user.avatar}` : "/default.jpg"} alt="avatar" className="avatar" />
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
