import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from '../Routes';
import { DsOrderResponse } from '../api';
import { transformImageUrl } from '../target_config';
import { AppDispatch, RootState } from '../store';
import { addScoringServiceToApplicationAsync } from '../slices/applicationSlice';

// Локальная заглушка (цветной квадрат)
const defaultImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23F0F0F0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

interface Props {
    service: DsOrderResponse;
}

export const ServiceCard: React.FC<Props> = ({ service }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { loading } = useSelector((state: RootState) => state.application);

    // Нормализация полей
    const title = service.title || "Без названия";
    const description = service.description || "";
    const rate = service.rate || "";
    const term = service.term || "";
    const id = service.id;
    // Преобразуем URL картинки для Tauri (localhost -> IP)
    const rawImageURL = service.image_url || "";
    const imageURL = transformImageUrl(rawImageURL) || defaultImage;

    const handleAddToApplication = async () => {
        if (!id) return;
        // Без всплывающих плашек/спиннеров — минимальные эффекты.
        await dispatch(addScoringServiceToApplicationAsync(id));
    };

    return (
        <Card className="card" style={{ width: '100%', border: '1px solid #e0e0e0' }}>
            <Card.Img
                variant="top"
                src={imageURL}
                height={200}
                style={{ objectFit: 'contain', backgroundColor: '#F0F0F0', padding: '10px' }}
                onError={(e) => { e.currentTarget.src = defaultImage; }}
            />
            <Card.Body style={{ padding: '20px' }}>
                <Card.Title style={{ color: '#000', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '15px' }}>
                    {title}
                </Card.Title>
                <Card.Text style={{ color: '#555', fontSize: '0.9rem', marginBottom: '10px' }}>
                    {description && <span style={{ display: 'block', marginBottom: '10px' }}>{description.substring(0, 100)}...</span>}
                    {rate && <span style={{ display: 'block', color: '#666' }}>• Точность: {rate}</span>}
                    {term && <span style={{ display: 'block', color: '#666' }}>• Срок: {term}</span>}
                </Card.Text>

                <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link to={id ? `${ROUTES.SERVICES}/${id}` : ROUTES.SERVICES} style={{ textDecoration: 'none' }}>
                        <Button
                            style={{
                                width: '100%',
                                backgroundColor: '#0b1f35',
                                borderColor: '#0b1f35',
                                padding: '10px'
                            }}
                            disabled={!id}
                        >
                            Подробнее
                        </Button>
                    </Link>
                    {isAuthenticated && (
                        <Button
                            variant="danger"
                            onClick={handleAddToApplication}
                            disabled={loading || !id}
                            style={{ width: '100%', padding: '10px' }}
                        >
                            Добавить в заявку
                        </Button>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
}
