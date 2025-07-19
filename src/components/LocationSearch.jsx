import { useState } from 'react';

const LocationSearch = ({ currentLocation, onLocationChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const popularCities = [
    'New York, US',
    'London, GB',
    'Tokyo, JP',
    'Paris, FR',
    'Sydney, AU',
    'Dubai, AE',
    'Mumbai, IN',
    'Berlin, DE',
    'Toronto, CA',
    'Singapore, SG'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isSearching) {
      setIsSearching(true);
      onLocationChange(inputValue.trim());
      setInputValue('');
      setIsExpanded(false);
      // Reset searching state after a delay
      setTimeout(() => setIsSearching(false), 1000);
    }
  };

  const handleCityClick = async (city) => {
    setIsSearching(true);
    onLocationChange(city.split(',')[0]); // Extract city name without country code
    setIsExpanded(false);
    setTimeout(() => setIsSearching(false), 1000);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      return;
    }

    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // This would trigger the geolocation fetch in the parent component
        window.location.reload(); // Simple way to refresh and get current location
      },
      (error) => {
        alert('Unable to get your current location');
        setIsSearching(false);
      }
    );
  };

  return (
    <div className="weather-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        📍 Search Location
      </h3>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter city name..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/50 border border-white/60 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSearching}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary-hover transition-smooth font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? '🔍' : 'Search'}
          </button>
        </div>
      </form>

      {/* Current location display */}
      <div className="mb-4 p-3 rounded-xl bg-white/20 border border-white/30">
        <div className="text-sm text-muted-foreground mb-1">Current Location</div>
        <div className="font-medium text-foreground">{currentLocation || 'Loading...'}</div>
        <button
          onClick={getCurrentLocation}
          disabled={isSearching}
          className="mt-2 text-xs text-primary hover:underline disabled:opacity-50"
        >
          🎯 Use my current location
        </button>
      </div>

      {/* Popular cities */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left px-4 py-3 text-sm text-primary hover:bg-white/30 rounded-xl transition-smooth flex items-center justify-between"
      >
        <span>Popular Cities</span>
        <span className="transform transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2 animate-fade-in">
          {popularCities.map((city) => (
            <button
              key={city}
              onClick={() => handleCityClick(city)}
              disabled={isSearching}
              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-white/30 rounded-lg transition-smooth disabled:opacity-50 flex items-center justify-between"
            >
              <span>{city.split(',')[0]}</span>
              <span className="text-xs text-muted-foreground">{city.split(',')[1]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;