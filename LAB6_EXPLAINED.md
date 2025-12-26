# Лабораторная 6 — Что тут произошло

## Цель
Сделать фронтенд "взрослым": добавить менеджер состояний, адаптивность, PWA и собрать нативное приложение.

---

## 1. Redux Toolkit — зачем и как

**Проблема:** Фильтр на странице услуг сбрасывается при переходе на другую страницу.

**Решение:** Redux — глобальное хранилище состояния.

```
Пользователь вводит фильтр
        ↓
    dispatch(action)     →  отправляем действие
        ↓
    reducer              →  обновляет состояние
        ↓
    store                →  хранит новое состояние
        ↓
    useSelector          →  компоненты получают данные
```

**Файлы:**
- `src/store.ts` — создание хранилища
- `src/slices/filterSlice.ts` — логика фильтра (состояние + actions)
- `src/main.tsx` — оборачиваем приложение в `<Provider>`

**Результат:** Ввёл фильтр → ушёл на главную → вернулся → фильтр на месте!

---

## 2. PWA — Progressive Web App

**Что это:** Веб-сайт, который можно "установить" как приложение на телефон.

**Что нужно:**
1. `manifest.json` — имя, иконки, цвета
2. Service Worker — кеширует файлы для офлайн-работы

**Как сделано:**
- Плагин `vite-plugin-pwa` генерирует всё автоматически
- Настройки в `vite.config.ts`
- Иконки в `public/logo192.png` и `public/logo512.png`

**Результат:** На телефоне появляется кнопка "Установить приложение".

---

## 3. GitHub Pages — деплой

**Что это:** Бесплатный хостинг от GitHub для статических сайтов.

**Настройки:**
- `vite.config.ts`: `base: "/credit-scoring-system-"` — путь к репозиторию
- `App.tsx`: `basename="/credit-scoring-system-"` — для роутера
- `package.json`: `"deploy": "gh-pages -d dist"` — команда деплоя

**Деплой:**
```bash
npm run build   # собрать
npm run deploy  # задеплоить
```

**Результат:** Сайт доступен по `https://vasilymsl.github.io/credit-scoring-system-/`

---

## 4. Адаптивность — под разные экраны

**Идея:** На большом экране — 3 карточки в ряд, на планшете — 2, на телефоне — 1.

**Как работает (src/index.css):**

```css
/* По умолчанию: 3 колонки */
.service-card-wrapper {
    flex: 1 1 calc(33.333% - 20px);  /* ~33% ширины */
}

/* Планшет (≤1024px): 2 колонки */
@media (max-width: 1024px) {
    .service-card-wrapper {
        flex: 1 1 calc(50% - 20px);  /* 50% ширины */
    }
}

/* Телефон (≤768px): 1 колонка */
@media (max-width: 768px) {
    .service-card-wrapper {
        flex: 1 1 100%;              /* вся ширина */
    }
}
```

**Результат:** Открываешь DevTools → меняешь ширину → карточки перестраиваются.

---

## 5. Tauri — нативное приложение

**Что это:** Фреймворк для создания desktop-приложений из веб-кода.
- Ядро на Rust (быстро, мало весит)
- Интерфейс — наш React

**Структура:**
```
src-tauri/
├── tauri.conf.json    ← настройки приложения
├── Cargo.toml         ← зависимости Rust
├── capabilities/      ← разрешения (HTTP и т.д.)
└── src/lib.rs         ← точка входа Rust
```

**Подключение к бэкенду по IP:**

Файл `src/target_config.ts`:
```typescript
export const target_tauri = true;                        // для Tauri
export const api_server_ip = "http://192.168.1.100:8080"; // IP сервера
```

**Сборка:**
```bash
npm run tauri build
```

**Результат:** Готовое приложение в `src-tauri/target/release/bundle/`

---

## 6. HTTPS локально

**Зачем:** PWA и Service Worker требуют HTTPS (кроме localhost).

**Как:** Плагин `vite-plugin-mkcert` создаёт локальный сертификат.

**Результат:** `npm run dev` открывает `https://localhost:3000` с замочком 🔒

---

## Итого — что изменилось

| До | После |
|----|-------|
| Фильтр сбрасывается | Redux хранит фильтр |
| Только в браузере | PWA на телефоне |
| Только localhost | GitHub Pages |
| Фиксированная вёрстка | Адаптивная под все экраны |
| Только веб | Нативное Tauri приложение |
| HTTP | HTTPS |

---

## Команды на каждый день

```bash
# Разработка (HTTPS)
npm run dev

# Сборка для GitHub Pages
npm run build && npm run deploy

# Сборка Tauri
npm run tauri build

# Запуск Tauri в dev-режиме
npm run tauri dev
```

---

## Файлы, которые стоит знать

```
src/
├── store.ts              ← Redux store
├── target_config.ts      ← переключатель Tauri/Web
├── slices/
│   └── filterSlice.ts    ← Redux slice для фильтра
├── index.css             ← адаптивные стили
└── App.tsx               ← роутинг с basename

vite.config.ts            ← PWA, HTTPS, base path
src-tauri/
└── tauri.conf.json       ← настройки Tauri
```

