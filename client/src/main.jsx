import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ContextContainer from "./context/ContextContainer.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/*<ContextContainer>*/}
    <App />
    {/*</ContextContainer>*/}
  </StrictMode>
);
