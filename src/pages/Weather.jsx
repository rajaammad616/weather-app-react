import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplet, Thermometer, Eye, Compass, MapPin, AlertTriangle, Key } from 'lucide-react';
import WeatherCard from '../components/WeatherCard';
import LocationSearch from '../components/LocationSearch';
import WeatherDetails from '../components/WeatherDetails';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [apiKey, setApiKey] = useState('3de15bd57be09ceea6530ae8de6493f4');
  const [locationPermission, setLocationPermission] = useState('pending');

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

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
      if (!response.ok) throw new Error('Failed to fetch weather data');
      const data = await response.json();
      setWeatherData(transformWeatherData(data));
      setLocation(`${data.name}, ${data.sys.country}`);
      setError(null);
    } catch (err) {
      setError('Failed to fetch weather data');
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
    } catch (err) {
      setError(`Failed to fetch weather for ${cityName}`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-white">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <Sun className="w-full h-full text-yellow-400" />
          </motion.div>
          <p className="text-xl">Loading weather...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center text-white">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-8 bg-white/10 rounded-2xl shadow-lg">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
          <p className="text-2xl font-bold mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-yellow-300 transition-all"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBgClass()} p-4 sm:p-6 lg:p-8 text-white transition-all duration-1000`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <motion.div animate={{ rotate: [0, -15, 15, -15, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}>
              <Sun className="w-8 h-8 text-yellow-300" />
            </motion.div>
            <h1 className="text-2xl font-bold">Sunny</h1>
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
            className="mb-6 p-3 rounded-xl bg-white/20 text-center text-sm flex items-center justify-center gap-2"
          >
            <MapPin size={16} />
            {locationPermission === 'denied' ? 'Location access denied. Showing fallback.' : 'Geolocation not supported. Showing fallback.'}
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

        <footer className="text-center mt-12 text-white/70 text-xs">
          <p>Weather data by OpenWeatherMap.</p>
          <button
            onClick={() => {
              localStorage.removeItem('openweather_api_key');
              setApiKey(null);
            }}
            className="text-white/70 hover:text-white hover:underline mt-1 flex items-center justify-center gap-1"
          >
            <Key size={12} /> Change API Key
          </button>
        </footer>
      </motion.div>
    </div>
  );
};

export default Weather;
