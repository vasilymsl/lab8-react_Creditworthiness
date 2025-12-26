import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  api,
  DsOrderListResponse,
  DsOrderResponse,
  ScoringModelsListParams,
} from "../api";

export interface ScoringModelsQuery {
  title?: string;
  date_from?: string;
  date_to?: string;
  price_min?: number;
  price_max?: number;
}

export interface ServicesState {
  scoringModels: DsOrderResponse[];
  total: number;
  currentScoringModel: DsOrderResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  scoringModels: [],
  total: 0,
  currentScoringModel: null,
  loading: false,
  error: null,
};

// По теме: скоринговые модели/услуги. Технически API модуль называется credits (/credits),
// но thunk-и называем как scoring для скринов и читаемости.
export const getScoringModelByIdAsync = createAsyncThunk(
  "scoring/getScoringModelByIdAsync",
  async (id: number, { rejectWithValue }) => {
    try {
      const resp = await api.scoringModels.scoringModelById({ id });
      return resp.data as DsOrderResponse;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Ошибка при загрузке услуги";
      return rejectWithValue(msg);
    }
  },
);

export const getScoringModelsAsync = createAsyncThunk(
  "scoring/getScoringModelsAsync",
  async (query: ScoringModelsListParams | ScoringModelsQuery | undefined, { rejectWithValue }) => {
    try {
      const resp = await api.scoringModels.scoringModelsList((query as any) || {});
      return resp.data as DsOrderListResponse;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Ошибка при загрузке списка скоринговых моделей";
      return rejectWithValue(msg);
    }
  },
);

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentScoringModel: (state) => {
      state.currentScoringModel = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getScoringModelsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getScoringModelsAsync.fulfilled,
        (state, action: PayloadAction<DsOrderListResponse>) => {
          state.loading = false;
          state.scoringModels = action.payload.orders || [];
          state.total = action.payload.total || 0;
          state.error = null;
        },
      )
      .addCase(getScoringModelsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getScoringModelByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getScoringModelByIdAsync.fulfilled,
        (state, action: PayloadAction<DsOrderResponse>) => {
          state.loading = false;
          state.currentScoringModel = action.payload;
          state.error = null;
        },
      )
      .addCase(getScoringModelByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentScoringModel } = servicesSlice.actions;
export default servicesSlice.reducer;


