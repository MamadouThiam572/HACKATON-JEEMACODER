const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Assurer qu'un utilisateur ne peut liker un article qu'une seule fois
likeSchema.index({ user: 1, article: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
