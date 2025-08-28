import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Editor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assuming you have a token from login stored in localStorage or context
      const token = localStorage.getItem('token'); 
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/articles`, { title, content }, config);
      console.log('Article created:', res.data);
      alert('Article créé avec succès !');
      navigate('/'); // Redirect to home or article list
    } catch (error) {
      console.error('Error creating article:', error.response ? error.response.data : error.message);
      alert('Erreur lors de la création de l\'article: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Créer un nouvel article</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Titre de l'article"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            placeholder="Contenu de l'article"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
          >
            Publier l'article
          </button>
        </form>
      </div>
    </div>
  );
}
