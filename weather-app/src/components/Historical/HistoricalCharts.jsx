import React from 'react';
import ReactApexChart from 'react-apexcharts';
import './HistoricalCharts.css';

const HistoricalCharts = ({ data, dateRange }) => {
  const dailyData = data.daily || {};
  const dates = dailyData.time || [];
  
  const getChartOptions = (yaxisConfig, chartType = 'line') => ({
    chart: {
      type: chartType,
      height: 380,
      zoom: { enabled: true, type: 'x', autoScaleYaxis: true },
      toolbar: { show: true, autoSelected: 'zoom' },
      animations: { enabled: true }
    },
    xaxis: {
      categories: dates,
      title: { text: 'Date' },
      labels: { rotate: -45, style: { fontSize: '10px' } }
    },
    yaxis: yaxisConfig,
    stroke: { curve: 'smooth', width: 2 },
    markers: { size: 3 },
    tooltip: { shared: true, intersect: false, enabled: true },
    legend: { position: 'top' },
    responsive: [{
      breakpoint: 768,
      options: { chart: { height: 280 }, xaxis: { labels: { rotate: -90 } } }
    }]
  });
  
  const safeData = (arr) => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.map(v => v !== undefined && v !== null ? v : 0);
  };
  
  const charts = [
    {
      title: 'Temperature Trends (Mean, Max, Min)',
      series: [
        { name: 'Mean Temp', data: safeData(dailyData.temperature_2m_mean) },
        { name: 'Max Temp', data: safeData(dailyData.temperature_2m_max) },
        { name: 'Min Temp', data: safeData(dailyData.temperature_2m_min) }
      ],
      yaxis: { title: { text: 'Temperature (°C)' } }
    },
    {
      title: 'Sun Cycle (IST)',
      series: [
        { name: 'Sunrise', data: (dailyData.sunrise || []).map(s => s ? s.split('T')[1] : '--') },
        { name: 'Sunset', data: (dailyData.sunset || []).map(s => s ? s.split('T')[1] : '--') }
      ],
      yaxis: { title: { text: 'Time (IST)' } }
    },
    {
      title: 'Total Precipitation',
      series: [{ name: 'Precipitation', data: safeData(dailyData.precipitation_sum) }],
      yaxis: { title: { text: 'Precipitation (mm)' } },
      type: 'bar'
    },
    {
      title: 'Max Wind Speed',
      series: [{ name: 'Max Wind Speed', data: safeData(dailyData.windspeed_10m_max) }],
      yaxis: { title: { text: 'Wind Speed (km/h)' } }
    },
    {
      title: 'PM10 & PM2.5 Trends',
      series: [
        { name: 'PM10', data: safeData(data.airQuality?.pm10) },
        { name: 'PM2.5', data: safeData(data.airQuality?.pm2_5) }
      ],
      yaxis: { title: { text: 'Concentration (µg/m³)' } }
    }
  ];
  
  if (!dates || dates.length === 0) {
    return (
      <div className="historical-charts">
        <div className="no-data-message">
          <p>No historical data available for the selected date range.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="historical-charts">
      {charts.map((chart, idx) => (
        <div key={idx} className="hist-chart-card">
          <h3>{chart.title}</h3>
          <div className="chart-scroll-wrapper">
            <ReactApexChart
              options={getChartOptions(chart.yaxis, chart.type || 'line')}
              series={chart.series}
              type={chart.type || 'line'}
              height={380}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoricalCharts;