import { useState } from "react";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/auth.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Login() {
    const { login }= useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try{
            const {token, user} = await loginUser(email, password);
            login(token, user); // Met à jour le contexte d'authentification
            navigate("/");
            toast.success("Connexion réussie !");
            // alert("Connexion réussie");
        }catch(err){
            console.error(err);
            const msg = err?.response?.data?.message || "Erreur lors de la connexion.";
            setError(msg);
            toast.error("Connexion échoué !");
            // alert("Erreur lors de la connexion !");
        }
    };

    return(
        <div className="auth-container">
            <form onSubmit={handleLogin}>
                <h2>Connexion</h2>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} required />
                {error && <div className="auth-error">{error}</div>}
                <button type="submit">Se connecter</button>
            </form>
        </div>

    )
}