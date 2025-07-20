import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplet, Thermometer, Eye, Compass, MapPin, AlertTriangle, Key } from 'lucide-react';
import WeatherCard from '../components/WeatherCard';
import LocationSearch from '../components/LocationSearch';
import WeatherDetails from '../components/WeatherDetails';
import Forecast7Day from '../components/Forecast7Day';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [apiKey, setApiKey] = useState('3de15bd57be09ceea6530ae8de6493f4');
  const [locationPermission, setLocationPermission] = useState('pending');
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('openweather_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  useEffect(() => {
    if (!apiKey) return;

    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        setLocationPermission('not-supported');
        setLocation('London');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission('granted');
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationPermission('denied');
          setLocation('London');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    };

    getCurrentLocation();
  }, [apiKey]);

  const mockForecast = [
    {
      dt: 1717286400,
      temp: { min: 13, max: 22 },
      weather: [{ main: 'Clear', description: 'clear sky' }]
    },
    {
      dt: 1717372800,
      temp: { min: 14, max: 23 },
      weather: [{ main: 'Clouds', description: 'few clouds' }]
    },
    {
      dt: 1717459200,
      temp: { min: 15, max: 24 },
      weather: [{ main: 'Rain', description: 'light rain' }]
    },
    {
      dt: 1717545600,
      temp: { min: 13, max: 21 },
      weather: [{ main: 'Clear', description: 'sunny' }]
    },
    {
      dt: 1717632000,
      temp: { min: 12, max: 20 },
      weather: [{ main: 'Clouds', description: 'scattered clouds' }]
    },
    {
      dt: 1717718400,
      temp: { min: 11, max: 19 },
      weather: [{ main: 'Rain', description: 'showers' }]
    },
    {
      dt: 1717804800,
      temp: { min: 13, max: 22 },
      weather: [{ main: 'Clear', description: 'clear sky' }]
    }
  ];

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
      if (!response.ok) throw new Error('Failed to fetch weather data');
      const data = await response.json();
      setWeatherData(transformWeatherData(data));
      setLocation(`${data.name}, ${data.sys.country}`);
      setError(null);
      // Fetch 7-day forecast
      const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`);
      if (forecastRes.ok) {
        const forecastData = await forecastRes.json();
        setForecast(forecastData.daily.slice(0, 7));
      } else {
        setForecast(mockForecast);
      }
    } catch (err) {
      setError('Failed to fetch weather data');
      setForecast(mockForecast);
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (cityName) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
      if (!response.ok) throw new Error('City not found');
      const data = await response.json();
      setWeatherData(transformWeatherData(data));
      setLocation(`${data.name}, ${data.sys.country}`);
      setError(null);
      // Fetch 7-day forecast
      const { coord } = data;
      if (coord) {
        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`);
        if (forecastRes.ok) {
          const forecastData = await forecastRes.json();
          setForecast(forecastData.daily.slice(0, 7));
        } else {
          setForecast(mockForecast);
        }
      } else {
        setForecast(mockForecast);
      }
    } catch (err) {
      setError(`Failed to fetch weather for ${cityName}`);
      setForecast(mockForecast);
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const transformWeatherData = (data) => ({
    location: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6),
    pressure: data.main.pressure,
    visibility: data.visibility ? Math.round(data.visibility / 1000) : 10,
    uvIndex: 0,
    icon: data.weather[0].icon,
    feels_like: Math.round(data.main.feels_like)
  });

  useEffect(() => {
    if (location && apiKey && typeof location === 'string' && !location.includes(',')) {
      fetchWeatherByCity(location);
    }
  }, [location, apiKey]);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const getBgClass = () => {
    if (!weatherData) return 'from-blue-400 to-blue-600';
    const condition = weatherData.condition.toLowerCase();
    if (condition.includes('clear')) return 'from-yellow-400 to-orange-500';
    if (condition.includes('clouds')) return 'from-gray-400 to-gray-600';
    if (condition.includes('rain')) return 'from-blue-500 to-blue-700';
    if (condition.includes('snow')) return 'from-blue-200 to-blue-400';
    return 'from-blue-400 to-blue-600';
  };

  // Set body background to match weather
  useEffect(() => {
    const bgClass = getBgClass();
    document.body.classList.remove(
      'from-yellow-400', 'to-orange-500',
      'from-gray-400', 'to-gray-600',
      'from-blue-500', 'to-blue-700',
      'from-blue-200', 'to-blue-400',
      'from-blue-400', 'to-blue-600',
      'bg-gradient-to-br'
    );
    document.body.classList.add('bg-gradient-to-br');
    bgClass.split(' ').forEach(cls => document.body.classList.add(cls));
    return () => {
      document.body.classList.remove('bg-gradient-to-br');
      bgClass.split(' ').forEach(cls => document.body.classList.remove(cls));
    };
  }, [weatherData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-white">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="w-20 h-20 mx-auto mb-6"
          >
            <Sun className="w-full h-full text-yellow-400 drop-shadow-lg" />
          </motion.div>
          <p className="text-2xl font-medium tracking-wide">Loading Weather...</p>
          <p className="text-white/60">Please wait a moment</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white p-4">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-8 bg-white/10 rounded-3xl shadow-xl backdrop-blur-md border border-white/20 max-w-md">
          <AlertTriangle className="w-20 h-20 mx-auto mb-6 text-yellow-300" />
          <p className="text-3xl font-bold mb-2">Oops! Something went wrong.</p>
          <p className="text-white/80 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 text-white transition-all duration-1000 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto flex-1 w-full"
      >
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <motion.div animate={{ rotate: [0, -15, 15, -15, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}>
              <Sun className="w-10 h-10 text-yellow-300 drop-shadow-lg" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-wide">{weatherData ? (weatherData.description.charAt(0).toUpperCase() + weatherData.description.slice(1)) : 'Weather'}</h1>
          </div>
          <LocationSearch
            currentLocation={location}
            onLocationChange={handleLocationChange}
          />
        </header>

        {locationPermission !== 'granted' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 rounded-xl bg-white/10 text-center text-sm flex items-center justify-center gap-2 border border-white/20 shadow-md"
          >
            <MapPin size={16} />
            {locationPermission === 'denied' ? 'Location access denied. Showing fallback location.' : 'Geolocation not supported. Showing fallback location.'}
          </motion.div>
        )}

        <main className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:col-span-3 lg:col-span-3"
          >
            <WeatherCard weather={weatherData} />
            <Forecast7Day forecast={forecast} />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="md:col-span-3 lg:col-span-1"
          >
            <WeatherDetails weather={weatherData} />
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
};

export default Weather;
