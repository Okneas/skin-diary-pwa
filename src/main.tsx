// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

// Регистрируем SW и подписываемся на события обновления
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Диспатчим кастомное событие — его слушает UpdatePrompt
    window.dispatchEvent(new CustomEvent("pwa:need-refresh"));
  },
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent("pwa:offline-ready"));
  },
});

// Экспортируем функцию обновления — UpdatePrompt вызовет её
(window as unknown as { __pwaUpdate: () => void }).__pwaUpdate = () =>
  updateSW(true);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);