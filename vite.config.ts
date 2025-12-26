import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import { target_tauri } from './src/target_config'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  // HTTPS только для локальной разработки (не в Docker)
  const isDocker = env.VITE_API_TARGET?.includes('app:') || process.env.DOCKER === 'true'
  
  // Base path:
  // - "./" для Tauri
  // - "/" для dev (в т.ч. docker), чтобы не было редиректов и белого экрана из-за неверного base
  // - "/credit-scoring-system-" для GitHub Pages build
  const basePath = target_tauri ? "./" : (mode === "development" ? "/" : "/credit-scoring-system-")
  
  // HTTPS сертификаты (сгенерированы через mkcert)
  const httpsConfig = (!isDocker && !target_tauri && fs.existsSync('./cert.pem')) ? {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
  } : false
  
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          // В dev SW часто мешает (кеш/обновления -> белый экран). Для демонстрации ЛР7 нам важнее стабильность.
          enabled: false,
        },
        manifest: {
          name: "Оценка кредитоспособности",
          short_name: "Скоринг",
          start_url: target_tauri ? "/" : "/credit-scoring-system-/",
          display: "standalone",
          background_color: "#F5F6FA",
          theme_color: "#0b1f35",
          orientation: "portrait-primary",
          icons: [
            {
              src: target_tauri ? "/logo192.png" : "/credit-scoring-system-/logo192.png",
              type: "image/png",
              sizes: "192x192"
            },
            {
              src: target_tauri ? "/logo512.png" : "/credit-scoring-system-/logo512.png",
              type: "image/png",
              sizes: "512x512"
            }
          ],
        },
      })
    ],
    base: basePath,
    server: {
      port: 3000,
      https: httpsConfig, // HTTPS с сертификатами mkcert
      proxy: {
        "/api": {
          target: env.VITE_API_TARGET || "http://localhost:8080",
          changeOrigin: true,
        },
      },
      host: true,
      watch: {
        usePolling: true
      }
    },
  }
})

