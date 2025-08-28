import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link
import { useAuth } from "../components/Context/AuthContext"; // Import useAuth

const Home = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:3002/api/articles");
        setArticles(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Chargement des articles...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Erreur lors du chargement des articles: {error.message}</div>;
  }

  return (
    <>
      {/* Hero Section Améliorée */}
<section className="relative py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
  {/* Element décoratif */}
  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:40px_40px]"></div>

  <div className="container mx-auto px-6 relative z-10">
    <div className="text-center max-w-3xl mx-auto">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
      >
        Bienvenue sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">BlogSphere</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
      >
        Découvrez, partagez et connectez-vous avec une communauté de passionnés. Des tutoriels techniques aux récits personnels, trouvez votre inspiration.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href={user ? "/editor" : "/register"}
          className="px-8 py-4 bg-white text-slate-900 font-bold rounded-full shadow-2xl hover:bg-gray-100 transition-colors duration-300 text-lg"
        >
          Commencer à écrire
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="#articles"
          className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-slate-900 transition-all duration-300 text-lg"
        >
          Explorer les articles
        </motion.a>
      </motion.div>
    </div>
  </div>
</section>

{/* Section Tendance */}
<section className="py-16 bg-gray-50">
  <div className="container mx-auto px-6">
    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Articles Tendances</h2>
    <div className="grid md:grid-cols-2 gap-8">
      {/* Article Principal */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <img src="https://picsum.photos/800/400?random=4" alt="Article tendance" className="w-full h-48 object-cover"/>
        <div className="p-6">
          <h3 className="font-bold text-xl mb-2">Les React Hooks Expliqués Simplement</h3>
          <p className="text-gray-600 mb-4">Une guide complet pour maîtriser les hooks essentiels de React.</p>
          <a href="#" className="text-blue-600 font-medium hover:underline">Lire l'article</a>
        </div>
      </div>
      
      {/* Liste des articles tendance */}
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-20 h-20 bg-gray-300 rounded-lg"></div>
            <div>
              <h4 className="font-semibold text-gray-900">Titre de l'article {i}</h4>
              <p className="text-sm text-gray-500">250 lectures</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* Articles Grid */}
      <main id="articles" className="container mx-auto px-6 py-16">
        {articles.length === 0 ? (
          <p className="text-center text-gray-600">Aucun article disponible pour le moment.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {articles.map((article) => (
              <motion.div
                key={article._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={article.imageUrl || "https://picsum.photos/600/400?random=" + article._id}
                  alt={article.title}
                  className="w-full h-72 md:h-80 lg:h-96 object-cover object-center"
                />
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2 text-gray-900">{article.title}</h3>
                    <p className="text-gray-600 mb-4">{article.content.substring(0, 150)}...</p> {/* Using content as excerpt */}
                  </div>
                  <Link
                    to={`/article/${article._id}`}
                    className="mt-auto inline-block text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Lire plus →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* CTA Section */}
<section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
  <div className="container mx-auto px-6 text-center">
    <h2 className="text-3xl font-bold mb-6">Prêt à partager votre histoire ?</h2>
    <p className="text-xl mb-8 max-w-2xl mx-auto">
      Rejoignez notre communauté de writers et partagez vos connaissances avec le monde.
    </p>
    <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300">
      Créer un compte gratuit
    </button>
  </div>
</section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} BlogSphere. Tous droits réservés.
        </div>
      </footer>
    </>
  );
};

export default Home;
