import { useEffect, useState } from "react";
import { getStats} from "../services/bookService";
import "../styles/pages/stats.css"

export default function Stats(){
    const { isAuthenticated } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!isAuthenticated) return;
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
    }, [isAuthenticated])

    if (loading) return <p>Chargement des statistiques...</p>;
    if (!stats) return <p>Aucune statistique disponible.</p>;

    return(
        <div className="stats-page">
            <h2> Mes statistiques </h2>

            <div className="stats-grid">

                <div className="stat-card">
                    <h4>Total de livres </h4>
                    <p>{stats.total}</p>
                </div>

                <div className="stat-card">
                    <h4>Livres à lire  </h4>
                    <p>{stats.aLire}</p>
                </div>

                <div className="stat-card">
                    <h4>Livres en cours  </h4>
                    <p>{stats.enCours}</p>
                </div>

                <div className="stat-card">
                    <h4>Livres lus</h4>
                    <p>{stats.lus}</p>
                </div>

                <div className="stat-card">
                    <h4>Note moyenne</h4>
                    <p>{stats.moyenneNote}</p>
                </div>

                {/* <div className="stat-card">
                    <h4>Top auteurs</h4>
                    <p>{stats.topAuteurs.join(", ")}</p>

                </div> */}

            </div>
        </div>
    )


}