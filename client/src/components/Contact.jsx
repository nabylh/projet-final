import React, { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    msg: "",
  });

  const [errors, setErrors] = useState({
    emailError: "",
    nameError: "",
    msgError: "",
  });

  const [sentMessage, setSentMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${name}Error`]: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let valid = true;

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.nameError = "Le champ nom est obligatoire.";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.emailError = "Le champ email est obligatoire.";
      valid = false;
    } else if (formData.email.length < 10) {
      newErrors.emailError = "L'email doit contenir au moins 10 caractères.";
      valid = false;
    }

    if (!formData.msg.trim()) {
      newErrors.msgError = "Le champ message est obligatoire.";
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    setSentMessage("Votre message a bien été envoyé !");
    setFormData({ email: "", name: "", msg: "" });
  };

  return (
    <div className="contact__container">
      <form className="contact__form" onSubmit={handleSubmit}>
        <div className="form__group">
          <label htmlFor="name" className="form__label">
            Nom
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Entrez votre nom"
            className="form__input"
          />
          {errors.nameError && (
            <p className="form__error-message">{errors.nameError}</p>
          )}
        </div>

        <div className="form__group">
          <label htmlFor="email" className="form__label">
            E-Mail
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Entrez votre email"
            className="form__input"
          />
          {errors.emailError && (
            <p className="form__error-message">{errors.emailError}</p>
          )}
        </div>

        <div className="form__group">
          <label htmlFor="msg" className="form__label">
            Message
          </label>
          <textarea
            name="msg"
            value={formData.msg}
            onChange={handleChange}
            placeholder="Votre message ici..."
            className="form__textarea"
          />
          {errors.msgError && (
            <p className="form__error-message">{errors.msgError}</p>
          )}
        </div>

        <div className="form__group form__group--submit">
          <button type="submit" className="form__button">
            Envoyer
          </button>
          {sentMessage && (
            <p className="form__success-message">{sentMessage}</p>
          )}
        </div>
      </form>
    </div>
  );
}

export default Contact;
