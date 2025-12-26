import React, { useEffect, useMemo } from 'react';
import { Container, Spinner, Image, Button, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { getScoringModelByIdAsync, clearCurrentScoringModel } from '../slices/servicesSlice';
import { ROUTES } from '../Routes';
import { QRCodeCanvas } from 'qrcode.react';
import { server_ip, target_tauri, transformImageUrl, dest_root } from '../target_config';

const defaultImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23F0F0F0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

export const ServiceDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { currentScoringModel, loading, error } = useSelector((s: RootState) => s.services);

    // ЛР8 (доп): QR-код на страницу "Подробнее", чтобы открыть на телефоне по ZeroTier-IP
    // ВАЖНО: useMemo должен быть ДО любых early returns (правило React Hooks)
    const shareUrl = useMemo(() => {
        if (!id) return "";

        // Базово берем текущий URL
        let urlString = window.location.href;

        // В режиме Tauri URL может быть tauri://..., строим вручную для телефона
        if (target_tauri || window.location.protocol === "tauri:") {
            // В dev по умолчанию Vite работает на 3000 (см vite.config.ts)
            return `http://${server_ip}:3000${dest_root}${ROUTES.SERVICES}/${id}`;
        }

        try {
            const u = new URL(urlString);
            if (u.hostname === "localhost" || u.hostname === "127.0.0.1") {
                u.hostname = server_ip; // сюда пользователь ставит ZeroTier-IP
            }
            return u.toString();
        } catch {
            // fallback
            return `http://${server_ip}:3000${dest_root}${ROUTES.SERVICES}/${id}`;
        }
    }, [id]);

    useEffect(() => {
        if (!id) return;
        dispatch(getScoringModelByIdAsync(Number(id)));
        return () => {
            dispatch(clearCurrentScoringModel());
        };
    }, [dispatch, id]);

    if (loading) {
         return (
            <Container className="d-flex justify-content-center mt-5">
                <Spinner animation="border" style={{ color: '#0b1f35' }} />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (!currentScoringModel) {
        return <Container className="mt-5" style={{ color: '#333' }}>Услуга не найдена</Container>;
    }

    // Нормализация полей
    const title = currentScoringModel.title || "Без названия";
    const description = currentScoringModel.description || "";
    const rate = currentScoringModel.rate || "";
    const term = currentScoringModel.term || "";
    // Преобразуем URL картинки для Tauri (localhost -> IP)
    const rawImageURL = currentScoringModel.image_url || "";
    const imageURL = transformImageUrl(rawImageURL) || defaultImage;

    return (
        <Container style={{ paddingTop: '20px' }}>
            {/* Кнопка назад */}
            <Link to={ROUTES.SERVICES}>
                <Button 
                    style={{ 
                        backgroundColor: '#ef3124', 
                        borderColor: '#ef3124',
                        marginBottom: '25px',
                        padding: '10px 25px'
                    }}
                >
                    ← Назад на главную
                </Button>
            </Link>

            <div className="service-detail-container">
                <div className="service-detail-image">
                    <Image 
                        src={imageURL} 
                        alt={title} 
                        fluid 
                        style={{ 
                            borderRadius: '8px', 
                            backgroundColor: '#F0F0F0',
                            padding: '20px',
                            maxHeight: '300px',
                            objectFit: 'contain'
                        }}
                        onError={(e) => { e.currentTarget.src = defaultImage; }}
                    />
                </div>
                <div className="service-detail-info">
                    <h2 style={{ color: '#000', fontWeight: 'bold', marginBottom: '20px' }}>{title}</h2>
                    
                    <div style={{ marginBottom: '20px' }}>
                        {rate && <p style={{ color: '#333', margin: '8px 0' }}>• Точность: {rate}</p>}
                        {term && <p style={{ color: '#333', margin: '8px 0' }}>• Время расчёта: {term}</p>}
                    </div>
                    
                    {description && (
                        <>
                            <h4 style={{ color: '#000', fontWeight: 'bold', marginTop: '30px' }}>Описание:</h4>
                            <p style={{ color: '#555', lineHeight: '1.7' }}>{description}</p>
                        </>
                    )}

                    {/* QR для открытия этой страницы на телефоне */}
                    {shareUrl && (
                        <div style={{ marginTop: '30px' }}>
                            <h4 style={{ color: '#000', fontWeight: 'bold' }}>QR-код (ЛР8)</h4>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '16px',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    padding: '12px',
                                    border: '1px solid #eee',
                                    borderRadius: '8px',
                                    background: '#fff',
                                }}
                            >
                                <QRCodeCanvas value={shareUrl} size={160} includeMargin />
                                <div style={{ maxWidth: '520px' }}>
                                    <div style={{ color: '#555', marginBottom: '8px' }}>
                                        Отсканируй QR телефоном — откроется эта страница по адресу в локальной сети (ZeroTier).
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#777', wordBreak: 'break-all' }}>
                                        {shareUrl}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
};

