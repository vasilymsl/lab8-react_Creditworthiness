/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DsErrorResponse {
  message?: string;
  status?: string;
}

export interface DsSuccessResponse {
  data?: any;
  message?: string;
  status?: string;
}

export interface DsOrderResponse {
  amount?: string;
  created_at?: string;
  description?: string;
  feature1?: string;
  feature2?: string;
  feature3?: string;
  icon?: string;
  id?: number;
  image_url?: string;
  rate?: string;
  status?: string;
  term?: string;
  title?: string;
  updated_at?: string;
}

export interface DsOrderListResponse {
  orders?: DsOrderResponse[];
  total?: number;
}

export interface DsApplicationProductDTO {
  credit_id?: number;
  credit_title?: string;
  id?: number;
  image_url?: string;
  interest_rate?: number;
  monthly_payment?: number;
  requested_amount?: number;
  requested_term_days?: number;
}

export interface DsApplicationResponse {
  completed_at?: string;
  created_at?: string;
  creator_id?: number;
  creator_login?: string;
  credit_score?: number;
  formed_at?: string;
  full_name?: string;
  id?: number;
  income?: number;
  max_credit_amount?: number;
  moderator_id?: number;
  moderator_login?: string;
  obligations?: number;
  products?: DsApplicationProductDTO[];
  rejection_reason?: string;
  scoring_result?: string;
  status?: string;
  total_amount?: number;
}

export interface DsApplicationListResponse {
  applications?: DsApplicationResponse[];
  total?: number;
}

export interface DsApplicationBasketResponse {
  application_id?: number;
  product_count?: number;
}

export interface DsApplicationUpdateRequest {
  full_name?: string;
  income?: number;
  obligations?: number;
}

export interface DsUpdateApplicationProductRequest {
  interest_rate?: number;
  monthly_payment?: number;
  requested_amount?: number;
  requested_term_days?: number;
}

export interface DsUserLoginRequest {
  password: string;
  username: string;
}

export interface DsUserRegisterRequest {
  email: string;
  full_name?: string;
  /** @minLength 6 */
  password: string;
  phone?: string;
  /**
   * @minLength 3
   * @maxLength 50
   */
  username: string;
}

export interface DsUserResponse {
  created_at?: string;
  email?: string;
  full_name?: string;
  id?: number;
  is_moderator?: boolean;
  phone?: string;
  username?: string;
}

export interface DsUserUpdateRequest {
  email?: string;
  full_name?: string;
  /** @minLength 6 */
  password?: string;
  phone?: string;
}

export interface CreditsListParams {
  /** Фильтр по названию */
  title?: string;
  /** Дата создания от (YYYY-MM-DD) */
  date_from?: string;
  /** Дата создания до (YYYY-MM-DD) */
  date_to?: string;
  /** Минимальная цена (price_min) */
  price_min?: number;
  /** Максимальная цена (price_max) */
  price_max?: number;
}

export interface CreditsDetailParams {
  /** ID услуги */
  id: number;
}

export interface AddToApplicationCreateParams {
  /** ID услуги (credit) */
  id: number;
}

export interface ApplicationsListParams {
  /** Фильтр по статусу */
  status?: string;
  /** Дата формирования/создания от (YYYY-MM-DD) */
  date_from?: string;
  /** Дата формирования/создания до (YYYY-MM-DD) */
  date_to?: string;
}

export interface ApplicationsDetailParams {
  /** ID заявки */
  id: number;
}

export interface ApplicationsUpdateParams {
  /** ID заявки */
  id: number;
}

export interface ApplicationsDeleteParams {
  /** ID заявки */
  id: number;
}

export interface FormUpdateParams {
  /** ID заявки */
  id: number;
}

export interface ApplicationProductsUpdateParams {
  /** ID заявки */
  appId: number;
  /** ID услуги (credit) */
  creditId: number;
}

export interface ApplicationProductsDeleteParams {
  /** ID заявки */
  appId: number;
  /** ID услуги (credit) */
  creditId: number;
}

export namespace Login {
  /**
 * @description Выполняет вход пользователя в систему и возвращает JWT токен
 * @tags login
 * @name LoginCreate
 * @summary Аутентификация пользователя
 * @request POST:/users/login
 * @response `200` `{
    data?: {
    access_token?: string,
    expires_in?: number,
    token_type?: string,
    user?: DsUserResponse,

},
    message?: string,
    status?: string,

}` Успешная аутентификация
 * @response `400` `DsErrorResponse` Некорректные данные
 * @response `401` `DsErrorResponse` Неверные учетные данные
 * @response `500` `DsErrorResponse` Внутренняя ошибка сервера
*/
  export namespace LoginCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DsUserLoginRequest;
    export type RequestHeaders = {};
    export type ResponseBody = {
      data?: {
        access_token?: string;
        expires_in?: number;
        token_type?: string;
        user?: DsUserResponse;
      };
      message?: string;
      status?: string;
    };
  }
}

export namespace Logout {
  /**
   * @description Завершает сессию пользователя и добавляет токен в blacklist
   * @tags logout
   * @name LogoutCreate
   * @summary Выход из системы
   * @request POST:/users/logout
   * @secure
   * @response `200` `DsSuccessResponse` Успешный выход
   * @response `401` `DsErrorResponse` Требуется авторизация
   */
  export namespace LogoutCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DsSuccessResponse;
  }
}

export namespace Profile {
  /**
   * @description Возвращает профиль текущего авторизованного пользователя
   * @tags profile
   * @name ProfileList
   * @summary Получить профиль пользователя
   * @request GET:/users/profile
   * @secure
   * @response `200` `DsUserResponse` Профиль пользователя
   * @response `401` `DsErrorResponse` Требуется авторизация
   * @response `404` `DsErrorResponse` Пользователь не найден
   */
  export namespace ProfileList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DsUserResponse;
  }

  /**
   * @description Обновляет данные профиля текущего пользователя
   * @tags profile
   * @name ProfileUpdate
   * @summary Обновить профиль пользователя
   * @request PUT:/users/profile
   * @secure
   * @response `200` `DsSuccessResponse` Профиль успешно обновлен
   * @response `400` `DsErrorResponse` Некорректные данные
   * @response `401` `DsErrorResponse` Требуется авторизация
   * @response `404` `DsErrorResponse` Пользователь не найден
   * @response `500` `DsErrorResponse` Внутренняя ошибка сервера
   */
  export namespace ProfileUpdate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DsUserUpdateRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DsSuccessResponse;
  }
}

export namespace Register {
  /**
   * @description Создает нового пользователя в системе
   * @tags register
   * @name RegisterCreate
   * @summary Регистрация нового пользователя
   * @request POST:/users/register
   * @response `201` `DsSuccessResponse` Пользователь успешно зарегистрирован
   * @response `400` `DsErrorResponse` Некорректные данные
   * @response `409` `DsErrorResponse` Пользователь уже существует
   * @response `500` `DsErrorResponse` Внутренняя ошибка сервера
   */
  export namespace RegisterCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DsUserRegisterRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DsSuccessResponse;
  }
}

export namespace Credits {
  /**
   * @description Возвращает список услуг (кредитных продуктов) с фильтрацией
   * @tags credits
   * @name CreditsList
   * @summary Список услуг
   * @request GET:/credits
   * @response `200` `DsOrderListResponse` Список услуг
   * @response `500` `DsErrorResponse` Внутренняя ошибка сервера
   */
  export namespace CreditsList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Фильтр по названию */
      title?: string;
      /** Дата создания от (YYYY-MM-DD) */
      date_from?: string;
      /** Дата создания до (YYYY-MM-DD) */
      date_to?: string;
      /** Минимальная цена (price_min) */
      price_min?: number;
      /** Максимальная цена (price_max) */
      price_max?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DsOrderListResponse;
  }

  /**
   * @description Возвращает одну услугу по ID
   * @tags credits
   * @name CreditsDetail
   * @summary Получить услугу
   * @request GET:/credits/{id}
   * @response `200` `DsOrderResponse` Услуга
   * @response `404` `DsErrorResponse` Услуга не найдена
   * @response `500` `DsErrorResponse` Внутренняя ошибка сервера
   */
  export namespace CreditsDetail {
    export type RequestParams = {
      /** ID услуги */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DsOrderResponse;
  }

  /**
   * @description Добавляет услугу (credit) в текущую заявку пользователя, при необходимости создаёт черновик
   * @tags credits
   * @name AddToApplicationCreate
   * @summary Добавить услугу в заявку
   * @request POST:/credits/{id}/add-to-application
   * @secure
   * @response `200` `DsSuccessResponse` Услуга добавлена в заявку
   * @response `401` `DsErrorResponse` Требуется авторизация
   * @response `404` `DsErrorResponse` Услуга не найдена
   * @response `500` `DsErrorResponse` Внутренняя ошибка сервера
   */
  export namespace AddToApplicationCreate {
    export type RequestParams = {
      /** ID услуги (credit) */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DsSuccessResponse;
  }
}

export namespace Applications {
  /**
   * @description Возвращает информацию о корзине (ID черновика и количество услуг)
   * @tags applications
   * @name BasketList
   * @summary Получить корзину
   * @request GET:/applications/basket
   * @secure
   * @response `200` `DsApplicationBasketResponse` Корзина
   * @response `401` `DsErrorResponse` Требуется авторизация
   */
  export namespace BasketList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DsApplicationBasketResponse;
  }

  /**
   * @description Возвращает список заявок с фильтрацией по статусу и диапазону дат
   * @tags applications
   * @name ApplicationsList
   * @summary Список заявок
   * @request GET:/applications
   * @secure
   * @response `200` `DsApplicationListResponse` Список заявок
   * @response `401` `DsErrorResponse` Требуется авторизация
   * @response `500` `DsErrorResponse` Внутренняя ошибка сервера
   */
  export namespace ApplicationsList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Фильтр по статусу */
      status?: string;
      /** Дата формирования/создания от (YYYY-MM-DD) */
      date_from?: string;
      /** Дата формирования/создания до (YYYY-MM-DD) */
      date_to?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DsApplicationListResponse;
  }

  /**
   * @description Возвращает одну заявку по ID вместе с услугами
   * @tags applications
   * @name ApplicationsDetail
   * @summary Получить заявку
   * @request GET:/applications/{id}
   * @secure
   * @response `200` `DsApplicationResponse` Заявка
   * @response `401` `DsErrorResponse` Требуется авторизация
   * @response `404` `DsErrorResponse` Заявка не найдена
   */
  export namespace ApplicationsDetail {
    export type RequestParams = {
      /** ID заявки */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DsApplicationResponse;
  }

  /**
   * @description Обновляет поля заявки (ФИО, доход, обязательства)
   * @tags applications
   * @name ApplicationsUpdate
   * @summary Обновить поля заявки
   * @request PUT:/applications/{id}
   * @secure
   * @response `200` `DsSuccessResponse` Заявка обновлена
   * @response `401` `DsErrorResponse` Требуется авторизация
   * @response `403` `DsErrorResponse` Нет доступа
   * @response `404` `DsErrorResponse` Заявка не найдена
   */
  export namespace ApplicationsUpdate {
    export type RequestParams = {
      /** ID заявки */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = DsApplicationUpdateRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DsSuccessResponse;
  }

  /**
   * @description Удаляет заявку пользователя по ID
   * @tags applications
   * @name ApplicationsDelete
   * @summary Удалить заявку
   * @request DELETE:/applications/{id}
   * @secure
   * @response `200` `DsSuccessResponse` Заявка удалена
   * @response `401` `DsErrorResponse` Требуется авторизация
   * @response `403` `DsErrorResponse` Нет доступа
   * @response `404` `DsErrorResponse` Заявка не найдена
   */
  export namespace ApplicationsDelete {
    export type RequestParams = {
      /** ID заявки */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DsSuccessResponse;
  }

  /**
   * @description Формирует заявку пользователя (из draft в formed)
   * @tags applications
   * @name FormUpdate
   * @summary Сформировать заявку
   * @request PUT:/applications/{id}/form
   * @secure
   * @response `200` `DsSuccessResponse` Заявка сформирована
   * @response `401` `DsErrorResponse` Требуется авторизация
   * @response `403` `DsErrorResponse` Нет доступа
   * @response `404` `DsErrorResponse` Заявка не найдена
   */
  export namespace FormUpdate {
    export type RequestParams = {
      /** ID заявки */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DsSuccessResponse;
  }
}

export namespace ApplicationProducts {
  /**
   * @description Обновляет М-М связь (параметры услуги в заявке)
   * @tags application-products
   * @name ApplicationProductsUpdate
   * @summary Обновить М-М связь
   * @request PUT:/application-products/{app_id}/{credit_id}
   * @secure
   * @response `200` `DsSuccessResponse` М-М обновлена
   * @response `401` `DsErrorResponse` Требуется авторизация
   * @response `403` `DsErrorResponse` Нет доступа
   * @response `404` `DsErrorResponse` Не найдено
   */
  export namespace ApplicationProductsUpdate {
    export type RequestParams = {
      /** ID заявки */
      appId: number;
      /** ID услуги (credit) */
      creditId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = DsUpdateApplicationProductRequest;
    export type RequestHeaders = {};
    export type ResponseBody = DsSuccessResponse;
  }

  /**
   * @description Удаляет услугу из заявки (удаление М-М связи)
   * @tags application-products
   * @name ApplicationProductsDelete
   * @summary Удалить услугу из заявки
   * @request DELETE:/application-products/{app_id}/{credit_id}
   * @secure
   * @response `200` `DsSuccessResponse` Услуга удалена из заявки
   * @response `401` `DsErrorResponse` Требуется авторизация
   * @response `403` `DsErrorResponse` Нет доступа
   * @response `404` `DsErrorResponse` Не найдено
   */
  export namespace ApplicationProductsDelete {
    export type RequestParams = {
      /** ID заявки */
      appId: number;
      /** ID услуги (credit) */
      creditId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DsSuccessResponse;
  }
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "//localhost:8080/api",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Lab4 Scoring Service API
 * @version 1.0
 * @license MIT (https://opensource.org/licenses/MIT)
 * @termsOfService http://swagger.io/terms/
 * @baseUrl //localhost:8080/api
 * @contact API Support <support@example.com> (http://example.com/support)
 *
 * API для системы скоринга и управления кредитными заявками
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  login = {
    /**
 * @description Выполняет вход пользователя в систему и возвращает JWT токен
 *
 * @tags login
 * @name LoginCreate
 * @summary Аутентификация пользователя
 * @request POST:/users/login
 * @response `200` `{
    data?: {
    access_token?: string,
    expires_in?: number,
    token_type?: string,
    user?: DsUserResponse,

},
    message?: string,
    status?: string,

}` Успешная аутентификация
 * @response `400` `DsErrorResponse` Некорректные данные
 * @response `401` `DsErrorResponse` Неверные учетные данные
 * @response `500` `DsErrorResponse` Внутренняя ошибка сервера
 */
    loginCreate: (request: DsUserLoginRequest, params: RequestParams = {}) =>
      this.http.request<
        {
          data?: {
            access_token?: string;
            expires_in?: number;
            token_type?: string;
            user?: DsUserResponse;
          };
          message?: string;
          status?: string;
        },
        DsErrorResponse
      >({
        path: `/users/login`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  logout = {
    /**
     * @description Завершает сессию пользователя и добавляет токен в blacklist
     *
     * @tags logout
     * @name LogoutCreate
     * @summary Выход из системы
     * @request POST:/users/logout
     * @secure
     * @response `200` `DsSuccessResponse` Успешный выход
     * @response `401` `DsErrorResponse` Требуется авторизация
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.http.request<DsSuccessResponse, DsErrorResponse>({
        path: `/users/logout`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  profile = {
    /**
     * @description Возвращает профиль текущего авторизованного пользователя
     *
     * @tags profile
     * @name ProfileList
     * @summary Получить профиль пользователя
     * @request GET:/users/profile
     * @secure
     * @response `200` `DsUserResponse` Профиль пользователя
     * @response `401` `DsErrorResponse` Требуется авторизация
     * @response `404` `DsErrorResponse` Пользователь не найден
     */
    profileList: (params: RequestParams = {}) =>
      this.http.request<DsUserResponse, DsErrorResponse>({
        path: `/users/profile`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет данные профиля текущего пользователя
     *
     * @tags profile
     * @name ProfileUpdate
     * @summary Обновить профиль пользователя
     * @request PUT:/users/profile
     * @secure
     * @response `200` `DsSuccessResponse` Профиль успешно обновлен
     * @response `400` `DsErrorResponse` Некорректные данные
     * @response `401` `DsErrorResponse` Требуется авторизация
     * @response `404` `DsErrorResponse` Пользователь не найден
     * @response `500` `DsErrorResponse` Внутренняя ошибка сервера
     */
    profileUpdate: (request: DsUserUpdateRequest, params: RequestParams = {}) =>
      this.http.request<DsSuccessResponse, DsErrorResponse>({
        path: `/users/profile`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  register = {
    /**
     * @description Создает нового пользователя в системе
     *
     * @tags register
     * @name RegisterCreate
     * @summary Регистрация нового пользователя
     * @request POST:/users/register
     * @response `201` `DsSuccessResponse` Пользователь успешно зарегистрирован
     * @response `400` `DsErrorResponse` Некорректные данные
     * @response `409` `DsErrorResponse` Пользователь уже существует
     * @response `500` `DsErrorResponse` Внутренняя ошибка сервера
     */
    registerCreate: (
      request: DsUserRegisterRequest,
      params: RequestParams = {},
    ) =>
      this.http.request<DsSuccessResponse, DsErrorResponse>({
        path: `/users/register`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  credits = {
    /**
     * @description Возвращает список услуг (кредитных продуктов) с фильтрацией
     *
     * @tags credits
     * @name CreditsList
     * @summary Список услуг
     * @request GET:/credits
     * @response `200` `DsOrderListResponse` Список услуг
     * @response `500` `DsErrorResponse` Внутренняя ошибка сервера
     */
    creditsList: (query: CreditsListParams, params: RequestParams = {}) =>
      this.http.request<DsOrderListResponse, DsErrorResponse>({
        path: `/credits`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает одну услугу по ID
     *
     * @tags credits
     * @name CreditsDetail
     * @summary Получить услугу
     * @request GET:/credits/{id}
     * @response `200` `DsOrderResponse` Услуга
     * @response `404` `DsErrorResponse` Услуга не найдена
     * @response `500` `DsErrorResponse` Внутренняя ошибка сервера
     */
    creditsDetail: (
      { id, ...query }: CreditsDetailParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DsOrderResponse, DsErrorResponse>({
        path: `/credits/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет услугу (credit) в текущую заявку пользователя, при необходимости создаёт черновик
     *
     * @tags credits
     * @name AddToApplicationCreate
     * @summary Добавить услугу в заявку
     * @request POST:/credits/{id}/add-to-application
     * @secure
     * @response `200` `DsSuccessResponse` Услуга добавлена в заявку
     * @response `401` `DsErrorResponse` Требуется авторизация
     * @response `404` `DsErrorResponse` Услуга не найдена
     * @response `500` `DsErrorResponse` Внутренняя ошибка сервера
     */
    addToApplicationCreate: (
      { id, ...query }: AddToApplicationCreateParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DsSuccessResponse, DsErrorResponse>({
        path: `/credits/${id}/add-to-application`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  applications = {
    /**
     * @description Возвращает информацию о корзине (ID черновика и количество услуг)
     *
     * @tags applications
     * @name BasketList
     * @summary Получить корзину
     * @request GET:/applications/basket
     * @secure
     * @response `200` `DsApplicationBasketResponse` Корзина
     * @response `401` `DsErrorResponse` Требуется авторизация
     */
    basketList: (params: RequestParams = {}) =>
      this.http.request<DsApplicationBasketResponse, DsErrorResponse>({
        path: `/applications/basket`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает список заявок с фильтрацией по статусу и диапазону дат
     *
     * @tags applications
     * @name ApplicationsList
     * @summary Список заявок
     * @request GET:/applications
     * @secure
     * @response `200` `DsApplicationListResponse` Список заявок
     * @response `401` `DsErrorResponse` Требуется авторизация
     * @response `500` `DsErrorResponse` Внутренняя ошибка сервера
     */
    applicationsList: (
      query: ApplicationsListParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DsApplicationListResponse, DsErrorResponse>({
        path: `/applications`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает одну заявку по ID вместе с услугами
     *
     * @tags applications
     * @name ApplicationsDetail
     * @summary Получить заявку
     * @request GET:/applications/{id}
     * @secure
     * @response `200` `DsApplicationResponse` Заявка
     * @response `401` `DsErrorResponse` Требуется авторизация
     * @response `404` `DsErrorResponse` Заявка не найдена
     */
    applicationsDetail: (
      { id, ...query }: ApplicationsDetailParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DsApplicationResponse, DsErrorResponse>({
        path: `/applications/${id}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет поля заявки (ФИО, доход, обязательства)
     *
     * @tags applications
     * @name ApplicationsUpdate
     * @summary Обновить поля заявки
     * @request PUT:/applications/{id}
     * @secure
     * @response `200` `DsSuccessResponse` Заявка обновлена
     * @response `401` `DsErrorResponse` Требуется авторизация
     * @response `403` `DsErrorResponse` Нет доступа
     * @response `404` `DsErrorResponse` Заявка не найдена
     */
    applicationsUpdate: (
      { id, ...query }: ApplicationsUpdateParams,
      request: DsApplicationUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.http.request<DsSuccessResponse, DsErrorResponse>({
        path: `/applications/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет заявку пользователя по ID
     *
     * @tags applications
     * @name ApplicationsDelete
     * @summary Удалить заявку
     * @request DELETE:/applications/{id}
     * @secure
     * @response `200` `DsSuccessResponse` Заявка удалена
     * @response `401` `DsErrorResponse` Требуется авторизация
     * @response `403` `DsErrorResponse` Нет доступа
     * @response `404` `DsErrorResponse` Заявка не найдена
     */
    applicationsDelete: (
      { id, ...query }: ApplicationsDeleteParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DsSuccessResponse, DsErrorResponse>({
        path: `/applications/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Формирует заявку пользователя (из draft в formed)
     *
     * @tags applications
     * @name FormUpdate
     * @summary Сформировать заявку
     * @request PUT:/applications/{id}/form
     * @secure
     * @response `200` `DsSuccessResponse` Заявка сформирована
     * @response `401` `DsErrorResponse` Требуется авторизация
     * @response `403` `DsErrorResponse` Нет доступа
     * @response `404` `DsErrorResponse` Заявка не найдена
     */
    formUpdate: (
      { id, ...query }: FormUpdateParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DsSuccessResponse, DsErrorResponse>({
        path: `/applications/${id}/form`,
        method: "PUT",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  applicationProducts = {
    /**
     * @description Обновляет М-М связь (параметры услуги в заявке)
     *
     * @tags application-products
     * @name ApplicationProductsUpdate
     * @summary Обновить М-М связь
     * @request PUT:/application-products/{app_id}/{credit_id}
     * @secure
     * @response `200` `DsSuccessResponse` М-М обновлена
     * @response `401` `DsErrorResponse` Требуется авторизация
     * @response `403` `DsErrorResponse` Нет доступа
     * @response `404` `DsErrorResponse` Не найдено
     */
    applicationProductsUpdate: (
      { appId, creditId, ...query }: ApplicationProductsUpdateParams,
      request: DsUpdateApplicationProductRequest,
      params: RequestParams = {},
    ) =>
      this.http.request<DsSuccessResponse, DsErrorResponse>({
        path: `/application-products/${appId}/${creditId}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет услугу из заявки (удаление М-М связи)
     *
     * @tags application-products
     * @name ApplicationProductsDelete
     * @summary Удалить услугу из заявки
     * @request DELETE:/application-products/{app_id}/{credit_id}
     * @secure
     * @response `200` `DsSuccessResponse` Услуга удалена из заявки
     * @response `401` `DsErrorResponse` Требуется авторизация
     * @response `403` `DsErrorResponse` Нет доступа
     * @response `404` `DsErrorResponse` Не найдено
     */
    applicationProductsDelete: (
      { appId, creditId, ...query }: ApplicationProductsDeleteParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DsSuccessResponse, DsErrorResponse>({
        path: `/application-products/${appId}/${creditId}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
