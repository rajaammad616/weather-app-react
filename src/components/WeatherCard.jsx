const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  // Use OpenWeatherMap icon codes for better weather representation
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  const getWeatherEmoji = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return '☀️';
      case 'clouds':
        return '☁️';
      case 'rain':
        return '🌧️';
      case 'drizzle':
        return '🌦️';
      case 'snow':
        return '❄️';
      case 'thunderstorm':
        return '⛈️';
      case 'mist':
      case 'fog':
        return '🌫️';
      default:
        return '🌤️';
    }
  };

  const getBackgroundClass = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return 'bg-sunny';
      case 'clouds':
        return 'bg-cloudy';
      case 'rain':
      case 'drizzle':
        return 'bg-rainy';
      default:
        return 'bg-clear';
    }
  };

  return (
    <div className={`weather-card p-8 ${getBackgroundClass(weather.condition)}`}>
      <div className="text-center">
        {/* Location */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground">
            {weather.location}
          </h2>
          <p className="text-lg text-muted-foreground">{weather.country}</p>
        </div>

        {/* Weather icon and temperature */}
        <div className="mb-8">
          {/* Use both API icon and emoji as fallback */}
          <div className="mb-4 flex justify-center items-center">
            {weather.icon ? (
              <img 
                src={getWeatherIconUrl(weather.icon)}
                alt={weather.description}
                className="w-32 h-32 object-contain drop-shadow-lg"
                onError={(e) => {
                  // Fallback to emoji if image fails
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : null}
            <div 
              className="text-8xl animate-bounce" 
              style={{ display: weather.icon ? 'none' : 'block' }}
            >
              {getWeatherEmoji(weather.condition)}
            </div>
          </div>
          
          <div className="text-7xl font-bold text-foreground mb-2">
            {weather.temperature}°
          </div>
          
          <p className="text-xl text-muted-foreground capitalize mb-2">
            {weather.description}
          </p>
          
          {weather.feels_like && (
            <p className="text-sm text-muted-foreground">
              Feels like {weather.feels_like}°C
            </p>
          )}
        </div>

        {/* Main weather stats - iOS style layout */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4 rounded-2xl bg-white/25 backdrop-blur-sm border border-white/30">
            <div className="text-xl mb-1">💨</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Wind</div>
            <div className="font-bold text-lg">{weather.windSpeed}</div>
            <div className="text-xs text-muted-foreground">km/h</div>
          </div>
          
          <div className="text-center p-4 rounded-2xl bg-white/25 backdrop-blur-sm border border-white/30">
            <div className="text-xl mb-1">💧</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Humidity</div>
            <div className="font-bold text-lg">{weather.humidity}</div>
            <div className="text-xs text-muted-foreground">%</div>
          </div>
          
          <div className="text-center p-4 rounded-2xl bg-white/25 backdrop-blur-sm border border-white/30">
            <div className="text-xl mb-1">☀️</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">UV Index</div>
            <div className="font-bold text-lg">{weather.uvIndex || 'N/A'}</div>
            <div className="text-xs text-muted-foreground">index</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;