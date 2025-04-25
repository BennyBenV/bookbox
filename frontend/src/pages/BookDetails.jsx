import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BookDetails() {
  const { olid } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [authorNames, setAuthorNames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`https://openlibrary.org/works/${olid}.json`);
        setBook(res.data);

        // 🔄 Récupère les noms des auteurs
        const authorRefs = res.data.authors || [];
        const authorPromises = authorRefs.map(async (a) => {
          const id = a.author.key.replace("/authors/", "");
          const authorRes = await axios.get(`https://openlibrary.org/authors/${id}.json`);
          return authorRes.data.name;
        });

        const names = await Promise.all(authorPromises);
        setAuthorNames(names);
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la récupération du livre.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [olid]);

  if (loading) return <p>Chargement...</p>;
  if (!book) return <p>Livre introuvable.</p>;

  const title = book.title;
  const description = typeof book.description === "string"
    ? book.description
    : book.description?.value || "Aucune description disponible";
  const coverId = book.covers?.[0];

  const handleAdd = () => {
    navigate("/add-book", {
      state: {
        title,
        author: authorNames.join(", "),
        coverId,
      },
    });
  };

  return (
    <div>
      <h2>{title}</h2>

      {coverId && (
        <img
          src={`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`}
          alt="Couverture"
          style={{ width: "200px" }}
        />
      )}

      <p><strong>Auteur(s) :</strong> {authorNames.join(", ") || "Non renseigné"}</p>
      <p><strong>Description :</strong> {description}</p>

      <button onClick={handleAdd}>Ajouter à ma bibliothèque</button>
    </div>
  );
}
