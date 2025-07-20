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
      className="bg-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-lg h-full border border-white/30 max-h-[85vh] overflow-auto overflow-x-hidden"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, type: 'spring' }}
      whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
    >
      <h3 className="text-2xl font-bold text-white mb-6">
        Weather Details
      </h3>
      <div className="grid gap-6">
        {details.map((detail, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between p-4 rounded-2xl bg-white/10 backdrop-blur-md shadow border border-white/20 hover:bg-white/20 transition-colors duration-300"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.15, duration: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-md">
                <detail.Icon size={22} className="text-white" />
              </span>
              <span className="text-lg text-white/80 font-medium">{detail.label}</span>
            </div>
            <span className="font-bold text-white text-xl">
              {detail.value}
            </span>
          </motion.div>
        ))}
      </div>
      {/* UV Index Bar */}
      <div className="mt-8">
        <h4 className="text-base text-white/80 mb-2 font-semibold">UV Index</h4>
        <div className="w-full bg-white/30 rounded-full h-3">
          <motion.div
            className={`h-3 rounded-full ${getUVStatus(weather.uvIndex).color}`}
            style={{ width: `${(weather.uvIndex / 11) * 100}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${(weather.uvIndex / 11) * 100}%` }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </div>
        <p className="text-right text-sm text-white mt-1 font-medium">{getUVStatus(weather.uvIndex).text}</p>
      </div>
    </motion.div>
  );
};

export default WeatherDetails;
