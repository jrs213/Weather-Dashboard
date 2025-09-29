import axios from 'axios'

export interface WeatherForecast {
  current: {
    temperature_2m: number;
    is_day: boolean;
    wind_speed_10m: number;
    wind_direction_10m: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    relative_humidity_2m: number;
    weather_code: number;
    apparent_temperature: number;
  };
  current_units: {
    temperature_2m: string;
    is_day: string; 
    wind_speed_10m: string;
    wind_direction_10m: string;
    precipitation: string;
    rain: string;
    showers: string;
    snowfall: string;
    relative_humidity_2m: string;
    weather_code: string;
    apparent_temperature: string;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_probability_max: number[];
    time: string[];
    weather_code: string;
  };
  daily_units: {
    temperature_2m_max: string;
    temperature_2m_min: string;
    sunrise: string;
    sunset: string;
    precipitation_probability_max: string;
    time: string;
    weather_code: string;
  };
  hourly?: {
    temperature_2m: number[];
    weather_code: string;
    // Add more hourly fields as needed
  };
  hourly_units?: {
    temperature_2m: string;
    weather_code: string;
    // Add more hourly unit fields as needed
  };
}


export async function fetchWeatherForecast(
  lat: number,
  lon: number
): Promise<WeatherForecast> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max` +
    `&hourly=weather_code,temperature_2m` +
    `&current=temperature_2m,is_day,wind_speed_10m,wind_direction_10m,precipitation,rain,showers,snowfall,relative_humidity_2m,weather_code,apparent_temperature` +
    `&temperature_unit=fahrenheit` +
    `&wind_speed_unit=mph` +
    `&precipitation_unit=inch` +
    `&timezone=America/Phoenix`; 
  try {
    const response = await axios.get(url);
    return response.data as WeatherForecast;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}


export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  // Add more fields as needed from the API response
}

export async function fetchLocation(city: string, countryCode = 'US'): Promise<GeocodingResult | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json&countryCode=${countryCode}`;
  try {
    const response = await axios.get(url);
    if (response.data && response.data.results && response.data.results.length > 0) {
      return response.data.results[0] as GeocodingResult;
      console.log(`results:` + response.data.results[0]); // Debugging line to check the response
    }
    return null;
  } catch (error) {
    console.error('Error fetching location data:', error);
    throw error;
  }
}

// Combined function: fetch weather by city name
export async function fetchWeatherByCity(city: string, countryCode = 'US'): Promise<{ weather: WeatherForecast | null, location: GeocodingResult | null }> {
  const location = await fetchLocation(city, countryCode);
  if (location && location.latitude && location.longitude) {
    const weather = await fetchWeatherForecast(location.latitude, location.longitude);
    return { weather, location };
  }
  return { weather: null, location };
}

