import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getBooks, getStats } from "../services/bookService";
import SearchBar from "../components/SearchBar";

export default function Home() {
    const { token } = useContext(AuthContext);
    const [books, setBooks] = useState([]);
    const [stats, setStats] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try{
                const [booksData, statsData] = await Promise.all([getBooks(), getStats()]);
                setBooks(booksData);
                setStats(statsData);
            }catch(err){
                console.error(err);
                alert("Erreur lors de la récupération des données !");
            }
        }
        fetchData();
    }, []);

    const topRated = books.filter((book) => book.rating >= 4);
    const enCours = books.filter((book) => book.status === "En cours");


    return(
        <div>
            <h1> Bienvenue sur BookBox 📚</h1>
            <p>Commencez une nouvelle lecture ou poursuivez vos livres en cours !</p>

            <div style={{ margin: "2rem 0"}}>
                <SearchBar />
            </div>

            {stats && (
                <div style={{marginBottom: "2rem"}}>
                    <h2> Mes Statistiques </h2>
                    <p>Total : {stats.total} livres</p>
                    <p>À lire : {stats.aLire} | En cours : {stats.enCours} | Lus : {stats.lus}</p>
                    <p> Note Moyenne : {stats.moyenneNote} </p>
                </div>
            )}

            {enCours.length > 0 && (
                <div> 
                    <h2> En cours de lecture </h2>
                    <ul>
                        {enCours.map((b) => (
                            <li key={b._id}>{b.title} - {b.author}</li>
                        ))}
                    </ul>
                </div>
            )}

            {topRated.length > 0 && (
                <div> 
                    <h2> Mes livres préférés </h2>
                    <ul>
                        {topRated.map((b) => (
                            <li key={b._id}>{b.title} - {b.rating}/5</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}