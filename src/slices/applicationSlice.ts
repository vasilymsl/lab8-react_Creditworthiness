import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    api,
    DsApplicationBasketResponse,
    DsApplicationListResponse,
    DsApplicationProductDTO,
    DsApplicationResponse,
    DsApplicationUpdateRequest,
    DsSuccessResponse,
    DsUpdateApplicationProductRequest,
    ScoringApplicationsListParams,
} from '../api';

// Типы из swagger-codegen (ЛР7)
export type ApplicationProduct = DsApplicationProductDTO;
export type Application = DsApplicationResponse;
export type ApplicationBasket = DsApplicationBasketResponse;
export type ApplicationUpdateRequest = DsApplicationUpdateRequest;
export type ApplicationProductUpdateRequest = DsUpdateApplicationProductRequest;
export type ApplicationListResponse = DsApplicationListResponse;

// Интерфейс состояния заявок
export interface ApplicationState {
    draftApplicationId: number | null;
    productCount: number;
    applications: Application[];
    currentApplication: Application | null;
    loading: boolean;
    error: string | null;
}

// Начальное состояние
const initialState: ApplicationState = {
    draftApplicationId: null,
    productCount: 0,
    applications: [],
    currentApplication: null,
    loading: false,
    error: null,
};

// Асинхронное действие для получения корзины
export const getScoringApplicationBasketAsync = createAsyncThunk(
    'scoring/getScoringApplicationBasketAsync',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.scoringApplications.scoringApplicationsBasket();
            return response.data as ApplicationBasket;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Ошибка при получении корзины';
            return rejectWithValue(errorMessage);
        }
    }
);

// Асинхронное действие для получения списка заявок
export const getScoringApplicationsAsync = createAsyncThunk(
    'scoring/getScoringApplicationsAsync',
    async (params: ScoringApplicationsListParams | { status?: string; date_from?: string; date_to?: string } = {}, { rejectWithValue }) => {
        try {
            const response = await api.scoringApplications.scoringApplicationsList(params as any);
            return response.data as ApplicationListResponse;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Ошибка при получении списка заявок';
            return rejectWithValue(errorMessage);
        }
    }
);

// Асинхронное действие для получения одной заявки
export const getScoringApplicationAsync = createAsyncThunk(
    'scoring/getScoringApplicationAsync',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await api.scoringApplications.scoringApplicationById({ id });
            return response.data as Application;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Ошибка при получении заявки';
            return rejectWithValue(errorMessage);
        }
    }
);

// Асинхронное действие для обновления заявки
export const updateScoringApplicationAsync = createAsyncThunk(
    'scoring/updateScoringApplicationAsync',
    async ({ id, data }: { id: number; data: ApplicationUpdateRequest }, { rejectWithValue }) => {
        try {
            // PUT обновляет только поля и может вернуть data без products,
            // поэтому после успешного PUT делаем GET /applications/:id для полного объекта.
            await api.scoringApplications.scoringApplicationsUpdate({ id }, data);
            const full = await api.scoringApplications.scoringApplicationById({ id });
            return full.data as Application;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Ошибка при обновлении заявки';
            return rejectWithValue(errorMessage);
        }
    }
);

// Асинхронное действие для формирования заявки
export const formScoringApplicationAsync = createAsyncThunk(
    'scoring/formScoringApplicationAsync',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await api.scoringApplications.scoringApplicationsForm({ id });
            const body = response.data as DsSuccessResponse;
            return (body.data || null) as Application | null;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Ошибка при формировании заявки';
            return rejectWithValue(errorMessage);
        }
    }
);

// Асинхронное действие для удаления заявки
export const deleteScoringApplicationAsync = createAsyncThunk(
    'scoring/deleteScoringApplicationAsync',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.scoringApplications.scoringApplicationsDelete({ id });
            return id;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Ошибка при удалении заявки';
            return rejectWithValue(errorMessage);
        }
    }
);

// Асинхронное действие для добавления продукта в заявку
export const addScoringServiceToApplicationAsync = createAsyncThunk(
    'scoring/addScoringServiceToApplicationAsync',
    async (creditId: number, { rejectWithValue, dispatch }) => {
        try {
            await api.scoringModels.addScoringModelToApplication({ id: creditId });
            // После добавления обновляем корзину
            await dispatch(getScoringApplicationBasketAsync());
            return creditId;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Ошибка при добавлении продукта';
            return rejectWithValue(errorMessage);
        }
    }
);

// Асинхронное действие для удаления продукта из заявки
export const removeScoringServiceFromApplicationAsync = createAsyncThunk(
    'scoring/removeScoringServiceFromApplicationAsync',
    async ({ appId, creditId }: { appId: number; creditId: number }, { rejectWithValue, dispatch }) => {
        try {
            await api.scoringApplicationServices.scoringApplicationServiceDelete({ appId, creditId });
            // Обновляем текущую заявку
            await dispatch(getScoringApplicationAsync(appId));
            // Обновляем корзину, чтобы бейдж на иконке обновился сразу
            await dispatch(getScoringApplicationBasketAsync());
            return { appId, creditId };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Ошибка при удалении продукта';
            return rejectWithValue(errorMessage);
        }
    }
);

// Асинхронное действие для обновления продукта в заявке
export const updateScoringServiceParamsAsync = createAsyncThunk(
    'scoring/updateScoringServiceParamsAsync',
    async (
        { appId, creditId, data }: { appId: number; creditId: number; data: ApplicationProductUpdateRequest },
        { rejectWithValue, dispatch }
    ) => {
        try {
            await api.scoringApplicationServices.scoringApplicationServiceParamsUpdate({ appId, creditId }, data);
            // Обновляем текущую заявку
            await dispatch(getScoringApplicationAsync(appId));
            return { appId, creditId, data };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Ошибка при обновлении продукта';
            return rejectWithValue(errorMessage);
        }
    }
);

// Создаем slice
const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        // Сброс ошибки
        clearError: (state) => {
            state.error = null;
        },
        // Сброс текущей заявки
        clearCurrentApplication: (state) => {
            state.currentApplication = null;
        },
        // Сброс состояния заявок
        resetApplication: (state) => {
            state.draftApplicationId = null;
            state.productCount = 0;
            state.applications = [];
            state.currentApplication = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Basket
            .addCase(getScoringApplicationBasketAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getScoringApplicationBasketAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.draftApplicationId = action.payload.application_id ?? null;
                state.productCount = action.payload.product_count ?? 0;
                state.error = null;
            })
            .addCase(getScoringApplicationBasketAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Get Applications List
            .addCase(getScoringApplicationsAsync.pending, (state) => {
                // Не показываем loading при polling, чтобы не было мигания
                if (state.applications.length === 0) {
                    state.loading = true;
                }
                state.error = null;
            })
            .addCase(getScoringApplicationsAsync.fulfilled, (state, action) => {
                state.loading = false;
                const newApplications = action.payload.applications || [];
                
                // ЛР8: Умный short polling - обновляем только если данные реально изменились
                // Сравниваем массивы по ключевым полям
                const hasChanges = (
                    state.applications.length !== newApplications.length ||
                    newApplications.some((newApp, index) => {
                        const oldApp = state.applications.find(a => a.id === newApp.id);
                        if (!oldApp) return true; // Новая заявка
                        
                        // Сравниваем важные поля, которые могут измениться при async обработке
                        return (
                            oldApp.total_amount !== newApp.total_amount ||
                            oldApp.scoring_result !== newApp.scoring_result ||
                            oldApp.status !== newApp.status ||
                            oldApp.max_credit_amount !== newApp.max_credit_amount ||
                            oldApp.credit_score !== newApp.credit_score
                        );
                    })
                );
                
                // Обновляем state только если есть реальные изменения
                if (hasChanges) {
                    console.log('[ЛР8 Polling] Обнаружены изменения, обновляем state');
                    state.applications = newApplications;
                } else {
                    console.log('[ЛР8 Polling] Данные не изменились, пропускаем обновление');
                }
                
                state.error = null;
            })
            .addCase(getScoringApplicationsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Get Application
            .addCase(getScoringApplicationAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getScoringApplicationAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.currentApplication = action.payload;
                state.error = null;
            })
            .addCase(getScoringApplicationAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Application
            .addCase(updateScoringApplicationAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateScoringApplicationAsync.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                state.currentApplication = updated;
                // Обновляем в списке, если есть
                if (updated?.id) {
                    const index = state.applications.findIndex((app) => app.id === updated.id);
                    if (index !== -1) {
                        state.applications[index] = updated;
                    }
                }
                state.error = null;
            })
            .addCase(updateScoringApplicationAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Form Application
            .addCase(formScoringApplicationAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(formScoringApplicationAsync.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                if (updated) {
                    state.currentApplication = updated;
                    // Обновляем в списке
                    if (updated.id) {
                        const index = state.applications.findIndex((app) => app.id === updated.id);
                        if (index !== -1) {
                            state.applications[index] = updated;
                        }
                    }
                }
                state.error = null;
            })
            .addCase(formScoringApplicationAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete Application
            .addCase(deleteScoringApplicationAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteScoringApplicationAsync.fulfilled, (state, action) => {
                state.loading = false;
                // Удаляем из списка
                state.applications = state.applications.filter((app) => app.id !== action.payload);
                // Если удалили текущую заявку, очищаем
                if (state.currentApplication?.id === action.payload) {
                    state.currentApplication = null;
                }
                // Если удалили черновик, очищаем корзину
                if (state.draftApplicationId === action.payload) {
                    state.draftApplicationId = null;
                    state.productCount = 0;
                }
                state.error = null;
            })
            .addCase(deleteScoringApplicationAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add Product
            .addCase(addScoringServiceToApplicationAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addScoringServiceToApplicationAsync.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(addScoringServiceToApplicationAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Remove Product
            .addCase(removeScoringServiceFromApplicationAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeScoringServiceFromApplicationAsync.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(removeScoringServiceFromApplicationAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Product
            .addCase(updateScoringServiceParamsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateScoringServiceParamsAsync.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(updateScoringServiceParamsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// Экспортируем actions
export const { clearError, clearCurrentApplication, resetApplication } = applicationSlice.actions;

// Экспортируем reducer
export default applicationSlice.reducer;

