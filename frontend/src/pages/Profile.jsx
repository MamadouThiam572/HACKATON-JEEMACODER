import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/Context/AuthContext";
import axios from "axios";

export default function Profile() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        setError("Veuillez vous connecter pour voir votre profil.");
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch user profile
        const profileResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/users/profile`, config);
        setProfile(profileResponse.data);

        // Fetch all articles and filter
        const articlesResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/articles`);
        const userArticles = articlesResponse.data.filter(
          (article) => article.author._id === profileResponse.data._id
        );
        setArticles(userArticles);

      } catch (err) {
        setError("Erreur lors de la récupération des données.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return <div className="text-center py-10">Chargement du profil...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }
  
  if (!profile) {
    return <div className="text-center py-10">Impossible de charger le profil.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={profile.profilePicture || 'https://via.placeholder.com/150'} 
            alt="Profile" 
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">{profile.username}</h2>
            <p className="text-gray-600">{profile.bio || "Aucune bio pour le moment."}</p>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-4">Articles publiés ({articles.length})</h3>
        {articles.length > 0 ? (
          <ul className="space-y-2">
            {articles.map((article) => (
              <li key={article._id}>
                <Link className="text-blue-500 hover:underline" to={`/article/${article._id}`}>
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Vous n'avez publié aucun article pour le moment.</p>
        )}
      </div>
    </div>
  );
}