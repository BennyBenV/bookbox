# 📚 BookBox

**BookBox** est une application web de gestion de lectures, permettant aux utilisateurs de suivre, découvrir, donner un avis et noter leurs livres préférés. Que vous soyez un lecteur occasionnel ou un grand amateur de littérature, BookBox vous aide à organiser votre bibliothèque personnelle de façon élégante et intuitive.

Lien : https://bookbox-pi.vercel.app/
---

## 🚀 Fonctionnalités

- Authentification sécurisée des utilisateurs
- Ajout, édition et suppression de livres dans votre bibliothèque
- Suivi de l'état de lecture (à lire, en cours, terminé)
- Notation des livres et statistiques personnelles
- Recherche intelligente de livres avec auto-complétion
- Découverte de nouveaux livres grâce aux tendances et à l’exploration
- Interface responsive et design soigné

---

## 📦 Stack Technique

- **Frontend** : React, React Router, Context API
- **Backend** : Node.js, Express.js
- **Base de données** : MongoDB (Mongo Atlas)
- **Autres** : OpenLibrary API (pour enrichir les données des livres)

---

## 🛠️ Installation

```bash
# Clone le repo
git clone https://github.com/BennyBenV/bookbox.git
cd bookbox

# Installe les dépendances
npm install

# Configure l'environnement
cp .env.example .env
# Remplis les variables d'environnement nécessaires dans le fichier .env

# Lance le projet
npm run dev
