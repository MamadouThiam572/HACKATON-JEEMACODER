# Projet BlogSphere

Ce dépôt contient le code source du projet BlogSphere, une plateforme de blogging simple et robuste.

## Planning & Avancement du Hackathon (4 Jours)

Voici le plan de développement et l'état d'avancement actuel du projet.

---

### Jour 1 – Mise en place (⚙️ Environnement & DB)
- [ ] **Environnement**: Installer React, Tailwind, Backend, DB
- [ ] **Git/GitHub**: Configurer le versionning
- [ ] **Authentification**: Préparer l’authentification de base
- [ ] **US001**: Inscription / Connexion
- [ ] **US002**: Profil utilisateur (bio, photo)
- [ ] **Pages**: Pages login / register fonctionnelles

---

### Jour 2 – Articles & Navigation
- [ ] **US003**: Rédiger un article (éditeur riche)
- [ ] **US004**: Sauvegarde en brouillon
- [ ] **US005**: Modifier / Supprimer ses articles
- [ ] **US006**: Page d’accueil (articles récents)
- [ ] **US007**: Recherche / filtre par auteur ou popularité
- [ ] **US008**: Page de lecture d’un article
- [ ] **US012-13-14**: Profils publics & Dashboard

---

### Jour 3 – Interactions & UI/UX
- [ ] **US009**: Commentaires
- [ ] **US010**: Likes
- [ ] **US011**: Compteur de vues
- [ ] **Design**: Intégrer un design Medium-like et responsive (mobile-first)
- [ ] **Tests**: Tester les flux utilisateur (connexion → publication → lecture → interaction)

---

### Jour 4 – Déploiement
- [ ] **Frontend**: Déploiement sur Vercel
- [ ] **Backend**: Déploiement sur Render / Heroku
- [ ] **Stockage**: Configurer Cloudinary pour les images
- [ ] **Démo**: Préparer la démo finale

---

## Backend

Le backend est construit comme une API RESTful pour être consommée par un client front-end.

### Stack Technique

- **Node.js**: Environnement d'exécution JavaScript.
- **Express.js**: Framework web pour la création de l'API.
- **MongoDB**: Base de données NoSQL pour le stockage des données.
- **Mongoose**: ODM pour modéliser les objets de la base de données.
- **JWT (JSON Web Tokens)**: Pour la gestion de l'authentification et des sessions.
- **Cloudinary**: Pour le stockage des images.

### Installation et Lancement

Suivez ces étapes pour lancer le projet en local.

#### Prérequis

- Node.js (v14 ou supérieur)
- MongoDB (installé localement ou via un service cloud comme MongoDB Atlas)

#### Étapes

1.  **Clonez le dépôt :**
    ```bash
    git clone https://github.com/MamadouThiam572/blogsphere-backend.git
    cd blogsphere-backend
    ```

2.  **Installez les dépendances :**
    ```bash
    npm install
    ```

3.  **Configurez les variables d'environnement :**
    Créez un fichier `.env` à la racine du projet et ajoutez les variables suivantes.
    ```
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/blogsphere
    JWT_SECRET=VOTRE_CLE_SECRETE_PERSONNALISEE_TRES_LONGUE
    CLOUDINARY_CLOUD_NAME=...
    CLOUDINARY_API_KEY=...
    CLOUDINARY_API_SECRET=...
    ```

4.  **Lancez le serveur de développement :**
    ```bash
    npm run dev
    ```
    L'API sera accessible à l'adresse `http://localhost:3000`.

### Endpoints de l'API

#### Utilisateurs
- `POST /api/users/register` : Créer un nouvel utilisateur.
- `POST /api/users/login` : Connecter un utilisateur.
- `POST /api/users/logout` : Déconnecter un utilisateur.
- `PUT /api/users/profile` : Mettre à jour le profil de l'utilisateur.

#### Articles
- `GET /api/articles` : Obtenir tous les articles.
- `POST /api/articles` : Créer un nouvel article.
- `PUT /api/articles/:id` : Mettre à jour un article.
- `DELETE /api/articles/:id` : Supprimer un article.
- `POST /api/articles/:id/like` : Aimer un article.
- `DELETE /api/articles/:id/like` : Ne plus aimer un article.
- `POST /api/articles/upload-image` : Télécharger une image pour un article.

#### Commentaires
- `POST /api/comments` : Créer un nouveau commentaire.
- `GET /api/comments/article/:articleId` : Obtenir les commentaires d'un article.
- `PUT /api/comments/:id` : Mettre à jour un commentaire.
- `DELETE /api/comments/:id` : Supprimer un commentaire.

### Architecture du Backend

1.  **Client (Frontend/Postman)**: Envoie une requête HTTP.
2.  **`index.js` (Point d'entrée)**: Initialise l'application Express et la connexion à la DB.
3.  **`routes/`**: Définissent les endpoints et la logique métier.
4.  **`middleware/auth.js`**: Vérifie le token JWT pour les routes protégées.
5.  **`models/`**: Définissent les schémas de données avec Mongoose.
6.  **Database (MongoDB)**: Stocke et récupère les données.
7.  **Réponse au Client**: La route envoie une réponse HTTP au client.