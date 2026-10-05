// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt", // покажем свой UI обновления
      includeAssets: [
        "favicon-196.png",
        "apple-icon-180.png",
        "manifest-icon-192.maskable.png",
        "manifest-icon-512.maskable.png",
        "models/face_landmarker.task",
      ],
      manifest: {
        name: "Дневник красоты",
        short_name: "Красота",
        description:
          "Интеллектуальный мониторинг, прогнозирование и персональные рекомендации по состоянию кожи лица",
        theme_color: "#B27A8E",
        background_color: "#FAF6F1",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        lang: "ru",
        categories: ["health", "lifestyle", "beauty"],
        icons: [
          {
            src: "/manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "/screenshots/passport.png",
            sizes: "1080x1920",
            type: "image/png",
            form_factor: "narrow",
            label: "Паспорт кожи",
          },
          {
            src: "/screenshots/diary.png",
            sizes: "1080x1920",
            type: "image/png",
            form_factor: "narrow",
            label: "Дневник наблюдений",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,jpg,jpeg,webp}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api/, /^\/storage/],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          // === API: свежие данные, fallback из кэша при офлайне ===
          {
            urlPattern: /^https?:\/\/.*\/api\/v1\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },

          // === Storage (фото, состаренные): агрессивно кэшируем ===
          {
            urlPattern: /^https?:\/\/.*\/storage\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "user-media",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 90 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },

          // === MediaPipe WASM с CDN ===
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/npm\/@mediapipe\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "mediapipe-wasm",
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },

          // === Модель Face Landmarker ===
          {
            urlPattern: /\/models\/face_landmarker\.task$/,
            handler: "CacheFirst",
            options: {
              cacheName: "mp-model",
              expiration: { maxEntries: 3, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },

          // === Google Fonts ===
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-styles" },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /\/backgrounds\/.*\.(jpg|jpeg|png|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "backgrounds",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://localhost:8000", changeOrigin: true },
      "/storage": { target: "http://localhost:8000", changeOrigin: true },
    },
  },
});
