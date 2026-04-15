import axios from 'axios';
import dayjs from 'dayjs';

const API_BASE = 'https://api.open-meteo.com/v1';
const ARCHIVE_BASE = 'https://archive-api.open-meteo.com/v1';
const AIR_QUALITY_BASE = 'https://air-quality-api.open-meteo.com/v1';

export const weatherService = {
  async getCurrentWeather(lat, lon, date = null) {
    const targetDate = date || dayjs().format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');
    
    // For dates in the future, use forecast API
    // For past dates, use archive API
    const isFutureDate = dayjs(targetDate).isAfter(dayjs(), 'day');
    const isToday = targetDate === today;
    
    try {
      let weatherData;
      
      if (isFutureDate || isToday) {
        // Use forecast API for today and future dates
        const weatherUrl = `${API_BASE}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relativehumidity_2m,precipitation,uv_index,windspeed_10m,apparent_temperature&hourly=temperature_2m,relativehumidity_2m,precipitation,visibility,windspeed_10m,pm10,pm2_5&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,windspeed_10m_max,uv_index_max&timezone=Asia/Kolkata&forecast_days=7`;
        
        const weatherResponse = await axios.get(weatherUrl);
        weatherData = weatherResponse.data;
        
        // Filter data for the specific date
        const dateIndex = weatherData.hourly.time.findIndex(time => time.startsWith(targetDate));
        if (dateIndex !== -1) {
          // Get 24 hours of data for the selected date
          const hourlyIndices = weatherData.hourly.time
            .map((time, idx) => time.startsWith(targetDate) ? idx : -1)
            .filter(idx => idx !== -1);
          
          weatherData.hourly = {
            time: hourlyIndices.map(idx => weatherData.hourly.time[idx]),
            temperature_2m: hourlyIndices.map(idx => weatherData.hourly.temperature_2m[idx]),
            relativehumidity_2m: hourlyIndices.map(idx => weatherData.hourly.relativehumidity_2m[idx]),
            precipitation: hourlyIndices.map(idx => weatherData.hourly.precipitation[idx]),
            visibility: hourlyIndices.map(idx => weatherData.hourly.visibility?.[idx]),
            windspeed_10m: hourlyIndices.map(idx => weatherData.hourly.windspeed_10m[idx]),
            pm10: hourlyIndices.map(idx => weatherData.hourly.pm10?.[idx]),
            pm2_5: hourlyIndices.map(idx => weatherData.hourly.pm2_5?.[idx])
          };
        }
      } else {
        // Use archive API for past dates
        const weatherUrl = `${ARCHIVE_BASE}/archive?latitude=${lat}&longitude=${lon}&start_date=${targetDate}&end_date=${targetDate}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,windspeed_10m_max,uv_index_max&hourly=temperature_2m,relativehumidity_2m,precipitation,visibility,windspeed_10m&timezone=Asia/Kolkata`;
        
        const weatherResponse = await axios.get(weatherUrl);
        weatherData = weatherResponse.data;
        
        // Add current data from hourly for the selected date
        if (weatherData.hourly && weatherData.hourly.time && weatherData.hourly.time.length > 0) {
          weatherData.current = {
            temperature_2m: weatherData.hourly.temperature_2m[0],
            relativehumidity_2m: weatherData.hourly.relativehumidity_2m[0],
            precipitation: weatherData.hourly.precipitation[0],
            windspeed_10m: weatherData.hourly.windspeed_10m[0]
          };
        }
      }
      
      // Fetch air quality data (only for current/today to avoid 400 errors)
      if (isToday) {
        try {
          const airQualityUrl = `${AIR_QUALITY_BASE}/air-quality?latitude=${lat}&longitude=${lon}&hourly=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide&timezone=Asia/Kolkata&forecast_days=1`;
          const aqResponse = await axios.get(airQualityUrl);
          weatherData.airQuality = aqResponse.data.hourly;
        } catch (aqError) {
          console.warn('Air quality data not available:', aqError.message);
          weatherData.airQuality = {};
        }
      } else {
        weatherData.airQuality = {};
      }
      
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error.response?.data || error.message);
      throw error;
    }
  },
  
  async getHistoricalWeather(lat, lon, startDate, endDate) {
    try {
      // Ensure date range is within 2 years
      const maxStartDate = dayjs().subtract(2, 'year').format('YYYY-MM-DD');
      const validStartDate = dayjs(startDate).isBefore(maxStartDate) ? maxStartDate : startDate;
      const validEndDate = dayjs(endDate).isAfter(dayjs()) ? dayjs().format('YYYY-MM-DD') : endDate;
      
      const url = `${ARCHIVE_BASE}/archive?latitude=${lat}&longitude=${lon}&start_date=${validStartDate}&end_date=${validEndDate}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,precipitation_sum,windspeed_10m_max,winddirection_10m_dominant&timezone=Asia/Kolkata`;
      
      const response = await axios.get(url);
      
      // Add hourly data for the range (limited to avoid large payloads)
      const hourlyUrl = `${ARCHIVE_BASE}/archive?latitude=${lat}&longitude=${lon}&start_date=${validStartDate}&end_date=${validEndDate}&hourly=temperature_2m,relativehumidity_2m,precipitation,visibility,windspeed_10m&timezone=Asia/Kolkata`;
      
      try {
        const hourlyResponse = await axios.get(hourlyUrl);
        response.data.hourly = hourlyResponse.data.hourly;
      } catch (hourlyError) {
        console.warn('Hourly data not available for entire range');
        response.data.hourly = {};
      }
      
      // Fetch air quality data for the range (limited to 30 days to avoid 400)
      const daysDiff = dayjs(validEndDate).diff(dayjs(validStartDate), 'day');
      if (daysDiff <= 30) {
        try {
          const airQualityUrl = `${AIR_QUALITY_BASE}/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5&timezone=Asia/Kolkata&start_date=${validStartDate}&end_date=${validEndDate}`;
          const aqResponse = await axios.get(airQualityUrl);
          response.data.airQuality = aqResponse.data.hourly;
        } catch (aqError) {
          console.warn('Historical air quality data not available');
          response.data.airQuality = {};
        }
      } else {
        response.data.airQuality = {};
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching historical data:', error.response?.data || error.message);
      throw error;
    }
  }
};