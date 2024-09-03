import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const URI = process.env.MONGODB_URL;

if (!URI) {
  console.error("Erreur : la variable d'environnement MONGODB_URL n'est pas définie.");
  process.exit(1);
}

mongoose
  .connect(URI)
  .then(() => {
    console.log("Connexion réussie à MongoDB !!!");
  })
  .catch((error) => {
    console.error("Connexion échoué à MongoDB !!!", error);
    process.exit(1); // Arrête l'exécution du programme en cas d'erreur
  });

export default mongoose;

