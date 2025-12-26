/**
 * Конфигурация для Tauri и web-приложения
 * 
 * При сборке Tauri build нужно установить target_tauri = true
 * и указать IP адрес сервера в локальной сети
 */

// Флаг: true для Tauri build, false для web (GitHub Pages, dev)
// !!! ВАЖНО: Для web/Docker установить false, для Tauri build - true !!!
export const target_tauri = false;

// IP адрес сервера в локальной сети (ZeroTier IP!)
export const server_ip = "10.132.70.120"; // ZeroTier IP Mac

// IP адрес API сервера
export const api_server_ip = `http://${server_ip}:8080`;

// IP адрес async Django сервиса (ЛР8)
export const async_server_ip = `http://${server_ip}:8090`;

// IP адрес MinIO (для картинок)
// В Docker MinIO доступен через Nginx на порту 9002
export const minio_server_ip = `http://${server_ip}:9002`;

// Путь к API для разных режимов
// Для Tauri нужен полный путь с /api, для web - просто /api (через прокси)
export const dest_api = target_tauri ? `${api_server_ip}/api` : "/api";

// URL async-сервиса для вызова его HTTP метода из UI (ЛР8)
// В web/dev обычно удобно использовать localhost, в Tauri/ZeroTier — server_ip.
export const dest_async = target_tauri ? async_server_ip : "http://localhost:8090";

// Базовый путь для роутера (пустой для Tauri, с именем репо для GitHub Pages)
// Важно: этот файл импортируется и в vite.config.ts (Node окружение),
// поэтому нельзя напрямую обращаться к import.meta.env.DEV без проверки.
const isDev = (import.meta as any)?.env?.DEV === true;
export const dest_root = target_tauri ? "" : (isDev ? "" : "/credit-scoring-system-");

/**
 * Преобразует URL картинки для ZeroTier и Tauri
 * Заменяет localhost:9000 на реальный IP MinIO (через Nginx на порту 9002)
 * ТОЛЬКО если запрос идёт НЕ с localhost (т.е. с телефона по ZeroTier)
 */
export const transformImageUrl = (url: string | undefined): string => {
    if (!url) return "";
    
    // Проверяем, откуда открыта страница
    const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    
    // Если открыто с localhost/127.0.0.1 - оставляем localhost:9000 (для Mac)
    // Если открыто с ZeroTier IP - заменяем на ZeroTier IP:9002 (для телефона)
    if (currentHostname === 'localhost' || currentHostname === '127.0.0.1') {
        return url; // Оставляем как есть: http://localhost:9000/...
    } else {
        // Заменяем localhost:9000 на ZeroTier IP:9002
        return url.replace("http://localhost:9000", minio_server_ip);
    }
};

