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
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center">
        <motion.input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={currentLocation || "Search city..."}
          className="w-48 sm:w-64 pl-10 pr-4 py-2 bg-white/20 text-white placeholder-white/60 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
          style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search size={20} className={`transition-colors ${isFocused ? 'text-white' : 'text-white/60'}`} />
        </div>
      </form>
    </div>
  );
};

export default LocationSearch;
