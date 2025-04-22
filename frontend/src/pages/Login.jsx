import { useState } from "react";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function Login() {
    const { login }= useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const token = await loginUser(email, password);
            login(token); // Met à jour le contexte d'authentification
            // localStorage.setItem("token", token);
            alert("Connexion réussie");
        }catch(err){
            console.error(err);
            alert("Erreur lors de la connexion !");
        }
    };

    return(
        <form onSubmit={handleLogin}>
            <h2>Connexion</h2>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Se connecter</button>
        </form>

    )
}