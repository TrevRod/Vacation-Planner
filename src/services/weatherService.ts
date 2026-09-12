/**
 * Real-time destination weather forecast service using Open-Meteo API.
 * Free, high-accuracy, zero API keys required.
 */

export interface WeatherData {
  city: string;
  country?: string;
  temperature: number; // Celsius
  temperatureUnit: 'C' | 'F';
  condition: string;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  precipitationProbability: number;
  dailyForecast: Array<{
    date: string;
    weatherCode: number;
    tempMax: number;
    tempMin: number;
    precipitationProbability: number;
  }>;
}

const WEATHER_CODE_DESCRIPTIONS: Record<number, { text: string; icon: string }> = {
  0: { text: 'Clear sky', icon: '☀️' },
  1: { text: 'Mainly clear', icon: '🌤️' },
  2: { text: 'Partly cloudy', icon: '⛅' },
  3: { text: 'Overcast', icon: '☁️' },
  45: { text: 'Fog', icon: '🌫️' },
  48: { text: 'Depositing rime fog', icon: '🌫️' },
  51: { text: 'Light drizzle', icon: '🌦️' },
  53: { text: 'Moderate drizzle', icon: '🌧️' },
  55: { text: 'Dense drizzle', icon: '🌧️' },
  61: { text: 'Slight rain', icon: '🌦️' },
  63: { text: 'Moderate rain', icon: '🌧️' },
  65: { text: 'Heavy rain', icon: '⛈️' },
  71: { text: 'Slight snowfall', icon: '🌨️' },
  73: { text: 'Moderate snowfall', icon: '❄️' },
  75: { text: 'Heavy snowfall', icon: '❄️' },
  77: { text: 'Snow grains', icon: '🌨️' },
  80: { text: 'Slight rain showers', icon: '🌦️' },
  81: { text: 'Moderate rain showers', icon: '🌧️' },
  82: { text: 'Violent rain showers', icon: '⛈️' },
  85: { text: 'Slight snow showers', icon: '🌨️' },
  86: { text: 'Heavy snow showers', icon: '❄️' },
  95: { text: 'Thunderstorm', icon: '⚡' },
  96: { text: 'Thunderstorm with hail', icon: '⛈️' },
  99: { text: 'Heavy thunderstorm with hail', icon: '⛈️' },
};

export function getWeatherInfo(code: number): { text: string; icon: string } {
  return WEATHER_CODE_DESCRIPTIONS[code] || { text: 'Partly cloudy', icon: '⛅' };
}

// In-memory cache to avoid duplicate API requests
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export async function fetchDestinationWeather(destination: string): Promise<WeatherData | null> {
  if (!destination || destination.trim().length === 0) return null;

  // Clean destination string: take first segment if comma-separated (e.g., "Tokyo, Japan" -> "Tokyo")
  const primaryName = destination.split(',')[0].trim();
  const cacheKey = destination.toLowerCase().trim();

  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    // 1. Geocode destination
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      primaryName
    )}&count=1&language=en&format=json`;

    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error('Geocoding request failed');
    const geoJson = await geoRes.json();

    if (!geoJson.results || geoJson.results.length === 0) {
      return null;
    }

    const firstResult = geoJson.results[0];
    const { latitude, longitude, name, country } = firstResult;

    // 2. Fetch current weather and 5-day forecast
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) throw new Error('Weather forecast request failed');
    const weatherJson = await weatherRes.json();

    const current = weatherJson.current;
    const daily = weatherJson.daily;
    const info = getWeatherInfo(current.weather_code);

    const dailyForecast = (daily.time as string[] || []).slice(0, 5).map((dateStr, idx) => ({
      date: dateStr,
      weatherCode: daily.weather_code[idx],
      tempMax: Math.round(daily.temperature_2m_max[idx]),
      tempMin: Math.round(daily.temperature_2m_min[idx]),
      precipitationProbability: daily.precipitation_probability_max[idx] || 0,
    }));

    const result: WeatherData = {
      city: name,
      country: country,
      temperature: Math.round(current.temperature_2m),
      temperatureUnit: 'C',
      condition: info.text,
      weatherCode: current.weather_code,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      precipitationProbability: daily.precipitation_probability_max?.[0] || 0,
      dailyForecast,
    };

    weatherCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (err) {
    console.warn(`Could not load weather for ${destination}:`, err);
    return null;
  }
}
