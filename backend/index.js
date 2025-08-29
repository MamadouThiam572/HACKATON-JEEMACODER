const express = require('express');
const dotenv = require('dotenv'); // Pour charger les variables d'environnement
const cors = require('cors'); // Importation du module cors

dotenv.config(); // Charge les variables du fichier .env
console.log('JWT_SECRET from .env:', process.env.JWT_SECRET); // Debugging JWT_SECRET

const app = express();
app.use(cors({ origin: '*' })); // Utilisation du middleware cors pour autoriser toutes les origines (pour le débogage)
const port = process.env.PORT || 3000; // Utilise le port du .env ou 3000 par défaut
const connectDB = require("./config/db");
connectDB(process.env.MONGO_URI);


// Importer les fichiers de routes
const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articleRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Middleware pour permettre à Express de lire le JSON
app.use(express.json());

// Middleware de log pour toutes les requêtes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Utiliser les routes
// Chaque fois qu'une requête commence par /api/users, Express utilisera le routeur userRoutes
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);


// Route de base pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.send('Le serveur BlogSphere fonctionne !');
});

// On démarre le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});