import React from "react";
import { Container, Carousel } from "react-bootstrap";

export const HomePage: React.FC = () => {
  return (
    <Container className="mt-4 mt-md-5">
      <h1 className="mb-3 mb-md-4 text-center" style={{ color: '#0b1f35' }}>
        Оценка кредитоспособности
      </h1>
      <p className="text-center mb-4 mb-md-5 px-2" style={{ color: '#555' }}>
        Добро пожаловать в систему скоринга кредитных заявок.
        Здесь вы можете ознакомиться с доступными услугами оценки.
      </p>
      
      <Carousel className="home-carousel mb-4 mb-md-5">
        <Carousel.Item>
          <div 
            style={{ 
              background: "#0b1f35", 
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              borderRadius: '8px',
              padding: '20px'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📊</div>
            <div
              style={{
                background: "rgba(0,0,0,0.35)",
                padding: "14px 18px",
                borderRadius: "12px",
                textAlign: "center",
                maxWidth: "820px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#fff",
                  textAlign: "center",
                  textShadow: "0 2px 12px rgba(0,0,0,0.65)",
                }}
              >
                Быстрая обработка заявок
              </h3>
              <p
                style={{
                  margin: "10px 0 0",
                  color: "rgba(255,255,255,0.92)",
                  fontSize: "16px",
                  textShadow: "0 2px 10px rgba(0,0,0,0.55)",
                }}
              >
                Быстрые расчёты • единый интерфейс • прозрачные статусы
              </p>
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div 
            style={{ 
              background: "#142a47", 
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              borderRadius: '8px',
              padding: '20px'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>💳</div>
            <div
              style={{
                background: "rgba(0,0,0,0.35)",
                padding: "14px 18px",
                borderRadius: "12px",
                textAlign: "center",
                maxWidth: "820px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#fff",
                  textAlign: "center",
                  textShadow: "0 2px 12px rgba(0,0,0,0.65)",
                }}
              >
                Прозрачная система оценки
              </h3>
              <p
                style={{
                  margin: "10px 0 0",
                  color: "rgba(255,255,255,0.92)",
                  fontSize: "16px",
                  textShadow: "0 2px 10px rgba(0,0,0,0.55)",
                }}
              >
                История заявок • фильтрация • просмотр результатов
              </p>
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div 
            style={{ 
              background: "#1a3453", 
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              borderRadius: '8px',
              padding: '20px'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏠</div>
            <div
              style={{
                background: "rgba(0,0,0,0.35)",
                padding: "14px 18px",
                borderRadius: "12px",
                textAlign: "center",
                maxWidth: "820px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#fff",
                  textAlign: "center",
                  textShadow: "0 2px 12px rgba(0,0,0,0.65)",
                }}
              >
                Надёжная защита данных
              </h3>
              <p
                style={{
                  margin: "10px 0 0",
                  color: "rgba(255,255,255,0.92)",
                  fontSize: "16px",
                  textShadow: "0 2px 10px rgba(0,0,0,0.55)",
                }}
              >
                Авторизация • JWT • контроль доступа по ролям
              </p>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
    </Container>
  );
};

