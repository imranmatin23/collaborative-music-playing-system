/*
 * The index.js file is used to mount/render the main react component onto the root element.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

/*
 * Strict Mode enables extra development-only checks for the entire component tree inside the <StrictMode> component.
 * These checks help you find common bugs in your components early in the development process.
 * Ref: https://react.dev/reference/react/StrictMode#enabling-strict-mode-for-entire-app
 */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
