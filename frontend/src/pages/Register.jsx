import { useState } from "react";
import { registerUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function Register() {
    const { login }= useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            const token = await registerUser(email, password);
            login(token); // Met à jour le contexte d'authentification
            // localStorage.setItem("token", token);
            alert("Inscription réussie !");
        }catch(err){
            console.error(err);
            alert("Erreur lors de l'inscription !");
        }

    };

    return(
        <form onSubmit={handleRegister}>
            <h2>Inscription</h2>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Créer un compte</button>
        </form>
    )
}