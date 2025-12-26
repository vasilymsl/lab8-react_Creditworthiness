import React, { useEffect, useState, useRef } from 'react';
import { Container, Table, Spinner, Alert, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { getScoringApplicationsAsync } from '../slices/applicationSlice';
import { BreadCrumbs } from '../components/Breadcrumbs';
import { ROUTES, ROUTE_LABELS } from '../Routes';
import { Application } from '../slices/applicationSlice';
import { dest_api, dest_async } from '../target_config';

const ApplicationsListPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { applications, loading, error } = useSelector((state: RootState) => state.application);
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const isModerator = user?.is_moderator === true;

    const today = new Date();
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
        today.getDate()
    ).padStart(2, '0')}`;

    const [statusFilter, setStatusFilter] = useState<string>('');
    const [dateFrom, setDateFrom] = useState<string>(todayIso);
    const [dateTo, setDateTo] = useState<string>(todayIso);
    const [creatorFilter, setCreatorFilter] = useState<string>('');

    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

    // Ref для сохранения позиции скролла при polling (ЛР8)
    const scrollPositionRef = useRef<number>(0);

    // Редирект если не авторизован
    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN);
        }
    }, [isAuthenticated, navigate]);

    // Сохранение позиции скролла при каждом скролле (ЛР8)
    useEffect(() => {
        const handleScroll = () => {
            scrollPositionRef.current = window.scrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Восстановление позиции скролла после обновления данных (ЛР8)
    useEffect(() => {
        if (scrollPositionRef.current > 0) {
            // Откладываем восстановление скролла до следующего кадра
            // чтобы дать React время обновить DOM
            const scrollY = scrollPositionRef.current;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    window.scrollTo(0, scrollY);
                });
            });
        }
    }, [applications]);

    // ЛР8: short polling списка заявок при монтировании и изменении фильтров
    // По методичке: каждые 2 секунды для отображения актуальных статусов
    useEffect(() => {
        if (isAuthenticated) {
            let cancelled = false;
            let timer: number | undefined;

            const poll = async () => {
                if (cancelled) return;
                const params: any = {};
                if (statusFilter) params.status = statusFilter;
                if (dateFrom) params.date_from = dateFrom;
                if (dateTo) params.date_to = dateTo;
                dispatch(getScoringApplicationsAsync(params));

                // short polling: запрашиваем актуальные статусы каждые 2 сек
                timer = window.setTimeout(poll, 2000);
            };

            poll();
            return () => {
                cancelled = true;
                if (timer) window.clearTimeout(timer);
            };
        }
    }, [dispatch, isAuthenticated, statusFilter, dateFrom, dateTo]);

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Загрузка происходит автоматически через short polling при изменении state фильтров
    };

    const handleResetFilters = () => {
        setStatusFilter('');
        setDateFrom('');
        setDateTo('');
        setCreatorFilter('');
    };

    const getAuthHeaders = () => {
        const token = localStorage.getItem('auth_token');
        return {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    };

    const moderatorAction = async (appId: number, action: 'complete' | 'reject') => {
        try {
            setActionLoadingId(appId);
            
            const resp = await fetch(`${dest_api}/applications/${appId}/complete`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ action }),
            });
            
            if (!resp.ok) {
                const body = await resp.json().catch(() => null);
                const errorMsg = body?.message || `Ошибка: ${resp.status}`;
                alert(`❌ Ошибка: ${errorMsg}`);
                throw new Error(errorMsg);
            }
            
            if (action === 'complete') {
                alert(`✅ Заявка ID=${appId} завершена!\n\nAsync-расчёт запущен, результат появится через ~6 сек.`);
            } else {
                alert(`✅ Заявка ID=${appId} отклонена!`);
            }
        } catch (error) {
            console.error('[ЛР8] Ошибка при действии модератора:', error);
        } finally {
            setActionLoadingId(null);
        }
    };

    const startAsyncService = async (appId: number) => {
        try {
            setActionLoadingId(appId);
            
            const resp = await fetch(`${dest_async}/set_result`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pk: appId }),
            });
            
            if (!resp.ok) {
                const body = await resp.json().catch(() => null);
                const errorMsg = body?.error || `Async сервис вернул ${resp.status}`;
                alert(`❌ Ошибка: ${errorMsg}`);
                throw new Error(errorMsg);
            }
            
            alert(`✅ Async-расчёт запущен для заявки ID=${appId}!\n\nРезультат появится через ~6 секунд благодаря short polling.`);
        } catch (error) {
            console.error('[ЛР8] Ошибка async-сервиса:', error);
            alert(`❌ Ошибка при вызове async-сервиса:\n${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setActionLoadingId(null);
        }
    };

    const getStatusBadgeVariant = (status?: string): string => {
        switch (status) {
            case 'formed':
                return 'info';
            case 'completed':
                return 'success';
            case 'rejected':
                return 'danger';
            case 'deleted':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    const getStatusLabel = (status?: string): string => {
        const statusMap: Record<string, string> = {
            formed: 'Сформирована',
            completed: 'Завершена',
            rejected: 'Отклонена',
            deleted: 'Удалена',
        };
        if (!status) return '-';
        return statusMap[status] || status;
    };

    const formatDate = (dateString?: string): string => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Container>
            <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.APPLICATIONS }]} />
            <h1 style={{ marginBottom: '30px', color: '#0b1f35' }}>{ROUTE_LABELS.APPLICATIONS}</h1>

            {/* Фильтры */}
            <Form onSubmit={handleFilterSubmit} style={{ marginBottom: '30px' }}>
                <Row className="mb-3">
                    <Col md={isModerator ? 2 : 3}>
                        <Form.Group>
                            <Form.Label>Статус</Form.Label>
                            <Form.Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">Все статусы</option>
                                <option value="formed">Сформирована</option>
                                <option value="completed">Завершена</option>
                                <option value="rejected">Отклонена</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={isModerator ? 2 : 3}>
                        <Form.Group>
                            <Form.Label>Дата от</Form.Label>
                            <Form.Control
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={isModerator ? 2 : 3}>
                        <Form.Group>
                            <Form.Label>Дата до</Form.Label>
                            <Form.Control
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    {isModerator && (
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Создатель (фронт)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={creatorFilter}
                                    onChange={(e) => setCreatorFilter(e.target.value)}
                                    placeholder="login создателя"
                                />
                            </Form.Group>
                        </Col>
                    )}
                    <Col md={isModerator ? 3 : 3} className="d-flex align-items-end">
                        <Button
                            type="submit"
                            variant="primary"
                            style={{ marginRight: '10px', backgroundColor: '#0b1f35', borderColor: '#0b1f35' }}
                        >
                            Применить
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleResetFilters}>
                            Сбросить
                        </Button>
                    </Col>
                </Row>
            </Form>

            {error && (
                <Alert variant="danger" dismissible>
                    {error}
                </Alert>
            )}

            {(() => {
                const visibleApplications = applications
                    .filter((a) => a.status !== 'draft' && a.status !== 'deleted')
                    // ЛР8: фильтрация по создателю на фронтенде (по логину)
                    .filter((a) => {
                        if (!creatorFilter.trim()) return true;
                        return String(a.creator_login || '')
                            .toLowerCase()
                            .includes(creatorFilter.trim().toLowerCase());
                    });
                const withResultCount = visibleApplications.filter(
                    (a) => !!(a.scoring_result && String(a.scoring_result).trim().length > 0)
                ).length;

                return (
                    <>
                        <div style={{ marginBottom: '15px', color: '#555' }}>
                            Всего заявок: <strong>{visibleApplications.length}</strong> • С результатом:{' '}
                            <strong>{withResultCount}</strong>
                        </div>

                        {loading ? (
                <div className="d-flex justify-content-center" style={{ marginTop: '50px' }}>
                    <Spinner animation="border" />
                </div>
            ) : visibleApplications.length === 0 ? (
                <Alert variant="info">
                    У вас пока нет заявок. Создайте заявку, добавив услуги в корзину.
                </Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Статус</th>
                            <th>Создана</th>
                            <th>Сформ.</th>
                            {isModerator && <th>Автор</th>}
                            <th>ФИО</th>
                            <th>Доход</th>
                            <th>Обяз.</th>
                            <th>Итог</th>
                            <th>Скор</th>
                            <th>Рез-т</th>
                            <th>Макс.</th>
                            <th>Причина</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleApplications.map((app: Application) => (
                            <tr key={app.id ?? `temp-${app.created_at}-${app.full_name}`}>
                                <td>{app.id ?? '-'}</td>
                                <td>
                                    <span className={`badge bg-${getStatusBadgeVariant(app.status)}`}>
                                        {getStatusLabel(app.status)}
                                    </span>
                                </td>
                                <td>{formatDate(app.created_at)}</td>
                                <td>{formatDate(app.formed_at)}</td>
                                {isModerator && <td>{app.creator_login || '-'}</td>}
                                <td>{app.full_name || '-'}</td>
                                <td>{app.income ? `${app.income.toLocaleString('ru-RU')} ₽` : '-'}</td>
                                <td>{app.obligations ? `${app.obligations.toLocaleString('ru-RU')} ₽` : '-'}</td>
                                <td>
                                    {app.total_amount !== undefined && app.total_amount !== null
                                        ? `${Number(app.total_amount).toLocaleString('ru-RU')} ₽`
                                        : '-'}
                                </td>
                                <td>{app.credit_score ?? '-'}</td>
                                <td>
                                    {app.scoring_result === 'approved' && (
                                        <span className="badge bg-success">Одобрено</span>
                                    )}
                                    {app.scoring_result === 'rejected' && (
                                        <span className="badge bg-danger">Отклонено</span>
                                    )}
                                    {app.scoring_result === 'pending' && (
                                        <span className="badge bg-warning">На рассмотрении</span>
                                    )}
                                    {!app.scoring_result && '-'}
                                </td>
                                <td>
                                    {app.max_credit_amount !== undefined && app.max_credit_amount !== null
                                        ? `${Number(app.max_credit_amount).toLocaleString('ru-RU')} ₽`
                                        : '-'}
                                </td>
                                <td>{app.rejection_reason || '-'}</td>
                                <td style={{ minWidth: '95px', padding: '8px 4px' }}>
                                    <div className="d-flex flex-column" style={{ gap: '4px' }}>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => app.id && navigate(`${ROUTES.APPLICATIONS}/${app.id}`)}
                                            disabled={!app.id}
                                            className="w-100"
                                            style={{ fontSize: '11px', padding: '2px 4px' }}
                                        >
                                            Детали
                                        </Button>

                                        {isModerator && (
                                            <>
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    disabled={
                                                        !app.id ||
                                                        actionLoadingId === app.id ||
                                                        app.status !== 'formed'
                                                    }
                                                    onClick={() => app.id && moderatorAction(app.id, 'complete')}
                                                    className="w-100"
                                                    style={{ fontSize: '11px', padding: '2px 4px' }}
                                                >
                                                    {actionLoadingId === app.id ? '⏳' : '✓ ОК'}
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    disabled={
                                                        !app.id ||
                                                        actionLoadingId === app.id ||
                                                        app.status !== 'formed'
                                                    }
                                                    onClick={() => app.id && moderatorAction(app.id, 'reject')}
                                                    className="w-100"
                                                    style={{ fontSize: '11px', padding: '2px 4px' }}
                                                >
                                                    {actionLoadingId === app.id ? '⏳' : '✗ Откл'}
                                                </Button>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    disabled={!app.id || actionLoadingId === app.id}
                                                    onClick={() => app.id && startAsyncService(app.id)}
                                                    className="w-100"
                                                    style={{ fontSize: '11px', padding: '2px 4px' }}
                                                >
                                                    {actionLoadingId === app.id ? '⏳' : 'Async'}
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
                    </>
                );
            })()}
        </Container>
    );
};

export default ApplicationsListPage;

