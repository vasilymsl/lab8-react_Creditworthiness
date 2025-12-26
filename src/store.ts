import { combineReducers, configureStore } from "@reduxjs/toolkit";
import filterReducer from "./slices/filterSlice";
import authReducer from "./slices/authSlice";
import applicationReducer from "./slices/applicationSlice";
import servicesReducer from "./slices/servicesSlice";

// Объединяем редьюсеры
const rootReducer = combineReducers({
    filter: filterReducer,
    auth: authReducer,
    application: applicationReducer,
    services: servicesReducer,
});

// Создаем store
const store = configureStore({
    reducer: rootReducer,
    // Для защиты/скриншотов (в т.ч. при запуске через docker build) оставляем Redux DevTools включённым.
    devTools: true,
});

// Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

