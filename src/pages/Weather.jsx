import { useState, useEffect } from 'react';
import WeatherCard from '../components/WeatherCard';
import LocationSearch from '../components/LocationSearch';
import WeatherDetails from '../components/WeatherDetails';
import ApiKeySetup from '../components/ApiKeySetup';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [locationPermission, setLocationPermission] = useState('pending');

  // Check for stored API key on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openweather_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  // Get user's current location
  useEffect(() => {
    if (!apiKey) return;

    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        setLocationPermission('not-supported');
        setLocation('London'); // Fallback location
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
          setLocation('London'); // Fallback location
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    };

    getCurrentLocation();
  }, [apiKey]);

  // Fetch weather by coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
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

  // Fetch weather by city name
  const fetchWeatherByCity = async (cityName) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
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

  // Transform API data to our format
  const transformWeatherData = (data) => ({
    location: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    pressure: data.main.pressure,
    visibility: data.visibility ? Math.round(data.visibility / 1000) : 10,
    uvIndex: 0, // UV data requires separate API call
    icon: data.weather[0].icon,
    feels_like: Math.round(data.main.feels_like)
  });

  // Fetch weather when location changes (for search)
  useEffect(() => {
    if (location && apiKey && typeof location === 'string' && !location.includes(',')) {
      fetchWeatherByCity(location);
    }
  }, [location, apiKey]);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const handleApiKeySet = (newApiKey) => {
    setApiKey(newApiKey);
  };

  // Show API key setup if no key is stored
  if (!apiKey) {
    return <ApiKeySetup onApiKeySet={handleApiKeySet} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-clear flex items-center justify-center">
        <div className="weather-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-clear flex items-center justify-center">
        <div className="weather-card p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-smooth"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clear p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Weather App</h1>
          <p className="text-muted-foreground">Real-time weather forecasts powered by OpenWeatherMap</p>
          
          {/* Location permission status */}
          {locationPermission === 'denied' && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-sm">
              📍 Location access denied. Using fallback location. You can search for your city below.
            </div>
          )}
          {locationPermission === 'not-supported' && (
            <div className="mt-4 p-3 rounded-lg bg-orange-500/20 border border-orange-500/30 text-sm">
              📍 Geolocation not supported. Using fallback location.
            </div>
          )}
        </header>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {/* Main weather card */}
          <div className="lg:col-span-2">
            <WeatherCard weather={weatherData} />
          </div>

          {/* Location search and details */}
          <div className="space-y-6">
            <LocationSearch 
              currentLocation={location}
              onLocationChange={handleLocationChange}
            />
            <WeatherDetails weather={weatherData} />
          </div>
        </div>

        <footer className="text-center mt-12 text-muted-foreground">
          <p className="text-sm">
            Weather data provided by OpenWeatherMap API
            <br />
            <button 
              onClick={() => {
                localStorage.removeItem('openweather_api_key');
                setApiKey(null);
              }}
              className="text-xs text-primary hover:underline mt-1"
            >
              Change API Key
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Weather;