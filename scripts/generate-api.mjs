import { resolve } from 'path';
import { generateApi } from 'swagger-typescript-api';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

generateApi({
    name: 'Api.ts',
    // Генерируем в отдельную папку, чтобы cleanOutput не удалял наш src/api/index.ts
    output: resolve(projectRoot, './src/api/generated'),
    input: resolve(projectRoot, '../docs/swagger.yaml'),
    httpClientType: 'axios',
    generateClient: true,
    generateRouteTypes: true,
    generateResponses: true,
    toJS: false,
    extractRequestParams: true,
    extractRequestBody: true,
    extractEnums: true,
    unwrapResponseData: false,
    defaultResponseAsSuccess: false,
    singleHttpClient: true,
    cleanOutput: true,
    enumNamesAsValues: false,
    moduleNameIndex: 1,
    // ВАЖНО для ЛР7: модули в сгенерированном API должны быть «по теме»
    // (credits, applications, application-products, login, logout, profile, register)
    moduleNameFirstTag: true,
    generateUnionEnums: true,
    typePrefix: '',
    typeSuffix: '',
    enumPrefix: '',
    enumSuffix: '',
    addReadonly: false,
    extractRequestParams: true,
    extractRequestBody: true,
    extractEnums: true,
}).then(({ files, configuration }) => {
    console.log('✅ API успешно сгенерирован!');
    console.log(`📁 Файлы созданы в: ${resolve(projectRoot, './src/api')}`);
}).catch((e) => {
    console.error('❌ Ошибка генерации API:', e);
    process.exit(1);
});

