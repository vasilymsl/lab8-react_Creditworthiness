import React, { useEffect, useState } from 'react';
import {
    Container,
    Card,
    Button,
    Form,
    Alert,
    Spinner,
    Row,
    Col,
    Badge,
    Table,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import {
    getScoringApplicationAsync,
    getScoringApplicationBasketAsync,
    updateScoringApplicationAsync,
    formScoringApplicationAsync,
    deleteScoringApplicationAsync,
    removeScoringServiceFromApplicationAsync,
    updateScoringServiceParamsAsync,
    clearError,
} from '../slices/applicationSlice';
import { BreadCrumbs } from '../components/Breadcrumbs';
import { ROUTES, ROUTE_LABELS } from '../Routes';
import { ApplicationProduct } from '../slices/applicationSlice';
import { getScoringModelsAsync } from '../slices/servicesSlice';

const ApplicationDetailPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { currentApplication, loading, error } = useSelector(
        (state: RootState) => state.application
    );
    const { scoringModels } = useSelector((state: RootState) => state.services);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState({
        full_name: '',
        income: '',
        obligations: '',
    });

    const isDraft = currentApplication?.status === 'draft';

    // Редирект если не авторизован
    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN);
        }
    }, [isAuthenticated, navigate]);

    // Загрузка заявки
    useEffect(() => {
        if (id && isAuthenticated) {
            dispatch(getScoringApplicationAsync(parseInt(id)));
        }
    }, [dispatch, id, isAuthenticated]);

    // Подтягиваем список услуг, чтобы на корзине показать "Точность" и "Срок"
    useEffect(() => {
        // без параметров — получить все
        dispatch(getScoringModelsAsync(undefined));
    }, [dispatch]);

    // Обновление формы при загрузке заявки
    useEffect(() => {
        if (currentApplication) {
            setFormData({
                full_name: currentApplication.full_name || '',
                // На черновике бэк заполняет 0, но в UI стартуем с пустых полей (как в старом дизайне)
                income:
                    currentApplication.status === 'draft' && currentApplication.income === 0
                        ? ''
                        : (currentApplication.income?.toString() || ''),
                obligations:
                    currentApplication.status === 'draft' && currentApplication.obligations === 0
                        ? ''
                        : (currentApplication.obligations?.toString() || ''),
            });
        }
    }, [currentApplication]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        if (!id) return;
        await dispatch(
            updateScoringApplicationAsync({
                id: parseInt(id),
                data: {
                    full_name: formData.full_name,
                    income: formData.income ? parseFloat(formData.income) : undefined,
                    obligations: formData.obligations ? parseFloat(formData.obligations) : undefined,
                },
            })
        );
    };

    const handleFormApplication = async () => {
        if (!id) return;
        const result = await dispatch(formScoringApplicationAsync(parseInt(id)));
        if (formScoringApplicationAsync.fulfilled.match(result)) {
            // Не уходим со страницы: просто перезагрузим заявку, чтобы статус/результаты обновились
            await dispatch(getScoringApplicationAsync(parseInt(id)));
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        if (window.confirm('Очистить заявку? Черновик будет удалён, корзина создастся заново.')) {
            const result = await dispatch(deleteScoringApplicationAsync(parseInt(id)));
            if (deleteScoringApplicationAsync.fulfilled.match(result)) {
                // Не уходим на другие страницы: создаём новый черновик и заменяем URL на новый id корзины
                const basketResult = await dispatch(getScoringApplicationBasketAsync());
                if (getScoringApplicationBasketAsync.fulfilled.match(basketResult)) {
                    const newId = basketResult.payload.application_id;
                    if (newId) {
                        navigate(`${ROUTES.APPLICATIONS}/${newId}`, { replace: true });
                    }
                }
            }
        }
    };

    const handleRemoveProduct = async (creditId: number) => {
        if (!id) return;
        await dispatch(
            removeScoringServiceFromApplicationAsync({
                appId: parseInt(id),
                creditId,
            })
        );
    };

    // === Редактирование параметров услуги в заявке ===
    // Для демонстрации по порядку показа: "изменить что-то в таблице" + отдельная кнопка сохранения.
    const [editingProduct, setEditingProduct] = useState<number | null>(null); // credit_id
    const [productFormData, setProductFormData] = useState({
        requested_amount: '',
        requested_term_days: '',
    });

    const handleStartEditProduct = (product: ApplicationProduct) => {
        if (!product.credit_id) return;
        setEditingProduct(product.credit_id);
        setProductFormData({
            // 0 считаем "не задано" (чтобы вместо нулей был плейсхолдер)
            requested_amount:
                product.requested_amount && product.requested_amount !== 0
                    ? product.requested_amount.toString()
                    : '',
            requested_term_days:
                product.requested_term_days && product.requested_term_days !== 0
                    ? product.requested_term_days.toString()
                    : '',
        });
    };

    const handleCancelEditProduct = () => {
        setEditingProduct(null);
        setProductFormData({ requested_amount: '', requested_term_days: '' });
    };

    const handleSaveProduct = async (creditId: number) => {
        if (!id) return;
        const result = await dispatch(
            updateScoringServiceParamsAsync({
                appId: parseInt(id),
                creditId,
                data: {
                    requested_amount: productFormData.requested_amount
                        ? parseFloat(productFormData.requested_amount)
                        : undefined,
                    requested_term_days: productFormData.requested_term_days
                        ? parseInt(productFormData.requested_term_days)
                        : undefined,
                },
            })
        );
        if (updateScoringServiceParamsAsync.fulfilled.match(result)) {
            setEditingProduct(null);
            setProductFormData({ requested_amount: '', requested_term_days: '' });
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    if (loading && !currentApplication) {
        return (
            <Container>
                <div className="d-flex justify-content-center" style={{ marginTop: '100px' }}>
                    <Spinner animation="border" />
                </div>
            </Container>
        );
    }

    if (!currentApplication) {
        return (
            <Container>
                <Alert variant="warning">Заявка не найдена</Alert>
            </Container>
        );
    }

    return (
        <Container>
            <BreadCrumbs
                crumbs={[
                    { label: ROUTE_LABELS.APPLICATIONS, path: ROUTES.APPLICATIONS },
                    { label: `Заявка #${currentApplication.id}` },
                ]}
            />
            <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: '20px' }}>
                <h1 style={{ margin: 0, color: '#0b1f35' }}>
                    Заявка на оценку кредитоспособности №{currentApplication.id}
                </h1>
                {isDraft && (
                    <Button variant="danger" onClick={handleDelete} disabled={loading}>
                        Очистить заявку
                    </Button>
                )}
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
                    {error}
                </Alert>
            )}

            {/* Данные для оценки (как в старой версии корзины) */}
            <Card style={{ marginBottom: '30px' }}>
                <Card.Header>
                    <div className="d-flex align-items-center justify-content-between">
                        <h4 style={{ margin: 0 }}>Данные для оценки кредитоспособности:</h4>
                        <Badge bg={isDraft ? 'secondary' : 'info'}>
                            {currentApplication.status === 'draft'
                                ? 'Черновик'
                                : currentApplication.status === 'formed'
                                ? 'Сформирована'
                                : currentApplication.status === 'completed'
                                ? 'Завершена'
                                : 'Отклонена'}
                        </Badge>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: '#6B6B6B' }}>ФИО заемщика</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="full_name"
                                    value={isDraft ? formData.full_name : (currentApplication.full_name || '')}
                                    onChange={handleInputChange}
                                    disabled={!isDraft || loading}
                                    placeholder="Введите ФИО"
                                    style={{ backgroundColor: '#D9D9D9', border: '2px solid #0b1f35' }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: '#6B6B6B' }}>Ежемесячный доход</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="income"
                                    value={isDraft ? formData.income : (currentApplication.income?.toString() || '')}
                                    onChange={handleInputChange}
                                    disabled={!isDraft || loading}
                                    placeholder="Введите доход (₽)"
                                    style={{ backgroundColor: '#D9D9D9', border: '2px solid #0b1f35' }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: '#6B6B6B' }}>Текущие обязательства в месяц</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="obligations"
                                    value={isDraft ? formData.obligations : (currentApplication.obligations?.toString() || '')}
                                    onChange={handleInputChange}
                                    disabled={!isDraft || loading}
                                    placeholder="Введите обязательства (₽)"
                                    style={{ backgroundColor: '#D9D9D9', border: '2px solid #0b1f35' }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Результаты скоринга */}
                    {currentApplication.status !== 'draft' && (
                        <Row className="mt-3">
                            <Col>
                                <h5>Результаты оценки кредитоспособности</h5>
                                <Table striped bordered size="sm">
                                    <tbody>
                                        <tr>
                                            <td><strong>Кредитный скор</strong></td>
                                            <td>{currentApplication.credit_score ?? '-'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Результат</strong></td>
                                            <td>
                                                {currentApplication.scoring_result === 'approved' && (
                                                    <Badge bg="success">Одобрено</Badge>
                                                )}
                                                {currentApplication.scoring_result === 'rejected' && (
                                                    <Badge bg="danger">Отклонено</Badge>
                                                )}
                                                {currentApplication.scoring_result === 'pending' && (
                                                    <Badge bg="warning">На рассмотрении</Badge>
                                                )}
                                                {!currentApplication.scoring_result && '-'}
                                            </td>
                                        </tr>
                                        {currentApplication.max_credit_amount && (
                                            <tr>
                                                <td><strong>Максимальная сумма</strong></td>
                                                <td>
                                                    {currentApplication.max_credit_amount.toLocaleString('ru-RU')} ₽
                                                </td>
                                            </tr>
                                        )}
                                        {currentApplication.rejection_reason && (
                                            <tr>
                                                <td><strong>Причина отклонения</strong></td>
                                                <td>{currentApplication.rejection_reason}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    )}

                    {/* Кнопки действий для черновика */}
                    {isDraft && (
                        <div className="mt-3">
                            <Button
                                variant="primary"
                                onClick={handleSave}
                                disabled={loading}
                                style={{ marginRight: '10px', backgroundColor: '#0b1f35', borderColor: '#0b1f35' }}
                            >
                                {loading ? (
                                    <>
                                        <Spinner animation="border" size="sm" style={{ marginRight: '5px' }} />
                                        Сохранение...
                                    </>
                                ) : (
                                    'Сохранить поля заявки'
                                )}
                            </Button>
                            <Button
                                variant="success"
                                onClick={handleFormApplication}
                                disabled={loading}
                                style={{ marginRight: '10px' }}
                            >
                                Сформировать заявку
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Продукты в заявке */}
            <Card>
                <Card.Header>
                    <h4 style={{ margin: 0 }}>Услуги в заявке</h4>
                </Card.Header>
                <Card.Body>
                    {!currentApplication.products || currentApplication.products.length === 0 ? (
                        <Alert variant="info">В заявке пока нет услуг</Alert>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Услуга оценки</th>
                                    <th>Точность</th>
                                    <th>Срок расчета/внедрения</th>
                                    {isDraft && <th style={{ width: '140px' }}>Действия</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {currentApplication.products.map((product: ApplicationProduct) => (
                                    <tr key={`${product.credit_id ?? 'credit'}-${product.id ?? 'row'}`}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.credit_title || ''}
                                                        style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                                                    />
                                                ) : null}
                                                <div>
                                                    <strong>{product.credit_title}</strong>
                                                    {/* Параметры услуги (редактирование по кнопке "Изменить") */}
                                                    {editingProduct === product.credit_id ? (
                                                        <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                                                            <Form.Control
                                                                type="number"
                                                                value={productFormData.requested_amount}
                                                                onChange={(e) =>
                                                                    setProductFormData({
                                                                        ...productFormData,
                                                                        requested_amount: e.target.value,
                                                                    })
                                                                }
                                                                placeholder="Запрошенная сумма (₽)"
                                                                title="Запрошенная сумма (₽)"
                                                                style={{
                                                                    width: '240px',
                                                                    fontSize: '1rem',
                                                                    padding: '10px 12px',
                                                                }}
                                                            />
                                                            <Form.Control
                                                                type="number"
                                                                value={productFormData.requested_term_days}
                                                                onChange={(e) =>
                                                                    setProductFormData({
                                                                        ...productFormData,
                                                                        requested_term_days: e.target.value,
                                                                    })
                                                                }
                                                                placeholder="Срок (дней)"
                                                                title="Срок (дней)"
                                                                style={{
                                                                    width: '180px',
                                                                    fontSize: '1rem',
                                                                    padding: '10px 12px',
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div style={{ marginTop: '6px', color: '#6B6B6B', fontSize: '0.9rem' }}>
                                                            {(product.requested_amount && product.requested_amount !== 0) ||
                                                            (product.requested_term_days && product.requested_term_days !== 0) ? (
                                                                <>
                                                                    {product.requested_amount && product.requested_amount !== 0 ? (
                                                                        <span>
                                                                            Запрошенная сумма: {product.requested_amount.toLocaleString('ru-RU')} ₽
                                                                        </span>
                                                                    ) : (
                                                                        <span>Запрошенная сумма: —</span>
                                                                    )}
                                                                    <span style={{ margin: '0 8px' }}>•</span>
                                                                    {product.requested_term_days && product.requested_term_days !== 0 ? (
                                                                        <span>Срок: {product.requested_term_days} дн.</span>
                                                                    ) : (
                                                                        <span>Срок: —</span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span>Параметры услуги: не заданы</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {(() => {
                                                const credit = scoringModels.find((c) => c.id === product.credit_id);
                                                return credit?.rate || '—';
                                            })()}
                                        </td>
                                        <td>
                                            {(() => {
                                                const credit = scoringModels.find((c) => c.id === product.credit_id);
                                                return credit?.term || '—';
                                            })()}
                                        </td>
                                        {isDraft && (
                                            <td>
                                                {editingProduct === product.credit_id ? (
                                                    <>
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={() => product.credit_id && handleSaveProduct(product.credit_id)}
                                                            disabled={loading}
                                                            style={{ marginRight: '6px' }}
                                                        >
                                                            Сохранить параметры
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={handleCancelEditProduct}
                                                            disabled={loading}
                                                        >
                                                            Отмена
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleStartEditProduct(product)}
                                                            disabled={loading || !product.credit_id}
                                                            style={{ marginRight: '6px' }}
                                                        >
                                                            Изменить
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => product.credit_id && handleRemoveProduct(product.credit_id)}
                                                            disabled={loading || !product.credit_id}
                                                        >
                                                            Удалить
                                                        </Button>
                                                    </>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ApplicationDetailPage;

