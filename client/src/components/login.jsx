import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import de useNavigate pour la redirection

const Login = () => {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook de navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pseudo,
          password,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Échec de la connexion");
      }

      const data = await response.json();

      // Vérifie la réponse du serveur
      if (data.message === "Connexion réussie") {
        console.log("Utilisateur connecté avec succès", data);

        // Stockage du pseudo dans le localStorage ou dans un état global
        localStorage.setItem("pseudo", pseudo); // Stockage du pseudo

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
          <label htmlFor="pseudo">Pseudo</label>
          <input
            type="text"
            id="pseudo"
            name="pseudo"
            placeholder="Entrez votre pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
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
