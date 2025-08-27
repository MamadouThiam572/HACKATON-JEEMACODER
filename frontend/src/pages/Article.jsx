import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/articles/${id}`);
        setArticle(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Chargement de l'article...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Erreur lors du chargement de l'article: {error.message}</div>;
  }

  if (!article) {
    return <div className="text-center py-10">Article non trouvé.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <p className="text-gray-700 mb-6">
          {article.content}
        </p>
        <div className="flex gap-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Like</button>
          <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition">Commenter</button>
        </div>
      </div>
    </div>
  );
}
