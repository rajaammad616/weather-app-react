import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ChevronDown } from 'lucide-react';

const LocationSearch = ({ currentLocation, onLocationChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onLocationChange(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="relative w-full max-w-xs">
      <form onSubmit={handleSubmit} className="flex items-center">
        <motion.input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={currentLocation || "Search for a city..."}
          className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-white/60 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 border border-white/20 shadow-md"
          style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search size={22} className={`transition-colors ${isFocused ? 'text-white' : 'text-white/70'}`} />
        </div>
      </form>
    </div>
  );
};

export default LocationSearch;
