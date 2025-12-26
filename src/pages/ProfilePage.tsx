import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { Container, Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { getUserProfileAsync, updateUserProfileAsync, clearError } from '../slices/authSlice';
import { BreadCrumbs } from '../components/Breadcrumbs';
import { ROUTES, ROUTE_LABELS } from '../Routes';

const ProfilePage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { user, loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string>('');

    // Редирект если не авторизован
    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN);
        }
    }, [isAuthenticated, navigate]);

    // Загрузка профиля
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getUserProfileAsync());
        }
    }, [dispatch, isAuthenticated]);

    // Обновление формы при загрузке профиля
    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email || '',
                full_name: user.full_name || '',
                phone: user.phone || '',
                password: '',
                confirmPassword: '',
            });
        }
    }, [user]);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Введите корректный email адрес';
        }

        if (formData.password && formData.password.length < 6) {
            errors.password = 'Пароль должен быть не менее 6 символов';
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Пароли не совпадают';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Очищаем ошибку валидации для этого поля
        if (validationErrors[e.target.name]) {
            setValidationErrors({
                ...validationErrors,
                [e.target.name]: '',
            });
        }
        // Очищаем общую ошибку и сообщение об успехе
        if (error) {
            dispatch(clearError());
        }
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const updateData: any = {};
        if (formData.email) updateData.email = formData.email;
        if (formData.full_name !== undefined) updateData.full_name = formData.full_name;
        if (formData.phone !== undefined) updateData.phone = formData.phone;
        if (formData.password) updateData.password = formData.password;

        const result = await dispatch(updateUserProfileAsync(updateData));
        if (updateUserProfileAsync.fulfilled.match(result)) {
            setSuccessMessage('Профиль успешно обновлен');
            setFormData({
                ...formData,
                password: '',
                confirmPassword: '',
            });
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Container style={{ maxWidth: '600px', marginTop: '30px' }}>
            <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.PROFILE }]} />
            <h1 style={{ marginBottom: '30px', color: '#0b1f35' }}>{ROUTE_LABELS.PROFILE}</h1>

            <Card>
                <Card.Header>
                    <h4>Редактирование профиля</h4>
                </Card.Header>
                <Card.Body>
                    {error && (
                        <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
                            {error}
                        </Alert>
                    )}
                    {successMessage && (
                        <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
                            {successMessage}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username" className="mb-3">
                            <Form.Label>Имя пользователя</Form.Label>
                            <Form.Control type="text" value={user?.username || ''} disabled />
                            <Form.Text className="text-muted">Имя пользователя нельзя изменить</Form.Text>
                        </Form.Group>

                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Введите email"
                                disabled={loading}
                                isInvalid={!!validationErrors.email}
                            />
                            {validationErrors.email && (
                                <Form.Control.Feedback type="invalid">
                                    {validationErrors.email}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>

                        <Form.Group controlId="full_name" className="mb-3">
                            <Form.Label>Полное имя</Form.Label>
                            <Form.Control
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="Введите полное имя"
                                disabled={loading}
                            />
                        </Form.Group>

                        <Form.Group controlId="phone" className="mb-3">
                            <Form.Label>Телефон</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Введите номер телефона"
                                disabled={loading}
                            />
                        </Form.Group>

                        <hr />

                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label>Новый пароль</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Оставьте пустым, чтобы не менять пароль"
                                disabled={loading}
                                isInvalid={!!validationErrors.password}
                            />
                            {validationErrors.password && (
                                <Form.Control.Feedback type="invalid">
                                    {validationErrors.password}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>

                        {formData.password && (
                            <Form.Group controlId="confirmPassword" className="mb-3">
                                <Form.Label>Подтверждение пароля</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Подтвердите новый пароль"
                                    disabled={loading}
                                    isInvalid={!!validationErrors.confirmPassword}
                                />
                                {validationErrors.confirmPassword && (
                                    <Form.Control.Feedback type="invalid">
                                        {validationErrors.confirmPassword}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        )}

                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                            style={{ width: '100%', backgroundColor: '#0b1f35', borderColor: '#0b1f35' }}
                        >
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" style={{ marginRight: '10px' }} />
                                    Сохранение...
                                </>
                            ) : (
                                'Сохранить изменения'
                            )}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ProfilePage;

