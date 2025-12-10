import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SongProvider } from "./Context/SongContext.tsx";
import { UserProvider } from "./Context/UserContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <SongProvider>
        <App />
      </SongProvider>
    </UserProvider>
  </StrictMode>
);
