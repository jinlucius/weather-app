import React from 'react';
import './WeatherMetrics.css';

const WeatherMetrics = ({ data }) => {
  // Extract data safely
  const currentTemp = data.current?.temperature_2m || data.hourly?.temperature_2m?.[0] || '--';
  const minTemp = data.daily?.temperature_2m_min?.[0] || '--';
  const maxTemp = data.daily?.temperature_2m_max?.[0] || '--';
  const precipitation = data.current?.precipitation || data.hourly?.precipitation?.[0] || '0';
  const humidity = data.current?.relativehumidity_2m || data.hourly?.relativehumidity_2m?.[0] || '--';
  const uvIndex = data.daily?.uv_index_max?.[0] || '--';
  const sunrise = data.daily?.sunrise?.[0]?.split('T')[1] || '--';
  const sunset = data.daily?.sunset?.[0]?.split('T')[1] || '--';
  const windSpeed = data.daily?.windspeed_10m_max?.[0] || data.current?.windspeed_10m || '--';
  const precipProb = data.daily?.precipitation_probability_max?.[0] || '0';
  
  const metrics = [
    { label: 'Current Temp', value: `${currentTemp}°C`, icon: '🌡️' },
    { label: 'Min Temp', value: `${minTemp}°C`, icon: '📉' },
    { label: 'Max Temp', value: `${maxTemp}°C`, icon: '📈' },
    { label: 'Precipitation', value: `${precipitation} mm`, icon: '🌧️' },
    { label: 'Humidity', value: `${humidity}%`, icon: '💧' },
    { label: 'UV Index', value: uvIndex, icon: '☀️' },
    { label: 'Sunrise', value: sunrise, icon: '🌅' },
    { label: 'Sunset', value: sunset, icon: '🌇' },
    { label: 'Max Wind Speed', value: `${windSpeed} km/h`, icon: '💨' },
    { label: 'Precip Probability', value: `${precipProb}%`, icon: '🎯' },
  ];
  
  return (
    <div className="metrics-grid">
      {metrics.map((metric, idx) => (
        <div key={idx} className="metric-card">
          <div className="metric-icon">{metric.icon}</div>
          <div className="metric-label">{metric.label}</div>
          <div className="metric-value">{metric.value}</div>
        </div>
      ))}
    </div>
  );
};

export default WeatherMetrics;