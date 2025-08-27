# BlogSphere

## Description

BlogSphere est une plateforme de blogging simple, élégante et collaborative, permettant à chaque utilisateur de publier, commenter, liker et consulter des articles avec une expérience fluide façon Medium.

## Fonctionnalités

- **Authentification**: Inscription, connexion, déconnexion et gestion de compte (pseudo, bio, photo de profil).
- **Articles**: Création, édition et suppression d'articles avec un éditeur de texte riche (React Quill).
- **Interactions**: Commentaires, likes et compteur de vues sur les articles.
- **Navigation**: Page d'accueil avec les derniers articles, filtres par auteur, popularité et date, page de lecture d'un article et profil public des utilisateurs.
- **Tableau de bord**: Espace personnel pour gérer ses propres articles.

## Technologies utilisées

### Backend

- **Node.js**: Environnement d'exécution JavaScript côté serveur.
- **Express**: Framework web pour Node.js.
- **MongoDB**: Base de données NoSQL.
- **Mongoose**: Bibliothèque de modélisation d'objets MongoDB pour Node.js.
- **JSON Web Token (JWT)**: Pour l'authentification sécurisée.
- **Cloudinary**: Pour le stockage des images.
- **Multer**: Middleware pour la gestion des fichiers uploadés.

### Frontend

- **React.js**: Bibliothèque JavaScript pour la construction d'interfaces utilisateur.
- **Tailwind CSS**: Framework CSS "utility-first".
- **React Quill**: Éditeur de texte riche pour React.
- **React Router**: Pour la gestion de la navigation.
- **Axios**: Client HTTP pour les requêtes vers le backend.

## Installation et lancement

### Prérequis

- Node.js (version 14 ou supérieure)
- npm
- MongoDB

### Backend

1.  Clonez le dépôt :
    ```bash
    git clone https://github.com/HeFa9401/g6_blosphere.git
    cd g6_blosphere/backend
    ```
2.  Installez les dépendances :
    ```bash
    npm install
    ```
3.  Créez un fichier `.env` à la racine du dossier `backend` en vous basant sur le fichier `.env.exemple`.
4.  Lancez le serveur de développement :
    ```bash
    npm run dev
    ```
    Le serveur backend sera accessible à l'adresse `http://localhost:5000` (ou le port que vous avez configuré).

### Frontend

1.  Ouvrez un nouveau terminal et naviguez vers le dossier `frontend` :
    ```bash
    cd ../frontend
    ```
2.  Installez les dépendances :
    ```bash
    npm install
    ```
3.  Lancez le serveur de développement :
    ```bash
    npm run dev
    ```
    L'application sera accessible à l'adresse `http://localhost:3000` (ou le port indiqué par Vite).

## Structure du projet

```
.
├── backend/                # Dossier du serveur backend (Node.js)
│   ├── config/             # Fichiers de configuration (DB, Cloudinary)
│   ├── controllers/        # Logique des routes
│   ├── middleware/         # Middlewares (auth, upload)
│   ├── models/             # Modèles de données Mongoose
│   └── routes/             # Définition des routes de l'API
└── frontend/               # Dossier de l'application frontend (React)
    ├── public/             # Fichiers statiques
    └── src/
        ├── assets/         # Images et autres ressources
        ├── components/     # Composants React réutilisables
        ├── pages/          # Pages de l'application
        └── App.jsx         # Composant principal de l'application
```

## Auteurs

Ce projet a été réalisé dans le cadre du hackathon JeemaCoder.
