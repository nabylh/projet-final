import React from "react";
import ReactDOM from "react-dom/client";
import App from "../src/App";
import "../public/assets/styles/index.scss";
import "../public/assets/styles/category.scss";
import "../public/assets/styles/undercategoryArticles.scss";
import "../public/assets/styles/images.scss";
import "../public/assets/styles/Apropos.scss";
import "../public/assets/styles/Portfolio.scss"
import "../public/assets/styles/CV.scss"
import "../public/assets/styles/Article.scss";
import "../public/assets/styles/contact.scss"


const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);
