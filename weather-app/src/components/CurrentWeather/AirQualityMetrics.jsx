import React from 'react';
import './AirQualityMetrics.css';

const AirQualityMetrics = ({ data }) => {
  const aqData = data.airQuality || {};
  
  // Get first available values
  const getValue = (arr) => {
    if (!arr || !Array.isArray(arr)) return 'N/A';
    const validValue = arr.find(v => v !== undefined && v !== null);
    return validValue !== undefined ? validValue : 'N/A';
  };
  
  const metrics = [
    { label: 'AQI (US)', value: getValue(aqData.us_aqi), icon: '🌬️', color: '#4CAF50' },
    { label: 'PM10', value: getValue(aqData.pm10) !== 'N/A' ? `${getValue(aqData.pm10)} µg/m³` : 'N/A', icon: '🏭', color: '#FF9800' },
    { label: 'PM2.5', value: getValue(aqData.pm2_5) !== 'N/A' ? `${getValue(aqData.pm2_5)} µg/m³` : 'N/A', icon: '🌫️', color: '#F44336' },
    { label: 'CO', value: getValue(aqData.carbon_monoxide) !== 'N/A' ? `${getValue(aqData.carbon_monoxide)} µg/m³` : 'N/A', icon: '💨', color: '#9C27B0' },
    { label: 'NO₂', value: getValue(aqData.nitrogen_dioxide) !== 'N/A' ? `${getValue(aqData.nitrogen_dioxide)} µg/m³` : 'N/A', icon: '🔬', color: '#2196F3' },
    { label: 'SO₂', value: getValue(aqData.sulphur_dioxide) !== 'N/A' ? `${getValue(aqData.sulphur_dioxide)} µg/m³` : 'N/A', icon: '⚗️', color: '#795548' },
  ];
  
  return (
    <div className="air-quality-section">
      <h3 className="section-title">🌿 Air Quality Metrics</h3>
      <div className="aq-grid">
        {metrics.map((metric, idx) => (
          <div key={idx} className="aq-card" style={{ borderTopColor: metric.color }}>
            <div className="aq-icon">{metric.icon}</div>
            <div className="aq-label">{metric.label}</div>
            <div className="aq-value">{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirQualityMetrics;