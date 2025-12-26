import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, DsUserLoginRequest, DsUserRegisterRequest, DsUserUpdateRequest, DsUserResponse } from '../api';

// Интерфейс состояния авторизации
export interface AuthState {
    user: DsUserResponse | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

// Начальное состояние
const initialState: AuthState = {
    user: null,
    // ВАЖНО для ЛР7: Redux и storage «не связаны» — после F5 Redux стартует как гость,
    // но JWT может оставаться в localStorage/cookie (для Insomnia/Postman).
    isAuthenticated: false,
    loading: false,
    error: null,
};

// Асинхронное действие для авторизации
export const loginUserAsync = createAsyncThunk(
    'auth/loginUserAsync',
    async (credentials: DsUserLoginRequest, { rejectWithValue }) => {
        try {
            const response = await api.login.loginCreate(credentials);
            const data = response.data.data;

            if (data?.access_token) {
                // Сохраняем токен в localStorage
                localStorage.setItem('auth_token', data.access_token);
                return {
                    user: data.user || null,
                };
            }
            return rejectWithValue('Токен не получен');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Ошибка авторизации';
            return rejectWithValue(errorMessage);
        }
    }
);

// Асинхронное действие для регистрации
export const registerUserAsync = createAsyncThunk(
    'auth/registerUserAsync',
    async (userData: DsUserRegisterRequest, { rejectWithValue }) => {
        try {
            const response = await api.register.registerCreate(userData);
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Ошибка регистрации';
            return rejectWithValue(errorMessage);
        }
    }
);

// Асинхронное действие для выхода
export const logoutUserAsync = createAsyncThunk(
    'auth/logoutUserAsync',
    async (_, { rejectWithValue }) => {
        try {
            await api.logout.logoutCreate();
            // Удаляем токен из localStorage
            localStorage.removeItem('auth_token');
            return null;
        } catch (error: any) {
            // Даже если запрос не удался, очищаем локальное состояние
            localStorage.removeItem('auth_token');
            const errorMessage = error.response?.data?.message || 'Ошибка при выходе';
            return rejectWithValue(errorMessage);
        }
    }
);

// Асинхронное действие для получения профиля
export const getUserProfileAsync = createAsyncThunk(
    'auth/getUserProfileAsync',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.profile.profileList();
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Ошибка при получении профиля';
            return rejectWithValue(errorMessage);
        }
    }
);

// Асинхронное действие для обновления профиля
export const updateUserProfileAsync = createAsyncThunk(
    'auth/updateUserProfileAsync',
    async (userData: DsUserUpdateRequest, { rejectWithValue }) => {
        try {
            await api.profile.profileUpdate(userData);
            // После обновления получаем актуальный профиль
            const profileResponse = await api.profile.profileList();
            return profileResponse.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Ошибка при обновлении профиля';
            return rejectWithValue(errorMessage);
        }
    }
);

// Создаем slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Сброс ошибки
        clearError: (state) => {
            state.error = null;
        },
        // Сброс состояния авторизации
        resetAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('auth_token');
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUserAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUserAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUserAsync.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            })
            // Register
            .addCase(registerUserAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUserAsync.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(registerUserAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Logout
            .addCase(logoutUserAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUserAsync.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutUserAsync.rejected, (state, action) => {
                state.loading = false;
                // Даже при ошибке очищаем состояние
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            })
            // Get Profile
            .addCase(getUserProfileAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserProfileAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(getUserProfileAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Profile
            .addCase(updateUserProfileAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfileAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(updateUserProfileAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// Экспортируем actions
export const { clearError, resetAuth } = authSlice.actions;

// Хук для получения состояния авторизации (используется в компонентах через useSelector)

// Экспортируем reducer
export default authSlice.reducer;

