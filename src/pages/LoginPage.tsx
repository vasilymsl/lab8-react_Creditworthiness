import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { Form, Button, Alert, Container, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { loginUserAsync, clearError } from '../slices/authSlice';
import { ROUTES } from '../Routes';

const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    // Редирект если уже авторизован
    useEffect(() => {
        if (isAuthenticated) {
            navigate(ROUTES.SERVICES);
        }
    }, [isAuthenticated, navigate]);

    // Очистка ошибки при размонтировании
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Очищаем ошибку при изменении полей
        if (error) {
            dispatch(clearError());
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (formData.username && formData.password) {
            const result = await dispatch(loginUserAsync(formData));
            if (loginUserAsync.fulfilled.match(result)) {
                navigate(ROUTES.SERVICES);
            }
        }
    };

    return (
        <Container style={{ maxWidth: '500px', marginTop: '100px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#0b1f35' }}>
                Вход в систему
            </h2>
            {error && (
                <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
                    {error}
                </Alert>
            )}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" style={{ marginBottom: '20px' }}>
                    <Form.Label>Имя пользователя</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Введите имя пользователя"
                        required
                        disabled={loading}
                    />
                </Form.Group>
                <Form.Group controlId="password" style={{ marginBottom: '30px' }}>
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Введите пароль"
                        required
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
                    disabled={loading || !formData.username || !formData.password}
                >
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" style={{ marginRight: '10px' }} />
                            Вход...
                        </>
                    ) : (
                        'Войти'
                    )}
                </Button>
            </Form>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p>
                    Нет аккаунта?{' '}
                    <Button
                        variant="link"
                        onClick={() => navigate('/register')}
                        style={{ padding: 0, textDecoration: 'underline' }}
                    >
                        Зарегистрироваться
                    </Button>
                </p>
            </div>
        </Container>
    );
};

export default LoginPage;

