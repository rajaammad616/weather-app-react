import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudSnow } from 'lucide-react';

const getWeatherIcon = (condition) => {
   const size = 36;
   const commonProps = { size, className: 'drop-shadow' };
   switch (condition.toLowerCase()) {
      case 'clear': return <Sun {...commonProps} color="#FFC700" />;
      case 'clouds': return <Cloud {...commonProps} color="#B0B0B0" />;
      case 'rain': return <CloudRain {...commonProps} color="#4A90E2" />;
      case 'snow': return <CloudSnow {...commonProps} color="#FFFFFF" />;
      default: return <Sun {...commonProps} color="#FFC700" />;
   }
};

const Forecast7Day = ({ forecast }) => {
   console.log('Forecast7Day received forecast:', forecast);
   if (!forecast || forecast.length === 0) return <div className="text-white/80 mt-6">No forecast data available.</div>;

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6 }}
         className="mt-10"
      >
         <h2 className="text-2xl font-bold mb-4 text-white">7-Day Forecast</h2>
         <div className="rounded-2xl p-2 sm:p-4 md:p-6 overflow-x-auto">
            <div className="flex flex-nowrap md:grid md:grid-cols-7 gap-2 sm:gap-4">
               {forecast.map((day, idx) => (
                  <div
                     key={idx}
                     className="min-w-[120px] md:min-w-0 rounded-xl p-4 flex flex-col items-center shadow border border-white/20 hover:bg-white/10 transition-all duration-200"
                     style={{ flex: '0 0 120px', background: 'transparent' }}
                  >
                     <div className="text-sm sm:text-base text-white/80 mb-2">
                        {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                     </div>
                     <div className="mb-2">{getWeatherIcon(day.weather[0].main)}</div>
                     <div className="text-lg sm:text-xl font-bold text-white">
                        {Math.round(day.temp.max)}° / {Math.round(day.temp.min)}°
                     </div>
                     <div className="text-xs sm:text-sm text-white/70 mt-1 capitalize text-center">
                        {day.weather[0].description}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </motion.div>
   );
};

export default Forecast7Day; 