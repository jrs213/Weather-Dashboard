<script setup lang="ts">
import d2d from 'degrees-to-direction';
import { ref, onMounted } from 'vue'
import { fetchWeatherByCity, fetchWeatherForecast } from '@/services/WeatherService'
import { Sunrise, Sunset, Droplet, Thermometer, Waves, Wind } from 'lucide-vue-next'



const city = ref('')
const data = ref()
const location = ref<{ name: string } | null>(null)
const defaultLat = 33.26086610267396
const defaultLon = -111.59837523951511

onMounted(async () => {
    try {
        data.value = await fetchWeatherForecast(defaultLat, defaultLon)
        location.value = { name: 'Queen Creek' }
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
    if (code === 61 || code === 63 || code === 65) return 'fa-cloud-showers-heavy'; // Rain showers
    if (code === 66 || code === 67) return 'fa-cloud-showers-heavy'; // Freezing rain
    if (code === 71 || code === 73 || code === 75 || code === 77) return 'fa-snowflake'; // Snow
    if (code === 80 || code === 81 || code === 82) return 'fa-cloud-showers-heavy'; // Rain showers
    if (code === 85 || code === 86) return 'fa-snowflake'; // Snow showers
    if (code === 95 || code === 96 || code === 99) return 'fa-cloud-bolt'; // Thunderstorm
}

</script>

<template>
    <!-- SEARCH SECTION -->

    <div class="flex justify-center items-center my-4">
        <input v-model="city" type="text" placeholder="Search..."
            class="input input-bordered input-secondary w-full max-w-xs p-2 rounded-l" />
        <button @click="searchCity" class="btn bg-accent p-2 rounded-r">Search</button>
    </div>
    <!-- Main Page -->
    <div class="bg-primary text-white flex justify-around border-2 border-gray-700">
        <div class="flex flex-col  mb-10 ">

            <!-- LOCATION INFO SECTION -->
            <div class="flex justify-around bg-primary w-50vw p-4 rounded-xl shadow-lg ">
                <section class="flex flex-col items-top pb-4">
                    <span class="">
                        <h1 class="text-6xl font-bold">{{ location?.name }}</h1>
                        <label class="text-lg font-semibold" v-if="data != null">
                            Chance of Rain: {{ data.daily.precipitation_probability_max[0] }}{{
                                data.daily_units.precipitation_probability_max }} </label>
                    </span>
                    <span class="flex">
                        <h4 class="text-3xl pt-3.5" v-if="data != null">{{ Math.round(data.current.temperature_2m) }}{{
                            data.current_units.temperature_2m }}
                        </h4>
                    </span>
                </section>
                <i :class="['fa-solid', getWeatherIcon(data?.current?.weather_code)]" class="text-8xl pt-2.5%"></i>
            </div>

            <!-- WEATHER INFO SECTION -->
            <div class="bg-secondary w-50vw p-4 rounded-xl shadow-lg mt-4  border-2 border-gray-700">
                <section class="grid grid-cols-2 gap-4 ">
                    <span class="flex items-center">
                        <!-- <i class="text-xl fa-solid fa-temperature-high pr-4 items-center"></i> -->
                        <Thermometer class="text-2xl" v-if="data != null" />
                        <p class="pl-2 text-2xl" v-if="data != null">{{ Math.round(data.daily.temperature_2m_max[0]) }} / {{ Math.round(data.daily.temperature_2m_min[0]) }} {{
                            data.current_units.temperature_2m }}</p>
                    </span>
                    <span class="flex items-center">
                        <Wind class="text-2xl" v-if="data != null" />
                        <p class="pl-2 text-2xl" v-if="data != null">{{ data.current.wind_speed_10m }} mph
                        </p>
                        <p v-if="data != null" class="pl-2 text-2xl italic">{{ d2d(data.current.wind_direction_10m) }}</p>
                    </span>
                    <span class="flex items-center">
                        <!-- <label class="font-semibold" v-if="data != null">Sunrise</label> -->
                        <Sunrise class="text-2xl" v-if="data != null" />
                        <p class="pl-2 text-2xl" v-if="data != null">{{ data.daily.sunrise[0].slice(-5) }}</p>
                    </span>
                    <span class="flex items-center">
                        <!-- <label class="font-semibold" v-if="data != null">Sunset</label> -->
                         <Sunset class="text-2xl" v-if="data != null" />
                        <p class="pl-2 text-2xl" v-if="data != null">{{ data.daily.sunset[0].slice(-5) }}</p>
                    </span>
                    <span class="flex items-center">
                        <!-- <i class="text-xl fa-solid fa-droplet pr-4 items-center"> </i> -->
                        <Droplet class="text-2xl" v-if="data != null" />
                        <p class="pl-2 text-2xl" v-if="data != null">{{ data.daily.precipitation_probability_max[0] }} {{
                            data.daily_units.precipitation_probability_max }}</p>
                    </span>
                    <span class="flex items-center">
                        <!-- <label class="pr-4 text-xl" v-if="data != null">Humidity:</label> -->
                         <Waves class="text-2xl" v-if="data != null" />
                        <p class="pl-2 text-2xl" v-if="data != null">{{ data.current.relative_humidity_2m }} {{
                            data.current_units.relative_humidity_2m }}</p>
                    </span>
                </section>
            </div>

            <!-- HOURLY FORECAST SECTION -->
            <div class="">
                <div v-if="data && data.hourly && data.hourly.time" class="grid grid-cols-6 gap-4">

                </div>
            </div>
        </div>


        <!-- 7 DAY FORECAST SECTION -->
        <div class="mt-6 w-30vw bg-secondary p-4 rounded-xl shadow-lg">
            <h3>7-Day Forecast</h3>
            <div class="flex flex-col">
                <div v-for="(date, index) in data?.daily?.time" :key="date"
                    class="bg-secondary p-4 flex justify-around mb-4 border-b-2 border-gray-700">
                    <p class="font-semibold">
                        <span class="ml-2">
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
                    </p>
                    <p>
                        <span class="font-semibold">{{ Math.round(data.daily.temperature_2m_max[index]) }} / </span>
                        <span class="text-gray-300">{{ Math.round(data.daily.temperature_2m_min[index]) }}</span>
                    </p>
                    <p>
                        <i class="text-xl fa-solid fa-droplet pr-4"></i>    
                        <span class="font-semibold">{{ data.daily.precipitation_probability_max[index] }}{{
                            data.daily_units.precipitation_probability_max }}</span>                  
                    </p>
                </div>
            </div>
        </div>
    </div>
    <pre>{{ data }}</pre>
</template>

<style scoped>
.sun {
    color: yellow;
}

</style>
