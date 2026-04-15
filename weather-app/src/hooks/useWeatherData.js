import { useState, useEffect, useCallback } from 'react';
import { weatherService } from '../services/weatherService';
import dayjs from 'dayjs';

export const useWeatherData = (location, selectedDate, isHistorical = false, dateRange = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = useCallback(async () => {
    if (!location) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let result;
      if (isHistorical && dateRange?.startDate && dateRange?.endDate) {
        // Validate date range (max 2 years)
        const start = dayjs(dateRange.startDate);
        const end = dayjs(dateRange.endDate);
        const diffYears = end.diff(start, 'year', true);
        
        if (diffYears > 2) {
          throw new Error('Date range cannot exceed 2 years');
        }
        
        result = await weatherService.getHistoricalWeather(
          location.lat,
          location.lon,
          dateRange.startDate,
          dateRange.endDate
        );
      } else {
        result = await weatherService.getCurrentWeather(
          location.lat,
          location.lon,
          selectedDate
        );
      }
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [location, selectedDate, isHistorical, dateRange]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return { data, loading, error, refetch: fetchData };
};