import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Umbrella, 
  RefreshCw, 
  MapPin, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { fetchDestinationWeather, WeatherData, getWeatherInfo } from '../services/weatherService';

interface DestinationWeatherCardProps {
  destination: string;
}

export const DestinationWeatherCard: React.FC<DestinationWeatherCardProps> = ({ destination }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFahrenheit, setIsFahrenheit] = useState<boolean>(false);
  const [showExtended, setShowExtended] = useState<boolean>(false);

  const loadWeather = async () => {
    setLoading(true);
    const data = await fetchDestinationWeather(destination);
    setWeather(data);
    setLoading(false);
  };

  useEffect(() => {
    loadWeather();
  }, [destination]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 animate-pulse">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Checking forecast for {destination}...</p>
            <p className="text-xs text-slate-500">Connecting to satellite radar</p>
          </div>
        </div>
        <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Destination Weather: {destination}</p>
            <p className="text-xs text-slate-400">Weather data unavailable for this location</p>
          </div>
        </div>
        <button
          onClick={loadWeather}
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      </div>
    );
  }

  const formatTemp = (celsius: number) => {
    if (isFahrenheit) {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius}°C`;
  };

  const weatherInfo = getWeatherInfo(weather.weatherCode);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-2xl">
            {weatherInfo.icon}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                {weather.city}{weather.country ? `, ${weather.country}` : ''}
              </h4>
              <span className="text-xs text-slate-500">Live Forecast</span>
            </div>
            <p className="text-xs text-slate-500 capitalize">{weather.condition}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Unit Toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-medium">
            <button
              onClick={() => setIsFahrenheit(false)}
              className={`px-2 py-1 rounded-md transition-colors ${
                !isFahrenheit ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => setIsFahrenheit(true)}
              className={`px-2 py-1 rounded-md transition-colors ${
                isFahrenheit ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              °F
            </button>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              {formatTemp(weather.temperature)}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 bg-slate-50/80 px-2.5 py-1.5 rounded-lg">
          <Droplets className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <span>Humidity: <strong className="text-slate-800">{weather.humidity}%</strong></span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50/80 px-2.5 py-1.5 rounded-lg">
          <Umbrella className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span>Precip: <strong className="text-slate-800">{weather.precipitationProbability}%</strong></span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50/80 px-2.5 py-1.5 rounded-lg">
          <Wind className="w-3.5 h-3.5 text-teal-500 shrink-0" />
          <span>Wind: <strong className="text-slate-800">{weather.windSpeed} km/h</strong></span>
        </div>
      </div>

      {/* 5-Day Forecast Toggle */}
      {weather.dailyForecast.length > 0 && (
        <div>
          <button
            onClick={() => setShowExtended(!showExtended)}
            className="w-full text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 pt-1 font-medium transition-colors cursor-pointer"
          >
            {showExtended ? (
              <>Hide 5-Day Outlook <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>View 5-Day Outlook <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>

          {showExtended && (
            <div className="grid grid-cols-5 gap-1.5 pt-3 mt-2 border-t border-slate-100">
              {weather.dailyForecast.map((day, idx) => {
                const dayName = idx === 0 
                  ? 'Today' 
                  : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                const icon = getWeatherInfo(day.weatherCode).icon;

                return (
                  <div 
                    key={day.date} 
                    className="flex flex-col items-center text-center p-2 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <span className="text-[11px] font-semibold text-slate-600">{dayName}</span>
                    <span className="text-lg my-1">{icon}</span>
                    <span className="text-xs font-bold text-slate-900">{formatTemp(day.tempMax)}</span>
                    <span className="text-[10px] text-slate-400">{formatTemp(day.tempMin)}</span>
                    {day.precipitationProbability > 0 && (
                      <span className="text-[10px] text-sky-600 font-medium mt-1">
                        {day.precipitationProbability}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
