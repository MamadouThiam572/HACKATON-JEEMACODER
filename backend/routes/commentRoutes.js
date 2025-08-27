const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment'); // Importer le modèle Comment
const auth = require('../middleware/auth'); // Importer le middleware d'authentification

// POST /api/comments - Créer un nouveau commentaire
router.post('/', auth, async (req, res) => {
    try {
        const { content, article } = req.body; // On attend le contenu et l'ID de l'article
        const author = req.user.id; // L'ID de l'auteur vient du token JWT via le middleware auth

        const comment = new Comment({
            content,
            author,
            article
        });

        await comment.save();
        console.log('Commentaire sauvegardé :', comment); // Ligne de débogage
        res.status(201).send(comment);
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du commentaire :', error); // Ligne de débogage
        res.status(400).send({ error: error.message });
    }
});

// GET /api/comments/article/:articleId - Obtenir les commentaires d'un article
router.get('/article/:articleId', async (req, res) => {
    try {
        const comments = await Comment.find({ article: req.params.articleId })
                                      .populate('author', 'username') // Populate l'auteur pour afficher son nom d'utilisateur
                                      .sort({ createdAt: -1 }); // Trier par les plus récents
        console.log("Commentaires trouvés pour l'article :", comments); // Ligne de débogage
        res.send(comments);
    } catch (error) {
        console.error('Erreur lors de la récupération des commentaires :', error); // Ligne de débogage
        res.status(500).send({ error: error.message });
    }
});

// PUT /api/comments/:id - Mettre à jour un commentaire
router.put('/:id', auth, async (req, res) => {
    try {
        const { content } = req.body;
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).send({ error: 'Commentaire non trouvé.' });
        }

        // Vérifier que l'utilisateur est bien l'auteur du commentaire
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).send({ error: 'Non autorisé à modifier ce commentaire.' });
        }

        comment.content = content;
        await comment.save();
        res.send(comment);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// DELETE /api/comments/:id - Supprimer un commentaire
router.delete('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).send({ error: 'Commentaire non trouvé.' });
        }

        // Vérifier que l'utilisateur est bien l'auteur du commentaire
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).send({ error: 'Non autorisé à supprimer ce commentaire.' });
        }

        await comment.deleteOne(); // Utiliser deleteOne() ou remove() selon la version de Mongoose
        res.send({ message: 'Commentaire supprimé avec succès.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
