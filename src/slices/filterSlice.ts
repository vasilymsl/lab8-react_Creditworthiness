import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";

// Интерфейс состояния фильтра
export interface FilterState {
    title: string;
    dateFrom: string;
    dateTo: string;
    priceMin: string;
    priceMax: string;
}

// Начальное состояние фильтра
const initialState: FilterState = {
    title: '',
    dateFrom: '',
    dateTo: '',
    priceMin: '',
    priceMax: '',
};

// Создаем slice для фильтров
const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        // Установить значение названия
        setTitle(state, action: PayloadAction<string>) {
            state.title = action.payload;
        },
        // Установить дату "от"
        setDateFrom(state, action: PayloadAction<string>) {
            state.dateFrom = action.payload;
        },
        // Установить дату "до"
        setDateTo(state, action: PayloadAction<string>) {
            state.dateTo = action.payload;
        },
        // Установить минимальную цену
        setPriceMin(state, action: PayloadAction<string>) {
            state.priceMin = action.payload;
        },
        // Установить максимальную цену
        setPriceMax(state, action: PayloadAction<string>) {
            state.priceMax = action.payload;
        },
        // Установить все значения фильтра сразу
        setFilter(state, action: PayloadAction<FilterState>) {
            state.title = action.payload.title;
            state.dateFrom = action.payload.dateFrom;
            state.dateTo = action.payload.dateTo;
            state.priceMin = action.payload.priceMin;
            state.priceMax = action.payload.priceMax;
        },
        // Сбросить фильтр к начальным значениям
        resetFilter(state) {
            state.title = '';
            state.dateFrom = '';
            state.dateTo = '';
            state.priceMin = '';
            state.priceMax = '';
        },
    },
});

// Хук для получения состояния фильтра
export const useFilter = () => 
    useSelector((state: RootState) => state.filter);

// Экспортируем actions
export const {
    setTitle: setTitleAction,
    setDateFrom: setDateFromAction,
    setDateTo: setDateToAction,
    setPriceMin: setPriceMinAction,
    setPriceMax: setPriceMaxAction,
    setFilter: setFilterAction,
    resetFilter: resetFilterAction,
} = filterSlice.actions;

// Экспортируем reducer по умолчанию
export default filterSlice.reducer;

