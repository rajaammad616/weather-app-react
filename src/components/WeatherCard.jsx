const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return '☀️';
      case 'clouds':
        return '☁️';
      case 'rain':
        return '🌧️';
      case 'snow':
        return '❄️';
      case 'thunderstorm':
        return '⛈️';
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
          <h2 className="text-2xl font-semibold text-foreground">
            {weather.location}
          </h2>
          <p className="text-muted-foreground">{weather.country}</p>
        </div>

        {/* Weather icon and temperature */}
        <div className="mb-6">
          <div className="text-8xl mb-4 animate-bounce">
            {getWeatherIcon(weather.condition)}
          </div>
          <div className="text-6xl font-bold text-foreground mb-2">
            {Math.round(weather.temperature)}°C
          </div>
          <p className="text-xl text-muted-foreground capitalize">
            {weather.description}
          </p>
        </div>

        {/* Weather condition badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm border border-white/40">
          <span className="text-foreground font-medium">
            {weather.condition}
          </span>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="text-center p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
            <div className="text-2xl mb-1">💨</div>
            <div className="text-sm text-muted-foreground">Wind</div>
            <div className="font-semibold">{weather.windSpeed} km/h</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
            <div className="text-2xl mb-1">💧</div>
            <div className="text-sm text-muted-foreground">Humidity</div>
            <div className="font-semibold">{weather.humidity}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;