const express = require('express');
const router = express.Router();
const Article = require('../models/Article'); // Importer le modèle Article
const Like = require('../models/Like'); // Importer le modèle Like
const auth = require('../middleware/auth'); // Importer le middleware d'authentification
const upload = require('../middleware/uploadImage'); // Importer le middleware de téléchargement d'image

// GET /api/articles - Obtenir tous les articles
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find().populate('author', 'username'); // Populate l'auteur
        res.send(articles);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// GET /api/articles/:id - Obtenir un article par son ID
router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate('author', 'username');
        if (!article) {
            return res.status(404).send({ error: 'Article non trouvé.' });
        }
        
        // Incrémenter le compteur de vues
        article.views = (article.views || 0) + 1;
        await article.save();

        res.send(article);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// POST /api/articles - Créer un nouvel article (protégé par authentification)
router.post('/', auth, async (req, res) => {
    try {
        const { title, content, imageUrl } = req.body;
        const author = req.user.id; // L'ID de l'auteur vient du token JWT

        const article = new Article({
            title,
            content,
            author,
            imageUrl
        });

        await article.save();
        res.status(201).send(article);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// PUT /api/articles/:id - Mettre à jour un article (protégé par authentification)
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, content, imageUrl } = req.body;
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).send({ error: 'Article non trouvé.' });
        }

        // Vérifier que l'utilisateur est bien l'auteur de l'article
        if (article.author.toString() !== req.user.id) {
            return res.status(403).send({ error: 'Non autorisé à modifier cet article.' });
        }

        article.title = title;
        article.content = content;
        if (imageUrl !== undefined) {
            article.imageUrl = imageUrl;
        }
        await article.save();
        res.send(article);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// DELETE /api/articles/:id - Supprimer un article (protégé par authentification)
router.delete('/:id', auth, async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).send({ error: 'Article non trouvé.' });
        }

        // Vérifier que l'utilisateur est bien l'auteur de l'article
        if (article.author.toString() !== req.user.id) {
            return res.status(403).send({ error: 'Non autorisé à supprimer cet article.' });
        }

        await article.deleteOne();
        res.send({ message: 'Article supprimé avec succès.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// POST /api/articles/:id/like - Aimer un article (protégé par authentification)
router.post('/:id/like', auth, async (req, res) => {
    try {
        const articleId = req.params.id;
        const userId = req.user.id;

        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).send({ error: 'Article non trouvé.' });
        }

        // Vérifier si l'utilisateur a déjà liké cet article
        const existingLike = await Like.findOne({ user: userId, article: articleId });
        if (existingLike) {
            return res.status(409).send({ message: 'Article déjà liké par cet utilisateur.' });
        }

        const like = new Like({ user: userId, article: articleId });
        await like.save();

        res.status(201).send({ message: 'Article liké avec succès.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// DELETE /api/articles/:id/like - Désaimer un article (protégé par authentification)
router.delete('/:id/like', auth, async (req, res) => {
    try {
        const articleId = req.params.id;
        const userId = req.user.id;

        const result = await Like.deleteOne({ user: userId, article: articleId });

        if (result.deletedCount === 0) {
            return res.status(404).send({ message: 'Like non trouvé ou déjà supprimé.' });
        }

        res.status(200).send({ message: 'Like supprimé avec succès.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// POST /api/articles/upload-image - Télécharger une image (protégé par authentification)
router.post('/upload-image', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ error: 'Aucun fichier image fourni.' });
        }
        res.status(200).send({ imageUrl: req.file.path });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;