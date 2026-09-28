import React, { useEffect, useState } from 'react';
import { FiCloudRain, FiWind, FiSun } from 'react-icons/fi';
import axios from 'axios';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Defaulting to Mumbai for this example. Ideally, fetch based on user's location.
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          'https://api.open-meteo.com/v1/forecast?latitude=19.0760&longitude=72.8777&current_weather=true'
        );
        setWeather(response.data.current_weather);
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (loading) return <div className="p-6 bg-card border border-gray-800 rounded-2xl animate-pulse h-32"></div>;
  if (!weather) return null;

  return (
    <div className="bg-card border border-gray-800 p-6 rounded-2xl shadow-sm">
      <h3 className="text-gray-400 text-sm font-medium mb-4 flex items-center gap-2">
        <FiSun className="text-warning" /> Current Weather (Mumbai)
      </h3>
      <div className="flex justify-between items-end">
        <div>
          <span className="text-4xl font-bold text-white">{weather.temperature}°C</span>
          <p className="text-sm text-gray-500 mt-1">Wind: {weather.windspeed} km/h</p>
        </div>
        <div className="text-right">
          {weather.weathercode > 50 ? (
            <FiCloudRain className="text-3xl text-primary" />
          ) : (
            <FiSun className="text-3xl text-warning" />
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
