import { useState } from 'react';

const LocationSearch = ({ currentLocation, onLocationChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const popularCities = [
    'New York',
    'London',
    'Tokyo',
    'Paris',
    'Sydney',
    'Dubai',
    'Mumbai',
    'Berlin'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onLocationChange(inputValue.trim());
      setInputValue('');
      setIsExpanded(false);
    }
  };

  const handleCityClick = (city) => {
    onLocationChange(city);
    setIsExpanded(false);
  };

  return (
    <div className="weather-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        📍 Change Location
      </h3>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter city name..."
            className="flex-1 px-4 py-2 rounded-lg bg-white/50 border border-white/60 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-smooth font-medium"
          >
            Search
          </button>
        </div>
      </form>

      <div className="text-sm text-muted-foreground mb-3">
        Current: <span className="font-medium text-foreground">{currentLocation}</span>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-white/30 rounded-lg transition-smooth"
      >
        {isExpanded ? '▲' : '▼'} Popular Cities
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-1 animate-fade-in">
          {popularCities.map((city) => (
            <button
              key={city}
              onClick={() => handleCityClick(city)}
              className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-white/30 rounded-lg transition-smooth"
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;