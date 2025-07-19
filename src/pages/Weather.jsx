import { useState, useEffect } from 'react';
import WeatherCard from '../components/WeatherCard';
import LocationSearch from '../components/LocationSearch';
import WeatherDetails from '../components/WeatherDetails';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('New York');

  // Mock weather data for demo purposes
  // In a real app, you'd fetch from OpenWeatherMap API
  const mockWeatherData = {
    location: 'New York',
    country: 'US',
    temperature: 22,
    condition: 'Clear',
    description: 'Clear sky',
    humidity: 65,
    windSpeed: 12,
    pressure: 1013,
    visibility: 10,
    uvIndex: 5,
    icon: '01d'
  };

  useEffect(() => {
    // Simulate API call
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would make an API call here:
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=YOUR_API_KEY&units=metric`);
        // const data = await response.json();
        
        setWeatherData({
          ...mockWeatherData,
          location: location,
          temperature: Math.floor(Math.random() * 30) + 5 // Random temp between 5-35
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

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
          <p className="text-muted-foreground">Beautiful weather forecasts at your fingertips</p>
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
            <span className="text-xs">Demo version with mock data</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Weather;