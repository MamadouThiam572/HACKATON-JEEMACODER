import { useState } from "react";
import { useAuth } from "../components/Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3002/api/users/login", {
        email,
        password,
      });
      login(res.data, res.data.token);
      navigate("/"); // Redirect to home page after successful login
    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.message || "Erreur de connexion.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded"
        />
        <button className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition">
          Login
        </button>
        
      
          <p className="text-center mt-4 text-gray-600">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              S'inscrire
            </Link>
         </p>
      </form>
    </div>
  );
}

export default Login;
