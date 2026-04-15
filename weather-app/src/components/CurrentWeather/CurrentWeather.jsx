import React, { useState, useEffect } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useWeatherData } from '../../hooks/useWeatherData';
import WeatherMetrics from './WeatherMetrics';
import AirQualityMetrics from './AirQualityMetrics';
import HourlyForecast from '../HourlyForecast/HourlyForecast';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import './CurrentWeather.css';
import dayjs from 'dayjs';

const CurrentWeather = () => {
  const { location, loading: locLoading, error: locError } = useGeolocation();
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const { data, loading, error, refetch } = useWeatherData(location, selectedDate);
  
  // Refetch when selected date changes
  useEffect(() => {
    if (location) {
      refetch();
    }
  }, [selectedDate, location, refetch]);
  
  if (locLoading || loading) return <LoadingSpinner />;
  if (locError || error) return <ErrorMessage message={locError || error} />;
  if (!data) return null;
  
  // Get current date data
  const today = dayjs().format('YYYY-MM-DD');
  const isToday = selectedDate === today;
  
  return (
    <div className="current-weather">
      <div className="date-selector">
        <label>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={dayjs().add(7, 'day').format('YYYY-MM-DD')}
          min={dayjs().subtract(30, 'day').format('YYYY-MM-DD')}
          className="date-input"
        />
        <span className="date-note">
          {isToday ? '(Today\'s weather)' : '(Forecast/Past data)'}
        </span>
      </div>
      
      <WeatherMetrics data={data} />
      {isToday && <AirQualityMetrics data={data} />}
      <HourlyForecast data={data} selectedDate={selectedDate} />
    </div>
  );
};

export default CurrentWeather;