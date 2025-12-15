import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Register Service Worker for PWA
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("‚úÖ Service Worker registered:", reg.scope))
        .catch((err) => console.error("‚ùå Service Worker registration failed:", err));
    });
  }
}

// Enable MSW in development mode
async function enableMocking() {
  if (import.meta.env.MODE === "development") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("msw") === "on") {
      const { startMockWorker } = await import("./mocks/browser");
      await startMockWorker();
      console.log("Ì¥∂ MSW enabled - API calls are mocked");
    }
  }
}

// Initialize app
async function initApp() {
  await enableMocking();
  registerServiceWorker();

  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Failed to find the root element");

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

initApp();
