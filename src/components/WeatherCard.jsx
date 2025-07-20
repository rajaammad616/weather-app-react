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
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: 'spring' }}
      whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
      className="bg-white/10 p-8 sm:p-12 rounded-3xl shadow-2xl h-full flex flex-col justify-between border border-white/30 backdrop-blur-lg max-h-[85vh] overflow-auto"
    >
      <div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">{weather.location}</h2>
            <p className="text-white/70 font-medium text-lg">{weather.country}</p>
          </div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
            className="text-base font-semibold bg-white/20 px-5 py-2 rounded-full shadow border border-white/30"
          >
            {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center my-10 text-center sm:text-left gap-8">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
          >
            {getWeatherIcon(weather.condition)}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="sm:ml-8 mt-8 sm:mt-0"
          >
            <motion.p
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
              className="text-8xl sm:text-9xl font-extrabold text-white tracking-tighter leading-none drop-shadow-xl"
            >
              {weather.temperature}°
            </motion.p>
            <p className="text-2xl text-white/90 capitalize font-light mt-2">{weather.description}</p>
            <p className="text-lg text-white/70 mt-2 font-medium">
              Feels like <span className="font-bold">{weather.feels_like}°C</span>
            </p>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-white mt-6">
        {[{
          icon: <Wind size={40} className="text-white/80" />, label: 'Wind', value: `${weather.windSpeed} km/h`
        }, {
          icon: <Droplet size={40} className="text-white/80" />, label: 'Humidity', value: `${weather.humidity}%`
        }, {
          icon: <Thermometer size={40} className="text-white/80" />, label: 'Pressure', value: `${weather.pressure} hPa`
        }].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + idx * 0.15, duration: 0.5 }}
            className={`flex flex-col items-center gap-4 p-8 bg-white/10 rounded-3xl backdrop-blur-md shadow-lg border border-white/20${item.label === 'Pressure' ? ' col-span-2 sm:col-span-1' : ''}`}
          >
            {item.icon}
            <div className="text-center">
              <span className="text-lg text-white/80">{item.label}</span>
              <p className="font-bold text-2xl mt-1">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WeatherCard;
