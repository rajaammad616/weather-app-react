const WeatherDetails = ({ weather }) => {
  if (!weather) return null;

  const details = [
    {
      label: 'Pressure',
      value: `${weather.pressure} hPa`,
      icon: '🌡️'
    },
    {
      label: 'Visibility',
      value: `${weather.visibility} km`,
      icon: '👁️'
    },
    {
      label: 'UV Index',
      value: weather.uvIndex,
      icon: '☀️'
    },
    {
      label: 'Wind Speed',
      value: `${weather.windSpeed} km/h`,
      icon: '💨'
    }
  ];

  const getUVStatus = (uvIndex) => {
    if (uvIndex <= 2) return { text: 'Low', color: 'text-green-600' };
    if (uvIndex <= 5) return { text: 'Moderate', color: 'text-yellow-600' };
    if (uvIndex <= 7) return { text: 'High', color: 'text-orange-600' };
    return { text: 'Very High', color: 'text-red-600' };
  };

  return (
    <div className="weather-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        📊 Weather Details
      </h3>
      
      <div className="space-y-4">
        {details.map((detail, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <span className="text-xl">{detail.icon}</span>
              <span className="text-muted-foreground">{detail.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">
                {detail.value}
              </span>
              {detail.label === 'UV Index' && (
                <span className={`text-xs font-medium ${getUVStatus(detail.value).color}`}>
                  {getUVStatus(detail.value).text}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Air Quality placeholder */}
      <div className="mt-6 p-4 rounded-lg bg-white/20 border border-white/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Air Quality</span>
          <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-700">
            Good
          </span>
        </div>
        <div className="w-full bg-white/30 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Air quality is satisfactory for most people
        </p>
      </div>
    </div>
  );
};

export default WeatherDetails;