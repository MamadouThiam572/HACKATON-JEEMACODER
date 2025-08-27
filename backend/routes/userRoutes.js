const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');

// Fonction pour générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Enregistrer un nouvel utilisateur
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Données utilisateur non valides' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
});

// @desc    Authentifier l'utilisateur & obtenir le token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error: error.message });
  }
});

// @desc    Récupérer le profil de l'utilisateur
// @route   GET /api/users/profile
// @access  Privé
router.get('/profile', auth, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
});

// @desc    Mettre à jour le profil de l'utilisateur
// @route   PUT /api/users/profile
// @access  Privé
router.put('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.username = req.body.username || user.username;
            user.bio = req.body.bio || user.bio;
            if (req.body.profilePicture) {
                user.profilePicture = req.body.profilePicture;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio,
                profilePicture: updatedUser.profilePicture,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour', error: error.message });
    }
});

// @desc    Déconnexion de l'utilisateur
// @route   POST /api/users/logout
// @access  Privé
router.post('/logout', auth, (req, res) => {
    res.status(200).send({ message: 'Déconnexion réussie.' });
});

module.exports = router;
