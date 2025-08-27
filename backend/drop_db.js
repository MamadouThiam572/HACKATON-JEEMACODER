const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const dropDB = async () => {
  try {
    console.log("Tentative de connexion à MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connecté avec succès !");

    console.log("Suppression de la base de données...");
    await mongoose.connection.db.dropDatabase();
    console.log("✅ Base de données supprimée avec succès !");

    mongoose.connection.close();
    console.log("Connexion fermée.");
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de la base de données :", error.message);
    process.exit(1);
  }
};

dropDB();
