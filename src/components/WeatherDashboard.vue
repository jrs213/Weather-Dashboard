<script setup lang="ts">
import d2d from 'degrees-to-direction';
import { ref, onMounted } from 'vue'
import { fetchWeatherByCity, fetchWeatherForecast } from '@/services/WeatherService'
import { Sunrise, Sunset, Droplet, Thermometer, Waves, Wind } from 'lucide-vue-next'
import NavComponent from './NavComponent.vue'

const city = ref('')
const data = ref()
const location = ref<{ name: string } | null>(null)
const defaultLat = 33.44086412956909
const defaultLon = -112.01770822928556

const handleCitySearch = async (cityName: string) => {
  city.value = cityName
  await searchCity()
}

onMounted(async () => {
    try {
        data.value = await fetchWeatherForecast(defaultLat, defaultLon)
        location.value = { name: 'Phoenix' }
    } catch (error) {
        console.error('Error fetching component data:', error)
    }
})

const searchCity = async () => {
    if (city.value) {
        try {
            const result = await fetchWeatherByCity(city.value)
            if (result.weather && result.location) {
                data.value = result.weather
                location.value = result.location
                console.log('Weather data:', data.value)
                return data.value && result.location.name
            } else {
                console.error('No location found for the city:', city.value)
            }
        } catch (error) {
            console.error('Error fetching weather data:', error)
        }
    }
}

function getWeatherIcon(code: number) {
    if (code === 0) return 'fa-sun';
    if (code === 1 || code === 2 || code === 3) return 'fa-cloud-sun';
    if (code === 45 || code === 48) return 'fa-smog';
    if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) return 'fa-cloud-rain';
    if (code === 61 || code === 63 || code === 65) return 'fa-cloud-showers-heavy';
    if (code === 66 || code === 67) return 'fa-cloud-showers-heavy';
    if (code === 71 || code === 73 || code === 75 || code === 77) return 'fa-snowflake';
    if (code === 80 || code === 81 || code === 82) return 'fa-cloud-showers-heavy';
    if (code === 85 || code === 86) return 'fa-snowflake';
    if (code === 95 || code === 96 || code === 99) return 'fa-cloud-bolt';
    return 'fa-question';
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <NavComponent @search="handleCitySearch" />
    
    <main class="max-w-7xl mx-auto px-6 py-8">
      <div v-if="data && location" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Current Weather Card -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-3xl font-bold text-gray-800">{{ location.name }}</h2>
              <p class="text-gray-600">{{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
              <p class="text-sm text-blue-600 mt-1">
                Chance of Rain: {{ data.daily.precipitation_probability_max[0] }}{{ data.daily_units.precipitation_probability_max }}
              </p>
            </div>
            <div class="text-right">
              <div class="text-5xl font-light text-gray-800">
                {{ Math.round(data.current.temperature_2m) }}{{ data.current_units.temperature_2m }}
              </div>
              <div class="flex items-center justify-end mt-2">
                <i :class="['fa-solid', getWeatherIcon(data.current.weather_code)]" class="text-3xl text-blue-500"></i>
              </div>
            </div>
          </div>

          <!-- Weather Details Grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center text-gray-600 mb-2">
                <Thermometer class="w-5 h-5 mr-2" />
                <span class="text-sm font-medium">High / Low</span>
              </div>
              <div class="text-lg font-semibold text-gray-800">
                {{ Math.round(data.daily.temperature_2m_max[0]) }}° / {{ Math.round(data.daily.temperature_2m_min[0]) }}°
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center text-gray-600 mb-2">
                <Wind class="w-5 h-5 mr-2" />
                <span class="text-sm font-medium">Wind</span>
              </div>
              <div class="text-lg font-semibold text-gray-800">
                {{ data.current.wind_speed_10m }} mph {{ d2d(data.current.wind_direction_10m) }}
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center text-gray-600 mb-2">
                <Waves class="w-5 h-5 mr-2" />
                <span class="text-sm font-medium">Humidity</span>
              </div>
              <div class="text-lg font-semibold text-gray-800">
                {{ data.current.relative_humidity_2m }}{{ data.current_units.relative_humidity_2m }}
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center text-gray-600 mb-2">
                <Sunrise class="w-5 h-5 mr-2" />
                <span class="text-sm font-medium">Sunrise</span>
              </div>
              <div class="text-lg font-semibold text-gray-800">
                {{ data.daily.sunrise[0].slice(-5) }}
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center text-gray-600 mb-2">
                <Sunset class="w-5 h-5 mr-2" />
                <span class="text-sm font-medium">Sunset</span>
              </div>
              <div class="text-lg font-semibold text-gray-800">
                {{ data.daily.sunset[0].slice(-5) }}
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center text-gray-600 mb-2">
                <Droplet class="w-5 h-5 mr-2" />
                <span class="text-sm font-medium">Precipitation</span>
              </div>
              <div class="text-lg font-semibold text-gray-800">
                {{ data.daily.precipitation_probability_max[0] }}{{ data.daily_units.precipitation_probability_max }}
              </div>
            </div>
          </div>
        </div>

        <!-- 7-Day Forecast Card -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">7-Day Forecast</h3>
          <div class="space-y-3">
            <div 
              v-for="(date, index) in data.daily.time" 
              :key="date"
              class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-800 w-16">
                  {{
                    (() => {
                      const today = new Date();
                      const yyyy = today.getUTCFullYear();
                      const mm = String(today.getUTCMonth() + 1).padStart(2, '0');
                      const dd = String(today.getUTCDate()).padStart(2, '0');
                      const todayStr = `${yyyy}-${mm}-${dd}`;
                      if (date === todayStr) {
                        return 'Today';
                      }
                      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
                        new Date(date + 'T00:00:00Z').getUTCDay()
                      ];
                    })()
                  }}
                </span>
                <i :class="['fa-solid', getWeatherIcon(data.daily.weather_code[index])]" class="text-blue-500 ml-3"></i>
              </div>
              <div class="flex items-center text-sm">
                <span class="font-semibold text-gray-800">{{ Math.round(data.daily.temperature_2m_max[index]) }}°</span>
                <span class="text-gray-500 ml-2">{{ Math.round(data.daily.temperature_2m_min[index]) }}°</span>
                <div class="flex items-center ml-4 text-blue-500">
                  <i class="fa-solid fa-droplet text-xs mr-1"></i>
                  <span>{{ data.daily.precipitation_probability_max[index] }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.sun-glow {
  position: absolute;
  top: -120px;
  right: -120px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 255, 0, 0.831) 0%, rgba(255, 213, 3, 0.847) 60%, rgba(255, 202, 26, 0.975) 100%);
  box-shadow: 0 0 120px 60px rgba(255, 242, 0, 0.804);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
}
.grass {
  position: absolute;
  bottom: 50px; /* Sits on top of the dirt/footer */
  width: 100%;
  height: 25px;
  background: linear-gradient(to top, #228B22 80%, #4ade80 100%);
  z-index: 11;
  box-shadow: 0 -8px 16px 0 rgba(34,139,34,0.2);
}

.footer {
  /* position: absolute; */
  bottom: 0;
  width: 100%;
  height: 50px;
  background: repeating-linear-gradient(
    to top,
    #8b5e3c 0px,
    #8b5e3c 10px,
    #a67c52 10px,
    #a67c52 20px
  );
  z-index: 10;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.worm-svg {
  /* position: absolute; */
  left: 25%;
  bottom: 2;
  transform: translateX(-50%) translateY(-12px);
  rotate: -7deg;
  width: 200px;
  height: 50px;
  z-index: 12;
  pointer-events: none;
}
</style>
