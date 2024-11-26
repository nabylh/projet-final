import "dotenv/config"; 
import express from "express"; 
import path from "path"; 
import cors from "cors"; 
import session from "express-session"; 

import { createRequire } from "module"; 
import mysql from "mysql2"; // Importation du module mysql2
const require = createRequire(import.meta.url);
const MySQLStore = require("express-mysql-session")(session); 

import router from "./routes/index.routes.js"; 

const app = express(); 

const PORT = process.env.PORT || 3000; 

// Middleware pour parser les données JSON et URL-encodées (placer avant les routes)
app.use(express.json()); // Middleware pour parser le JSON
app.use(express.urlencoded({ extended: false })); // Middleware pour parser les données URL-encodées

// Configuration de CORS
app.use(
    cors({
        origin: "http://localhost:5173", 
        credentials: true, 
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], 
        allowedHeaders: ["Content-Type"], 
    })
);

// Configuration du pool de connexions MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,  // Limite de connexions simultanées
    queueLimit: 0
});

// Configuration des sessions
app.use(
    session({
        secret: process.env.SECRET_KEY_SESSION,  // Clé secrète pour la session
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // Durée de vie de la session : 24 heures
            httpOnly: true,
            secure: false, // Changez à true en production avec HTTPS
        },
        store: new MySQLStore({
            host: process.env.DB_HOST, // Hôte de la base de données
            port: process.env.DB_PORT, // Port de la base de données
            user: process.env.DB_USER, // Utilisateur de la base de données
            password: process.env.DB_PASS, // Mot de passe de la base de données
            database: process.env.DB_NAME, // Nom de la base de données
        }),
    })
);

// Exemple d'authentification (lorsque l'utilisateur se connecte)
app.post("/user", async (req, res) => {
    // Vérification que req.body contient bien les données attendues
    if (!req.body || !req.body.pseudo || !req.body.password) {
        return res.status(400).json({ message: "Pseudo ou mot de passe manquant" });
    }

    const { pseudo, password } = req.body;
    try {
        // Interroger la base de données
        const [[user]] = await pool.promise().query("SELECT * FROM user WHERE pseudo = ?", [pseudo]);

        if (user && user.password === password) {
            req.session.user = { id: user.id, pseudo: user.pseudo }; // Crée la session pour l'utilisateur connecté
            return res.json({ message: "Connexion réussie", user: req.session.user });
        }

        return res.status(401).json({ message: "Identifiants incorrects" });
    } catch (err) {
        console.error("Erreur lors de l'authentification :", err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
});

// Middleware pour servir des fichiers statiques
app.use("/images", express.static(path.join(process.cwd(), "public/images"))); // Servir les images

// Middleware pour les requêtes entrantes (pour débogage, à supprimer en production)
app.use(async (req, res, next) => {
    console.log("user session", req.session.user);
    try {
        // Utilisation de `pool.query()` pour interroger la base de données
        const [rows] = await pool.promise().query("SELECT COUNT(session_id) AS session FROM sessions");
        console.log("Active sessions:", rows[0].session);  // Affiche le nombre de sessions actives
        console.log("User session:", req.session.user ? req.session : "No user session");
        next();
    } catch (err) {
        console.error("Error fetching sessions:", err.message);
        next(); // Continuer même en cas d'erreur
    }
});

// Utilisation des routes définies dans index.routes.js
app.use('/', router); 

// Démarrage du serveur
app.listen(PORT, () =>
    console.log(`Server is running at http://localhost:${PORT}`)
);
