import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, ROUTE_LABELS } from '../Routes';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { getScoringApplicationBasketAsync } from '../slices/applicationSlice';
import { logoutUserAsync } from '../slices/authSlice';
import { resetFilterAction } from '../slices/filterSlice';
import { resetApplication } from '../slices/applicationSlice';

export const NavbarComp = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const { draftApplicationId, productCount } = useSelector((state: RootState) => state.application);

    // Загружаем корзину при монтировании, если пользователь авторизован
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getScoringApplicationBasketAsync());
        }
    }, [dispatch, isAuthenticated]);

    const handleLogout = async () => {
        await dispatch(logoutUserAsync());
        dispatch(resetFilterAction());
        dispatch(resetApplication());
        navigate(ROUTES.HOME);
    };

    const handleBasketClick = () => {
        if (isAuthenticated && draftApplicationId) {
            navigate(`${ROUTES.APPLICATIONS}/${draftApplicationId}`);
        }
    };

    return (
        <Navbar expand="lg" style={{ backgroundColor: '#0b1f35' }}>
            <Container>
                <Navbar.Brand as={Link} to={ROUTES.HOME} style={{ color: 'white', fontWeight: 'bold' }}>
                    🏛️ Оценка кредитоспособности
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'rgba(255,255,255,0.5)' }}>
                    <span style={{ color: 'white' }}>☰</span>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={ROUTES.HOME} style={{ color: 'white' }}>
                            {ROUTE_LABELS.HOME}
                        </Nav.Link>
                        <Nav.Link as={Link} to={ROUTES.SERVICES} style={{ color: 'white' }}>
                            {ROUTE_LABELS.SERVICES}
                        </Nav.Link>
                        {isAuthenticated && (
                            <Nav.Link as={Link} to={ROUTES.APPLICATIONS} style={{ color: 'white' }}>
                                {ROUTE_LABELS.APPLICATIONS}
                            </Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        {isAuthenticated ? (
                            <>
                                <Nav.Link
                                    as={Button}
                                    variant="link"
                                    onClick={handleBasketClick}
                                    disabled={!draftApplicationId}
                                    style={{
                                        color: draftApplicationId ? 'white' : 'rgba(255,255,255,0.5)',
                                        textDecoration: 'none',
                                        cursor: draftApplicationId ? 'pointer' : 'not-allowed',
                                        position: 'relative',
                                    }}
                                >
                                    🛒
                                    {productCount > 0 && (
                                        <Badge
                                            bg="danger"
                                            style={{
                                                position: 'absolute',
                                                top: '-4px',
                                                right: '-8px',
                                                fontSize: '0.7rem',
                                            }}
                                        >
                                            {productCount}
                                        </Badge>
                                    )}
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to={ROUTES.PROFILE}
                                    style={{ color: 'white', fontWeight: 'bold' }}
                                >
                                    {user?.username || user?.full_name || 'Профиль'}
                                </Nav.Link>
                                <Nav.Link
                                    as={Button}
                                    variant="link"
                                    onClick={handleLogout}
                                    style={{ color: 'white', textDecoration: 'none' }}
                                >
                                    Выйти
                                </Nav.Link>
                            </>
                        ) : (
                            <Nav.Link as={Link} to={ROUTES.LOGIN} style={{ color: 'white' }}>
                                Войти
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
