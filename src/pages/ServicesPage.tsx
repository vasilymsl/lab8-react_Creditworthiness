import React, { useEffect } from 'react';
import { Alert, Container, Spinner } from 'react-bootstrap';
import { ServiceCard } from '../components/ServiceCard';
import { Filter } from '../components/Filter';
import { BreadCrumbs } from '../components/Breadcrumbs';
import { ROUTE_LABELS } from '../Routes';
import { useFilter } from '../slices/filterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { getScoringModelsAsync } from '../slices/servicesSlice';

export const ServicesPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { scoringModels, loading, error } = useSelector((s: RootState) => s.services);

    const filterState = useFilter();

    const fetchServices = async (filter: { title?: string } = {}) => {
        await dispatch(getScoringModelsAsync({ title: filter.title || undefined }));
    };

    // При монтировании компонента загружаем данные с учётом сохранённого фильтра
    useEffect(() => {
        fetchServices({ title: filterState.title || undefined });
    }, []); // Только при монтировании

    return (
        <Container>
            <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.SERVICES }]} />
            <h1>{ROUTE_LABELS.SERVICES}</h1>
            <Filter onFilter={fetchServices} />
            
            {loading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <div className="services-grid">
                    {scoringModels.map((model) => (
                        <div key={model.id} className="service-card-wrapper">
                            <ServiceCard service={model} />
                        </div>
                    ))}
                </div>
            )}
        </Container>
    );
};

