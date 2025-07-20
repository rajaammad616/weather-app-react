import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplet, Thermometer } from 'lucide-react';

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const getWeatherIcon = (condition) => {
    const size = 120;
    const commonProps = { size, className: "drop-shadow-lg" };
    switch (condition.toLowerCase()) {
      case 'clear': return <Sun {...commonProps} color="#FFC700" />;
      case 'clouds': return <Cloud {...commonProps} color="#B0B0B0" />;
      case 'rain': return <CloudRain {...commonProps} color="#4A90E2" />;
      case 'snow': return <CloudSnow {...commonProps} color="#FFFFFF" />;
      default: return <Sun {...commonProps} color="#FFC700" />;
    }
  };

  return (
    <motion.div
      initial={{ backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
      animate={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      transition={{ duration: 0.8 }}
      className="bg-white/20 p-6 sm:p-8 rounded-3xl shadow-lg h-full flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">{weather.location}</h2>
            <p className="text-white/80">{weather.country}</p>
          </div>
          <div className="text-lg font-medium bg-white/20 px-3 py-1 rounded-full">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center my-8 sm:my-12 text-center sm:text-left">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
            {getWeatherIcon(weather.condition)}
          </motion.div>
          <div className="sm:ml-8 mt-6 sm:mt-0">
            <p className="text-7xl sm:text-8xl font-extrabold text-white tracking-tighter">{weather.temperature}°</p>
            <p className="text-xl text-white/90 capitalize">{weather.description}</p>
            <p className="text-sm text-white/70">
              Feels like {weather.feels_like}°C
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-white">
        <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
          <Wind size={24} />
          <div>
            <span className="text-sm text-white/80">Wind</span>
            <p className="font-bold">{weather.windSpeed} km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
          <Droplet size={24} />
          <div>
            <span className="text-sm text-white/80">Humidity</span>
            <p className="font-bold">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl col-span-2 sm:col-span-1">
          <Thermometer size={24} />
          <div>
            <span className="text-sm text-white/80">Pressure</span>
            <p className="font-bold">{weather.pressure} hPa</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
