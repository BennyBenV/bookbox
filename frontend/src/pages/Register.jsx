import { useState } from "react";
import { registerUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import "../styles/pages/auth.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


export default function Register() {
    const { login }= useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        try{
            const {token, user} = await registerUser(email, username, password);
            login(token, user); // Met à jour le contexte d'authentification
            navigate("/");
            // alert("Inscription réussie !");
             toast.success("Inscription réussie !");
            
            setSuccess(true);
        }catch(err){
            console.error(err);
            const msg = err?.response?.data?.message || "Erreur lors de l'inscription";
            // alert("Erreur lors de l'inscription !");
            setError(msg)
        }

    };

    return(
        <div className="auth-container">
            <form onSubmit={handleRegister} className="auth-form">
                <h2>Inscription</h2>
                <input type="text" placeholder="Pseudo" onChange={(e) => setUsername(e.target.value)} required />
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} required />
                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">Inscription réussie !</div>}

                <button type="submit">Créer un compte</button>
            </form>
        </div>
    )
}