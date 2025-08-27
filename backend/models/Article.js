const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Référence au modèle User
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    brouillon: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String
    }
});

module.exports = mongoose.model('Article', articleSchema);
