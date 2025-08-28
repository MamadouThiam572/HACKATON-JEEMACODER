import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/Context/AuthContext";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingArticleId, setEditingArticleId] = useState(null);

  // Fetch user's articles
  useEffect(() => {
    const fetchArticles = async () => {
      if (!user) {
        setError("Veuillez vous connecter.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("http://localhost:3002/api/articles");
        const userArticles = response.data.filter(
          (article) => article.author._id === user._id
        );
        setArticles(userArticles);
      } catch (err) {
        setError("Erreur lors de la récupération des articles.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [user]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setEditingArticleId(null);
    setIsFormVisible(false);
  };

  // Handle Create/Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Le titre et le contenu sont requis.");
      return;
    }
    
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const articleData = { title, content };

    try {
      if (editingArticleId) {
        // Update
        const response = await axios.put(`http://localhost:3002/api/articles/${editingArticleId}`, articleData, config);
        setArticles(articles.map(a => a._id === editingArticleId ? response.data : a));
        alert("Article mis à jour avec succès !");
      } else {
        // Create
        const response = await axios.post("http://localhost:3002/api/articles", articleData, config);
        setArticles([response.data, ...articles]);
        alert("Article créé avec succès !");
      }
      resetForm();
    } catch (err) {
      alert("Une erreur s'est produite.");
      console.error(err);
    }
  };

  // Handle Delete
  const handleDelete = async (articleId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`http://localhost:3002/api/articles/${articleId}`, config);
        setArticles(articles.filter(a => a._id !== articleId));
        alert("Article supprimé.");
      } catch (err) {
        alert("Erreur lors de la suppression.");
        console.error(err);
      }
    }
  };

  // Handle Edit
  const handleEdit = (article) => {
    setTitle(article.title || '');
    setContent(article.content || '');
    setEditingArticleId(article._id);
    setIsFormVisible(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>

        <button
          onClick={() => {
            resetForm();
            setIsFormVisible(!isFormVisible);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mb-4"
        >
          {isFormVisible && !editingArticleId ? 'Annuler' : 'Nouvel article'}
        </button>

        {isFormVisible && (
          <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">
              {editingArticleId ? "Modifier l'article" : "Créer un article"}
            </h2>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
              <input
                type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md" required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="10"
                required
              ></textarea>
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                {editingArticleId ? 'Mettre à jour' : 'Publier'}
              </button>
              <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                Annuler
              </button>
            </div>
          </form>
        )}

        <h2 className="text-2xl font-semibold mt-6 mb-4">Mes articles ({articles.length})</h2>
        {loading ? <p>Chargement...</p> : error ? <p className="text-red-500">{error}</p> : (
          <ul className="space-y-2">
            {articles.length > 0 ? articles.map(article => (
              <li key={article._id} className="flex justify-between items-center p-3 border rounded">
                <Link to={`/article/${article._id}`} className="hover:underline">{article.title}</Link>
                <div>
                  <button onClick={() => handleEdit(article)} className="text-blue-500 hover:underline mr-4">Modifier</button>
                  <button onClick={() => handleDelete(article._id)} className="text-red-500 hover:underline">Supprimer</button>
                </div>
              </li>
            )) : <p>Vous n'avez aucun article.</p>}
          </ul>
        )}
      </div>
    </div>
  );
}
