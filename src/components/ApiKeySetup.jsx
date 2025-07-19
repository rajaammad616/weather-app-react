import { useState } from 'react';

const ApiKeySetup = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsLoading(true);
    
    // Test the API key with a simple request
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey.trim()}&units=metric`
      );
      
      if (response.ok) {
        localStorage.setItem('openweather_api_key', apiKey.trim());
        onApiKeySet(apiKey.trim());
      } else {
        alert('Invalid API key. Please check and try again.');
      }
    } catch (error) {
      alert('Failed to validate API key. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-clear flex items-center justify-center p-4">
      <div className="weather-card p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🌤️</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Weather App</h1>
          <p className="text-muted-foreground">
            Enter your OpenWeatherMap API key to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-foreground mb-2">
              API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenWeatherMap API key"
              className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/60 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={!apiKey.trim() || isLoading}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-smooth font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Validating...' : 'Start Using Weather App'}
          </button>
        </form>

        <div className="mt-6 p-4 rounded-lg bg-white/20 border border-white/30">
          <h3 className="font-medium text-foreground mb-2">How to get an API key:</h3>
          <ol className="text-sm text-muted-foreground space-y-1">
            <li>1. Visit <a href="https://openweathermap.org/api" target="_blank" rel="noopener" className="text-primary hover:underline">openweathermap.org</a></li>
            <li>2. Sign up for a free account</li>
            <li>3. Go to "My API keys" section</li>
            <li>4. Copy your API key and paste it above</li>
          </ol>
        </div>

        <div className="mt-4 text-xs text-muted-foreground text-center">
          Your API key is stored securely in your browser and never sent to our servers.
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup;