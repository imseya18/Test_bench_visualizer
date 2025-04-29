import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { HeroUIProvider } from "@heroui/react";

ReactDOM.createRoot(document.querySelector("#root") as HTMLElement).render(
  <React.StrictMode>
    <HeroUIProvider>
      <main className="dark text-foreground bg-background">
        <App />
      </main>
    </HeroUIProvider>
  </React.StrictMode>
);
