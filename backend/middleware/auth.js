const jwt = require('jsonwebtoken');

// Ce middleware vérifiera le token JWT envoyé par l'utilisateur
// et attachera les informations de l'utilisateur à l'objet `req`

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send({ error: 'Veuillez vous authentifier.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attache les données de l'utilisateur (ex: { userId: '...' })
        next(); // Passe au prochain middleware ou à la route
    } catch (error) {
        res.status(401).send({ error: 'Token invalide.' });
    }
};

module.exports = auth;
