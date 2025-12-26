import axios, { AxiosError } from "axios";
import { Api, HttpClient } from "./generated/Api";
import { dest_api } from "../target_config";

/**
 * Единая точка входа для обращения к API (ЛР7):
 * - Сгенерированный клиент (swagger-typescript-api)
 * - Axios interceptors для подстановки JWT из localStorage
 */

const axiosInstance = axios.create({
  baseURL: dest_api,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // По требованию ЛР7: токен живет в хранилище. Чистим при 401/403.
      localStorage.removeItem("auth_token");
    }
    return Promise.reject(error);
  },
);

const httpClient = new HttpClient({
  baseURL: dest_api,
});

// Важно: подменяем внутренний axios инстанс на наш (с interceptors)
httpClient.instance = axiosInstance;

export const api = new Api(httpClient);

export * from "./generated/Api";


