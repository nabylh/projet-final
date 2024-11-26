import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import de useNavigate pour la redirection

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // Le champ unique pour l'email ou pseudo
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook de navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Identifier:", identifier); // Affiche l'identifiant
  console.log("Password:", password);

    try {
      const response = await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,  // On envoie l'email ou pseudo
          password,
        }),
        credentials: "include",
      });

      // On récupère la réponse JSON après avoir reçu la réponse du serveur
      const data = await response.json();

      // Affichage de 'data' dans la console une fois qu'il est défini
      console.log(data);

      if (!response.ok) {
        throw new Error("Échec de la connexion");
      }

      // Vérifie la réponse du serveur
      if (data.message === "Connexion réussie") {
        console.log("Utilisateur connecté avec succès", data);

        // Stockage du pseudo dans le localStorage ou dans un état global
        localStorage.setItem("pseudo", data.user.pseudo); // Stockage du pseudo

        // Redirection vers la page principale
        navigate("/"); // Redirection à la page principale
      } else {
        setError(data.message || "Erreur de connexion");
      }
    } catch (err) {
      console.error("Erreur lors de la connexion", err);
      setError("Erreur lors de la connexion, veuillez réessayer.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Connexion</h2>

        <div className="form-group">
          <label htmlFor="identifier">Pseudo ou Email</label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            placeholder="Entrez votre pseudo ou email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Se connecter
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
