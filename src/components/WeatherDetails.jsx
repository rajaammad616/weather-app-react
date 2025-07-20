import { motion } from 'framer-motion';
import { Thermometer, Eye, Sun, Wind } from 'lucide-react';

const WeatherDetails = ({ weather }) => {
  if (!weather) return null;

  const details = [
    {
      label: 'Pressure',
      value: `${weather.pressure} hPa`,
      Icon: Thermometer
    },
    {
      label: 'Visibility',
      value: `${weather.visibility} km`,
      Icon: Eye
    },
    {
      label: 'UV Index',
      value: weather.uvIndex,
      Icon: Sun
    },
    {
      label: 'Wind Speed',
      value: `${weather.windSpeed} km/h`,
      Icon: Wind
    }
  ];

  const getUVStatus = (uvIndex) => {
    if (uvIndex <= 2) return { text: 'Low', color: 'bg-green-500' };
    if (uvIndex <= 5) return { text: 'Moderate', color: 'bg-yellow-500' };
    if (uvIndex <= 7) return { text: 'High', color: 'bg-orange-500' };
    return { text: 'Very High', color: 'bg-red-500' };
  };

  return (
    <motion.div 
      className="bg-white/20 p-6 rounded-3xl shadow-lg backdrop-blur-md h-full"
      initial={{ backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
      animate={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      transition={{ duration: 0.8 }}
    >
      <h3 className="text-lg font-bold text-white mb-4">
        Weather Details
      </h3>
      
      <div className="space-y-4">
        {details.map((detail, index) => (
          <motion.div 
            key={index} 
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
          >
            <div className="flex items-center gap-3 text-white/80">
              <detail.Icon size={20} />
              <span>{detail.label}</span>
            </div>
            <span className="font-bold text-white">
              {detail.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* UV Index Bar */}
      <div className="mt-6">
        <h4 className="text-sm text-white/80 mb-2">UV Index</h4>
        <div className="w-full bg-white/30 rounded-full h-2.5">
          <motion.div 
            className={`h-2.5 rounded-full ${getUVStatus(weather.uvIndex).color}`} 
            style={{ width: `${(weather.uvIndex / 11) * 100}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${(weather.uvIndex / 11) * 100}%` }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </div>
        <p className="text-right text-xs text-white mt-1">{getUVStatus(weather.uvIndex).text}</p>
      </div>
    </motion.div>
  );
};

export default WeatherDetails;
