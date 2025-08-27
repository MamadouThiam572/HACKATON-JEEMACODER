import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Editor from "./pages/Editor"; // Importez le composant Editor
import Article from "./pages/Article";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
// Importez le AuthProvider
import AuthProvider from "./components/Context/AuthContext"; 

function App() {
  return (
    // Enrobez toute l'application avec le AuthProvider
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor" element={<Editor />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;