const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log('MONGODB_URI in db.js:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connecté avec succès !");
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB :", error.message);
    process.exit(1); // Arrête le serveur si la DB ne se connecte pas
  }
};

module.exports = connectDB;
