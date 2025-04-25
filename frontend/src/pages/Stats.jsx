import { useEffect, useState } from "react";
import { getStats} from "../services/bookService";

export default function Stats(){
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try{
                const data = await getStats();
                setStats(data);
            }catch(err){
                alert("Erreur lors de la récupération des statistiques.");
            }finally{
                setLoading(false);
            }
        }
        fetchStats();
    }, [])

    if (loading) return <p>Chargement des statistiques...</p>;
    if (!stats) return <p>Aucune statistique disponible.</p>;

    return(
        <div>
            <h2> Mes statistiques </h2>
            <p><strong>Total de livres : </strong>{stats.total}</p>
            <p><strong>Livres à lire : </strong>{stats.aLire}</p>
            <p><strong>Livres en cours : </strong>{stats.enCours}</p>
            <p><strong>Livres lus : </strong>{stats.lus}</p>
            <p><strong>Note moyenne : </strong>{stats.moyenneNote}</p>
            <p><strong>Top auteurs : </strong>{stats.topAuteurs.join(", ")}</p>
        </div>
    )


}