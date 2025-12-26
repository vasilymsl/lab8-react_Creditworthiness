import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { 
    useFilter, 
    setTitleAction, 
    resetFilterAction 
} from '../slices/filterSlice';

interface Props {
    onFilter: (filter: { title?: string }) => void;
}

export const Filter: React.FC<Props> = ({ onFilter }) => {
    const dispatch = useDispatch();
    const { title } = useFilter();

    const handleSubmit = () => {
        onFilter({ title });
    };

    const handleReset = () => {
        dispatch(resetFilterAction());
        onFilter({});
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginBottom: '25px',
            alignItems: 'center',
            flexWrap: 'wrap'
        }}>
            <Form.Control 
                placeholder="Поиск" 
                value={title} 
                onChange={e => dispatch(setTitleAction(e.target.value))}
                onKeyPress={handleKeyPress}
                style={{ 
                    flex: '1 1 300px',
                    backgroundColor: '#D9D9D9',
                    border: '1px solid #e0e0e0',
                    padding: '12px 15px',
                    fontSize: '1rem'
                }}
            />
            <Button 
                onClick={handleSubmit}
                style={{ 
                    backgroundColor: '#0b1f35', 
                    borderColor: '#0b1f35',
                    padding: '12px 30px',
                    fontWeight: '500'
                }}
            >
                Найти
            </Button>
            {title && (
                <Button 
                    variant="outline-secondary"
                    onClick={handleReset}
                    style={{ 
                        padding: '12px 20px',
                        borderColor: '#e0e0e0'
                    }}
                >
                    Сброс
                </Button>
            )}
        </div>
    );
};

