import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/Context/AuthContext";

export default function Article() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);

  // Refactored state for comment editing
  const [editingComment, setEditingComment] = useState(null); // Stores { id, content }

  const fetchArticleAndComments = async () => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const articleResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/articles/${id}`, config);
      setArticle(articleResponse.data);
      setIsLiked(articleResponse.data.isLiked);
      setLikesCount(articleResponse.data.likesCount);

      const commentsResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/comments/article/${id}`);
      setComments(commentsResponse.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticleAndComments();
  }, [id, token]);

  const handleLikeToggle = async () => {
    if (!user || !token) return alert("Veuillez vous connecter pour aimer un article.");
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/articles/${id}/like`, {}, config);
      setIsLiked(response.data.liked);
      setLikesCount(prev => response.data.liked ? prev + 1 : prev - 1);
    } catch (err) {
      console.error("Erreur lors du basculement du like:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user || !token) return alert("Veuillez vous connecter pour commenter.");
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/comments`, { content: newComment, article: id }, config);
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Erreur lors de la soumission du commentaire:", err);
    }
  };

  const handleCommentLike = async (commentId) => {
    if (!user || !token) return alert("Veuillez vous connecter pour aimer un commentaire.");
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/comments/${commentId}/like`, {}, config);
      setComments(comments.map(c => c._id === commentId ? response.data : c));
    } catch (err) {
      console.error("Erreur lors du like du commentaire:", err);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment({ id: comment._id, content: comment.content });
  };

  const handleUpdateComment = async () => {
    if (!editingComment || !editingComment.content.trim()) return;
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.put(`${import.meta.env.VITE_APP_API_URL}/api/comments/${editingComment.id}`, { content: editingComment.content }, config);
        setComments(comments.map(c => c._id === editingComment.id ? response.data : c));
        setEditingComment(null); // Exit editing mode
    } catch (err) {
        console.error("Erreur lors de la mise à jour du commentaire:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`${import.meta.env.VITE_APP_API_URL}/api/comments/${commentId}`, config);
            setComments(comments.filter(c => c._id !== commentId));
        } catch (err) {
            console.error("Erreur lors de la suppression du commentaire:", err);
        }
    }
  };

  if (loading) return <div className="text-center py-10">Chargement...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Erreur: {error.message}</div>;
  if (!article) return <div className="text-center py-10">Article non trouvé.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <p className="text-gray-700 mb-6">{article.content}</p>
        <div className="flex gap-4 mb-6">
          <button onClick={handleLikeToggle} className={`px-4 py-2 rounded transition ${isLiked ? "bg-red-500" : "bg-blue-500"} text-white`}>
            {isLiked ? "Je n'aime plus" : "J'aime"} ({likesCount})
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Commentaires</h2>
          {user && (
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Ajoutez un commentaire..." className="w-full p-2 border rounded-md" rows="3"></textarea>
              <button type="submit" className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Commenter</button>
            </form>
          )}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="bg-gray-100 p-4 rounded-md">
                <p className="font-semibold">{comment.author?.username || "Auteur inconnu"}</p>
                {editingComment?.id === comment._id ? (
                  <div>
                    <textarea
                      value={editingComment.content}
                      onChange={(e) => setEditingComment({ ...editingComment, content: e.target.value })}
                      className="w-full p-2 border rounded-md"
                      rows="2"
                    ></textarea>
                    <div className="flex gap-2 mt-2">
                      <button onClick={handleUpdateComment} className="text-sm px-3 py-1 bg-green-500 text-white rounded">Enregistrer</button>
                      <button onClick={() => setEditingComment(null)} className="text-sm px-3 py-1 bg-gray-500 text-white rounded">Annuler</button>
                    </div>
                  </div>
                ) : (
                  <p>{comment.content}</p>
                )}
                <div className="flex items-center mt-2 text-sm">
                  <button onClick={() => handleCommentLike(comment._id)} disabled={!user} className={`mr-2 ${comment.likes.includes(user?._id) ? "text-blue-600 font-bold" : "text-gray-500"}`}>
                    J'aime
                  </button>
                  <span className="text-gray-600 mr-4">{comment.likes.length}</span>
                  {user && user._id === comment.author._id && (
                    <>
                      <button onClick={() => handleEditComment(comment)} className="text-gray-500 hover:underline mr-2">Modifier</button>
                      <button onClick={() => handleDeleteComment(comment._id)} className="text-red-500 hover:underline">Supprimer</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
