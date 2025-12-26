import { ServiceListResponse } from "./api";

// Заглушка-картинка для mock данных (SVG с иконкой)
const mockImage = (emoji: string, color: string) => 
    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='${encodeURIComponent(color)}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80'%3E${emoji}%3C/text%3E%3C/svg%3E`;

export const SERVICES_MOCK: ServiceListResponse = {
    Total: 5,
    Orders: [
        {
            ID: 1,
            Title: "Базовый скоринг заемщика",
            Icon: "📊",
            ImageURL: mockImage("📊", "#e8f4fd"),
            Rate: "до 87%",
            Term: "< 2 сек",
            Amount: "",
            Description: "Базовый скоринг — универсальная модель анализа кредитоспособности для массовых заемщиков. Система мгновенно оценивает платежеспособность, долговую нагрузку и риски невозврата.",
            SumFrom: 0,
            CreatedAt: "2023-01-01T00:00:00Z"
        },
        {
            ID: 2,
            Title: "Анализ транзакций",
            Icon: "💳",
            ImageURL: mockImage("💳", "#fff4e6"),
            Rate: "до 92%",
            Term: "до 10 дней",
            Amount: "",
            Description: "Модель глубоко анализирует транзакционную активность заемщика: уровень доходов, стабильность поступлений, структуру расходов.",
            SumFrom: 0,
            CreatedAt: "2023-01-02T00:00:00Z"
        },
        {
            ID: 3,
            Title: "Залоговый скоринг",
            Icon: "🏠",
            ImageURL: mockImage("🏠", "#e6f9e6"),
            Rate: "до 90%",
            Term: "до 3 дней",
            Amount: "",
            Description: "Модель анализирует кредитоспособность заемщика с учётом характеристик залогового имущества: рыночная стоимость, ликвидность.",
            SumFrom: 0,
            CreatedAt: "2023-01-03T00:00:00Z"
        },
        {
            ID: 4,
            Title: "Ипотечный скоринг",
            Icon: "🏦",
            ImageURL: mockImage("🏦", "#f0e6ff"),
            Rate: "до 94%",
            Term: "до 5 дней",
            Amount: "",
            Description: "Ипотечный скоринг — модель премиального уровня для оценки заемщиков по крупным кредитам на недвижимость.",
            SumFrom: 0,
            CreatedAt: "2023-01-04T00:00:00Z"
        },
        {
            ID: 5,
            Title: "Скоринг самозанятых",
            Icon: "👨‍💼",
            ImageURL: mockImage("👨‍💼", "#fff0f0"),
            Rate: "до 89%",
            Term: "мгновенно",
            Amount: "",
            Description: "Скоринг создан для заемщиков без подтверждённых справок о доходах. Модель оценивает реальную выручку и налоговую дисциплину.",
            SumFrom: 0,
            CreatedAt: "2023-01-05T00:00:00Z"
        }
    ]
};

