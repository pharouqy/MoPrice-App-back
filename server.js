import { createServer } from "http";
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import "./db/connexion.js";
import router from "./routes/user.js";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content, Accept, Content-Type"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

const corsOptions = {
  origin: "*", // Remplacer par l'origine de votre application
  optionsSuccessStatus: 200, // Certains navigateurs renvoient un code d'état 204, ce qui peut causer des problèmes, donc nous forçons un code 200 ici.
};

// Activer CORS pour toutes les routes
app.use(cors(corsOptions));

// En désactivant cette option avec la valeur false, nous permettons aux ressources d'être chargées à partir de différents domaines et origines.
app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(express.json());

app.use("/auth", router);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello everybody!" });
});

const server = createServer(app);

server.on("listening", () => {
  console.log(`listening on ${process.env.PORT}`);
});

server.listen(process.env.PORT);
