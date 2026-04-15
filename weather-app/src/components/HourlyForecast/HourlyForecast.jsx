import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import './HourlyForecast.css';

const HourlyForecast = ({ data, selectedDate }) => {
  const [unit, setUnit] = useState('celsius');
  const hourlyData = data.hourly || {};
  const times = hourlyData.time || [];
  
  const convertTemp = (temp) => {
    if (!temp && temp !== 0) return null;
    if (unit === 'fahrenheit') return (temp * 9/5 + 32).toFixed(1);
    return temp;
  };
  
  // Common chart options that work correctly
const getChartOptions = (yaxisConfig) => ({
  chart: {
    background: 'transparent',
    foreColor: '#fff', // ⭐ sab default text white
    toolbar: {
      show: true
    }
  },

  theme: {
    mode: 'dark' // ⭐ important
  },

  xaxis: {
    categories: times.map(t => t ? t.split('T')[1] : ''),
    title: {
      text: 'Hour of Day (IST)',
      style: {
        color: '#fff',
        fontSize: '12px'
      }
    },
    labels: {
      style: {
        colors: '#fff'
      }
    },
    axisBorder: {
      color: '#aaa'
    },
    axisTicks: {
      color: '#aaa'
    }
  },

  yaxis: {
    ...yaxisConfig,
    title: {
      text: yaxisConfig?.title?.text,
      style: {
        color: '#fff'
      }
    },
    labels: {
      style: {
        colors: '#fff'
      }
    }
  },

  grid: {
    borderColor: 'rgba(255,255,255,0.2)'
  },

  legend: {
    labels: {
      colors: '#fff'
    }
  },

  tooltip: {
    theme: 'dark'
  }
});
  
  // Prepare data safely
  const safeData = (arr) => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.map(v => v !== undefined && v !== null ? v : 0);
  };
  
  const charts = [
    {
      title: 'Temperature',
      series: [{ name: 'Temperature', data: safeData(hourlyData.temperature_2m).map(t => convertTemp(t)) }],
      yaxis: { title: { text: `Temperature (${unit === 'celsius' ? '°C' : '°F'})` }, min: null, max: null }
    },
    {
      title: 'Relative Humidity',
      series: [{ name: 'Humidity', data: safeData(hourlyData.relativehumidity_2m) }],
      yaxis: { title: { text: 'Humidity (%)' }, min: 0, max: 100 }
    },
    {
      title: 'Precipitation',
      series: [{ name: 'Precipitation', data: safeData(hourlyData.precipitation) }],
      yaxis: { title: { text: 'Precipitation (mm)' }, min: 0 }
    },
    {
      title: 'Visibility',
      series: [{ name: 'Visibility', data: safeData(hourlyData.visibility) }],
      yaxis: { title: { text: 'Visibility (m)' } }
    },
    {
      title: 'Wind Speed (10m)',
      series: [{ name: 'Wind Speed', data: safeData(hourlyData.windspeed_10m) }],
      yaxis: { title: { text: 'Wind Speed (km/h)' } }
    },
    {
      title: 'PM10 & PM2.5',
      series: [
        { name: 'PM10', data: safeData(hourlyData.pm10) },
        { name: 'PM2.5', data: safeData(hourlyData.pm2_5) }
      ],
      yaxis: { title: { text: 'Concentration (µg/m³)' } }
    }
  ];
  
  // If no data, show message
  if (!times || times.length === 0) {
    return (
      <div className="hourly-forecast">
        <div className="no-data-message">
          <p>No hourly data available for the selected date.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="hourly-forecast">
      <div className="hourly-header">
        <h3>Hourly Forecast for {selectedDate}</h3>
        <div className="temp-toggle">
          <button 
            onClick={() => setUnit('celsius')} 
            className={unit === 'celsius' ? 'active' : ''}
          >
            °C
          </button>
          <button 
            onClick={() => setUnit('fahrenheit')} 
            className={unit === 'fahrenheit' ? 'active' : ''}
          >
            °F
          </button>
        </div>
      </div>
      
      <div className="charts-container">
        {charts.map((chart, idx) => (
          <div key={idx} className="chart-wrapper">
            <h4>{chart.title}</h4>
            <div className="chart-scroll">
              <ReactApexChart
                options={getChartOptions(chart.yaxis, chart.series)}
                series={chart.series}
                type="line"
                height={350}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;