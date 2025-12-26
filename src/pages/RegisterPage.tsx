import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { Form, Button, Alert, Container, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { registerUserAsync, clearError } from '../slices/authSlice';

const RegisterPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { loading, error } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        full_name: '',
        phone: '',
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Очистка ошибки при размонтировании
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (formData.username.length < 3 || formData.username.length > 50) {
            errors.username = 'Имя пользователя должно быть от 3 до 50 символов';
        }

        if (formData.password.length < 6) {
            errors.password = 'Пароль должен быть не менее 6 символов';
        }

        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Введите корректный email адрес';
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
        // Очищаем общую ошибку при изменении полей
        if (error) {
            dispatch(clearError());
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const result = await dispatch(registerUserAsync(formData));
        if (registerUserAsync.fulfilled.match(result)) {
            // После успешной регистрации переходим на страницу логина
            navigate('/login', { state: { message: 'Регистрация успешна! Войдите в систему.' } });
        }
    };

    return (
        <Container style={{ maxWidth: '500px', marginTop: '50px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#0b1f35' }}>
                Регистрация
            </h2>
            {error && (
                <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
                    {error}
                </Alert>
            )}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" style={{ marginBottom: '20px' }}>
                    <Form.Label>Имя пользователя *</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Введите имя пользователя (3-50 символов)"
                        required
                        disabled={loading}
                        isInvalid={!!validationErrors.username}
                    />
                    {validationErrors.username && (
                        <Form.Control.Feedback type="invalid">
                            {validationErrors.username}
                        </Form.Control.Feedback>
                    )}
                </Form.Group>
                <Form.Group controlId="email" style={{ marginBottom: '20px' }}>
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Введите email"
                        required
                        disabled={loading}
                        isInvalid={!!validationErrors.email}
                    />
                    {validationErrors.email && (
                        <Form.Control.Feedback type="invalid">
                            {validationErrors.email}
                        </Form.Control.Feedback>
                    )}
                </Form.Group>
                <Form.Group controlId="password" style={{ marginBottom: '20px' }}>
                    <Form.Label>Пароль *</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Введите пароль (минимум 6 символов)"
                        required
                        disabled={loading}
                        isInvalid={!!validationErrors.password}
                    />
                    {validationErrors.password && (
                        <Form.Control.Feedback type="invalid">
                            {validationErrors.password}
                        </Form.Control.Feedback>
                    )}
                </Form.Group>
                <Form.Group controlId="full_name" style={{ marginBottom: '20px' }}>
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
                <Form.Group controlId="phone" style={{ marginBottom: '30px' }}>
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
                <Button
                    variant="primary"
                    type="submit"
                    style={{
                        width: '100%',
                        backgroundColor: '#0b1f35',
                        borderColor: '#0b1f35',
                        padding: '12px',
                    }}
                    disabled={loading || !formData.username || !formData.password || !formData.email}
                >
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" style={{ marginRight: '10px' }} />
                            Регистрация...
                        </>
                    ) : (
                        'Зарегистрироваться'
                    )}
                </Button>
            </Form>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p>
                    Уже есть аккаунт?{' '}
                    <Button
                        variant="link"
                        onClick={() => navigate('/login')}
                        style={{ padding: 0, textDecoration: 'underline' }}
                    >
                        Войти
                    </Button>
                </p>
            </div>
        </Container>
    );
};

export default RegisterPage;

