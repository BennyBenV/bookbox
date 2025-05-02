import { useContext, useEffect, useState } from "react";
import { getMe, updateProfile, deleteAccount, uploadAvatar } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import "../styles/pages/editProfile.css"

export default function EditProfile() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState("");
    const [loading, setLoading] = useState(true);
    const { refreshUser } = useContext(AuthContext);
    const MEDIA = import.meta.env.VITE_MEDIA_URL;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try{
                const data = await getMe();
                setUser(data);
                setUsername(data.username);
                setAvatar(data.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y");
            }catch(err){
                console.log(err);
                toast.error("Erreur chargement profil");
            }finally{
                setLoading(false);
            }
        }
        fetchUser();
    }, [])

    const handleSave = async (e) => {
        e.preventDefault();
        try{
            await updateProfile({ username, password, avatar });
            await refreshUser();
            toast.success("Profil mis à jour !");
        }catch(err) {
            console.error(err);
            const msg = err.response?.data?.message || "Erreur modification profil";
            toast.error(msg);
          
            
        }
    }

    const handleDelete = async () => {
        if (confirm("Supprimer définitivement votre compte ?")){
            try{
                await deleteAccount();
                localStorage.removeItem("token");
                toast.success("Compte supprimé.");
                navigate("/");
            }catch(err){
                console.error(err);
                toast.error("Erreur suppression");
            }
        }
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if(!file) return;

        try{
            const data = await uploadAvatar(file);
            setAvatar(data.url);
            window.location.reload();
            toast.success("Photo de profil mise à jour !");
        }catch(err) {
            console.error("Erreur upload image : ", err);
            toast.error("Echec du téléchargement");
        }
    }

    if (loading) return <p>Chargement...</p>;

    return(
        <div className="edit-profile">
            <h2>Modifier mon profile</h2>
            <form onSubmit={handleSave} className="edit-form">
            <label>
                Adresse email :
                <input value={user.email} disabled />
            </label>

                <label>
                    Nom d'utilisateur : 
                    <input value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                    Nouveau mot de passe : 
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <label>
                    Photo de profil : 
                    <input type="file" accept="image/*" onChange={handleFileUpload} />
                </label>
                {avatar && (
                    <div className="preview">
                        <p>Preview : </p>
                        <img src={avatar.startsWith("/uploads") ? `${MEDIA}${avatar}` : avatar} alt="avatar" />
                    </div>
                )}

                
                <button type="submit">Enregistrer</button>
                <button type="button" className="danger" onClick={handleDelete}>Supprimer mon compte</button>
            </form>
        </div>
    )

}