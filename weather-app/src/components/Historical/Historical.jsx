import React, { useState, useEffect } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useWeatherData } from '../../hooks/useWeatherData';
import HistoricalCharts from './HistoricalCharts';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import './Historical.css';
import dayjs from 'dayjs';

const Historical = () => {
  const { location, loading: locLoading, error: locError } = useGeolocation();
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD')
  });
  const [rangeError, setRangeError] = useState(null);
  
  const { data, loading, error, refetch } = useWeatherData(location, null, true, dateRange);
  
  useEffect(() => {
    if (location) {
      // Validate date range
      const start = dayjs(dateRange.startDate);
      const end = dayjs(dateRange.endDate);
      const diffYears = end.diff(start, 'year', true);
      
      if (diffYears > 2) {
        setRangeError('Date range cannot exceed 2 years');
      } else if (start.isAfter(end)) {
        setRangeError('Start date must be before end date');
      } else {
        setRangeError(null);
        refetch();
      }
    }
  }, [dateRange, location, refetch]);
  
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };
  
  const maxStartDate = dayjs().subtract(2, 'year').format('YYYY-MM-DD');
  const minEndDate = dateRange.startDate;
  
  if (locLoading || loading) return <LoadingSpinner />;
  if (locError || error) return <ErrorMessage message={locError || error || rangeError} />;
  if (!data) return null;
  
  return (
    <div className="historical">
      <div className="date-range-selector">
        <div className="range-input">
          <label>Start Date (Max 2 years ago)</label>
          <input
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
            min={maxStartDate}
            max={minEndDate}
          />
        </div>
        <div className="range-input">
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
            min={minEndDate}
            max={dayjs().format('YYYY-MM-DD')}
          />
        </div>
      </div>
      {rangeError && <div className="range-error">{rangeError}</div>}
      <HistoricalCharts data={data} dateRange={dateRange} />
    </div>
  );
};

export default Historical;