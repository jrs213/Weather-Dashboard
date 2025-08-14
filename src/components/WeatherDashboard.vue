<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'
import { fetchWeatherByCity, fetchWeatherForecast } from '@/services/WeatherService'

const city = ref('')
const data = ref()
const location = ref<{ name: string } | null>(null)
const defaultLat = 33.26086610267396
const defaultLon = -111.59837523951511

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
</script>

<template>
    <!-- SEARCH SECTION -->

    <div class="flex justify-center items-center my-4">
        <input v-model="city" type="text" placeholder="Search..."
            class="input input-bordered input-secondary w-full max-w-xs p-2 rounded-l" />
        <button @click="searchCity" class="btn bg-accent p-2 rounded-r">Search</button>
    </div>
            <!-- Main Page -->
    <div class="bg-primary text-white flex justify-around">
        <div class="flex flex-col  mb-10 ">

            <!-- LOCATION INFO SECTION -->
            <div class="flex justify-around bg-primary w-50vw p-4 rounded-xl shadow-lg">
                <section class="flex flex-col items-top pb-4">
                    <span class="">
                        <h1 class="text-6xl font-bold">{{ location?.name }}</h1>
                        <label class="text-lg font-semibold" v-if="data != null">
                            Chance of Rain: {{ data.daily.precipitation_probability_max[0] }} {{
                                data.daily_units.precipitation_probability_max }} </label>
                    </span>
                    <span class="flex">
                        <h4 class="text-3xl pt-3.5" v-if="data != null">{{ data.current.temperature_2m }}{{
                            data.current_units.temperature_2m }}
                        </h4>
                    </span>
                </section>
                <label class="text-lg font-semibold" v-if="data != null">
                    {{ data.current.weather_code }}
                </label>
                <p class="text-yellow pr-1 pt-5" v-if="data != null && data.current.is_day">
                    <Sun />
                </p>
                <p v-if="data != null && !data.current.is_day">
                    <Moon />
                </p>
            </div>

            <!-- WEATHER INFO SECTION -->
            <div class="bg-secondary w-50vw p-4 rounded-xl shadow-lg mt-4">
                <section class="grid grid-cols-2 gap-4">
                    <span class="flex flex-col items-center">
                        <label class="font-semibold" v-if="data != null">High</label>
                        <p v-if="data != null">{{ data.daily.temperature_2m_max[0] }} {{
                            data.current_units.temperature_2m }}</p>
                    </span>
                    <span class="flex flex-col items-center">
                        <label class="font-semibold" v-if="data != null">Low</label>
                        <p v-if="data != null">{{ data.daily.temperature_2m_min[0] }} {{
                            data.current_units.temperature_2m }}</p>
                    </span>
                    <span class="flex flex-col items-center">
                        <label class="font-semibold" v-if="data != null">Wind Speed</label>
                        <p v-if="data != null">{{ data.current.wind_speed_10m }} {{ data.current_units.wind_speed_10m }}
                        </p>
                    </span>
                    <span class="flex flex-col items-center">
                        <label class="font-semibold" v-if="data != null">Wind Direction</label>
                        <p v-if="data != null">{{ data.current.wind_direction_10m }} {{
                            data.current_units.wind_direction_10m }}</p>
                    </span>
                    <span class="flex flex-col items-center">
                        <label class="font-semibold" v-if="data != null">Sunrise</label>
                        <p v-if="data != null">{{ data.daily.sunrise[0].slice(-5) }}</p>
                    </span>
                    <span class="flex flex-col items-center">
                        <label class="font-semibold" v-if="data != null">Sunset</label>
                        <p v-if="data != null">{{ data.daily.sunset[0].slice(-5) }}</p>
                    </span>
                    <span class="flex flex-col items-center">
                        <label class="font-semibold" v-if="data != null">Precipitation</label>
                        <p v-if="data != null">{{ data.daily.precipitation_probability_max[0] }} {{
                            data.daily_units.precipitation_probability_max }}</p>
                    </span>
                    <span class="flex flex-col items-center">
                        <label class="font-semibold" v-if="data != null">Humidity</label>
                        <p v-if="data != null">{{ data.current.relative_humidity_2m }} {{
                            data.current_units.relative_humidity_2m }}</p>
                    </span>
                </section>
            </div>
        </div>

        <!-- FORECAST SECTION -->
        <div class="mt-6 w-30vw">
            <div class="flex flex-col">
                <div v-for="(date, index) in data?.daily?.time" :key="date"
                    class="bg-secondary p-4 rounded-lg shadow-md flex items-center justify-around mb-4">
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
                    <p><span class="font-semibold">{{ Math.round(data.daily.temperature_2m_max[index]) }}</span> /  <span class="text-gray-300">{{ Math.round(data.daily.temperature_2m_min[index]) }}</span></p>
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

<!-- Apt 1036 -->
<!-- 33.26086610267396, -111.59837523951511 -->
