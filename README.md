# Дневник красоты — Frontend

PWA для мониторинга состояния кожи лица: дневник наблюдений, карта лица через MediaPipe, средства ухода, персональные рекомендации.

## Стек

- **React 18** + **TypeScript**
- **Vite** — сборка
- **Tailwind CSS** — стили (light / dark тема)
- **React Router v6** — роутинг
- **@tanstack/react-query** — серверное состояние
- **Zustand** — глобальный стейт (auth, тема, онбординг)
- **Framer Motion** — анимации
- **MediaPipe Tasks Vision** — 478 точек лица
- **Recharts / кастомные SVG** — графики
- **vite-plugin-pwa** — PWA-манифест, Service Worker

## Структура проекта

```text
src/
├── api/                             # axios-клиент и эндпоинты
├── app/                             # роутер, провайдеры, App
├── components/
│   ├── ui/                          # Button, Card, Sheet, Input...
│   ├── forms/                       # формы признаков, факторов
│   ├── charts/                      # AgeCurve, TrendCurve, Sparkline
│   ├── brand/                       # Logo, LogoMark, SplashScreen
│   ├── decor/                       # Blob, PetalBurst, HeroBackdrop
│   ├── layout/                      # AppLayout, TabBar
│   └── product/                     # ProductCard, ProductPicker
├── features/
│   ├── auth/                        # Login, Register
│   ├── onboarding/                  # 8 шагов визарда
│   ├── diary/                       # Calendar, List, Form, Slider
│   ├── photo/                       # PhotoUploader, FaceMap, useMediaPipe
│   ├── passport/                    # DynamicsTab, GeneticsTab
│   └── aging/                       # AgingCarousel, AgingProgress
├── hooks/                            # useAuth, useDiary, useProducts...
├── pages/                            # Dashboard, Diary, Products, Passport...
├── store/                            # Zustand-сторы
├── types/                            # TypeScript-типы
└── utils/                            # cn, date, storage, motion
```

## Быстрый старт

### 1. Клонирование

```bash
git clone https://github.com/<your-username>/skin-diary-frontend.git
cd skin-diary-frontend
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка переменных окружения

Создай `.env` в корне проекта:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_STORAGE_URL=http://localhost:8000/storage
```

### 4. Прокси для разработки

В `vite.config.ts` уже настроен прокси на `http://localhost:8000`.

Backend должен быть запущен на этом порту.

### 5. Запуск

```bash
npm run dev
```

Открой:

http://localhost:5173

## Скрипты

| Команда | Описание |
|---|---|
| `npm run dev` | Dev-сервер с HMR |
| `npm run build` | Production-сборка в `dist/` |
| `npm run preview` | Просмотр прод-сборки (нужно для теста PWA) |
| `npm run lint` | ESLint |

## Переменные окружения

| Переменная | Значение по умолчанию | Описание |
|---|---|---|
| `VITE_API_URL` | `/api/v1` | Базовый URL API |
| `VITE_STORAGE_URL` | `/storage` | Базовый URL файлов |

В dev-режиме запросы идут через Vite-прокси, поэтому относительные пути работают из коробки.

## PWA

Service Worker регистрируется автоматически при загрузке.

В dev-режиме `vite-plugin-pwa` отключён.

### Тестирование PWA

```bash
npm run build
npm run preview
```

Открой:

http://localhost:4173

В DevTools → **Application** проверь:

- **Manifest** — название, иконки, `standalone`
- **Service Workers** — активирован
- **Cache Storage**:
  - `api-cache`
  - `user-media`
  - `mp-model`
  - `mediapipe-wasm`

## MediaPipe

Модель **Face Landmarker** (`face_landmarker.task`, ~3 МБ) лежит в:

```text
public/models/
```

Модель загружается один раз при заходе на `/analysis` и кэшируется в Service Worker на год.

Если модели нет — скачай её:

```bash
curl -o public/models/face_landmarker.task \
  https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task
```

## Сборка иконок и splash-экранов PWA

В `public/` уже лежат сгенерированные иконки и splash-экраны.

Если меняешь логотип:

### Иконки

```bash
npx pwa-asset-generator ./logo.png ./public \
  --icon-only --favicon --type png --padding "10%"
```

### Splash для iPhone

```bash
npx pwa-asset-generator ./logo.png ./public/splashes \
  --splash-only --type png --background "#FAF6F1" --padding "30%"
```

## Тёмная тема

Переключается через `useThemeStore` (Zustand).

Доступные режимы:

- `light`
- `dark`
- `system`

Выбранная тема сохраняется в `localStorage`.

Для предотвращения антимигания используется inline-скрипт в `index.html`.

## Развёртывание в production

### Вариант 1 — статический хостинг

Собери проект:

```bash
npm run build
```

Папка `dist/` содержит готовую статику.

Разместить проект можно на:

- **Vercel** — `vercel deploy`
- **Netlify** — через drag-and-drop или CI
- **Cloudflare Pages** — автоматическая сборка из GitHub
- **Nginx** — `alias /var/www/skin-diary-frontend/dist/`

### Вариант 2 — Nginx

```nginx
server {
    listen 80;
    server_name app.example.com;

    root /var/www/skin-diary-frontend/dist;
    index index.html;

    # SPA-fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Прокси к API
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /storage/ {
        proxy_pass http://127.0.0.1:8000/storage/;
    }

    # Кэширование статики
    location ~* \.(js|css|png|jpg|jpeg|webp|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Вариант 3 — Docker + Nginx

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## HTTPS

PWA обязательно требует HTTPS, за исключением `localhost`.

На Vercel и Netlify HTTPS выдаётся автоматически.

Для Nginx используй Certbot:

```bash
sudo certbot --nginx -d app.example.com
```

## Проблемы

### `bg-primary` не работает

Перезапусти dev-сервер после изменения `tailwind.config.js`.

При необходимости удали:

```text
node_modules/.vite
```

### MediaPipe 403 на `odml.pa.googleapis.com`

Это телеметрия Google и она не влияет на работу приложения.

Можно игнорировать.

### PWA не устанавливается

Проверь:

- HTTPS;
- `manifest` через DevTools;
- наличие иконок `192x192` и `512x512`;
- наличие `maskable`-иконок.

### Splash-экраны не появляются на iOS

iOS кэширует старые splash-экраны.

Удалите приложение с домашнего экрана и добавьте его заново.

### Картинки не грузятся с backend

Проверь:

- `VITE_STORAGE_URL`;
- прокси `/storage` в `vite.config.ts`.

---

## 📄 `frontend/.env.example`

```env
VITE_API_URL=/api/v1
VITE_STORAGE_URL=/storage
```