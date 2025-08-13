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
        location.value = { name: 'Queen Creek' }
    } catch (error) {
        console.error('Error fetching data:', error)
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
    <!-- NAVBAR -->
    <nav class="w-full flex gap-6 justify-center items-center bg-primary">
        <h1>Nav</h1>
        <input v-model="city" type="text" placeholder="Search..."
            class="input input-bordered input-secondary w-full max-w-xs" />
        <button @click="searchCity" class="btn bg-success p-2 rounded">Search</button>
    </nav>
    <!-- Main Card -->
    <div class="flex flex-col items-center mb-10">
        <div class="bg-secondary w-50vw p-4">
            <section class="flex items-top pb-4">
                <span class="flex flex-col">
                    <h1 class="text-6xl font-bold">{{ location?.name }}</h1>
                </span>
                <p class="text-yellow pl-6 pr-1 pt-5" v-if="data != null && data.current.is_day">
                    <Sun />
                </p>
                <p v-if="data != null && !data.current.is_day">
                    <Moon />
                </p>
                <h4 class="text-3xl pt-3.5" v-if="data != null">{{ data.current.temperature_2m }}{{
                    data.current_units.temperature_2m }}
                </h4>
            </section>
            <section class="grid grid-cols-2 gap-4">
                <span class="flex flex-col items-center">
                    <label class="font-semibold" v-if="data != null">High</label>
                    <p v-if="data != null">{{ data.daily.temperature_2m_max[0] }} {{ data.current_units.temperature_2m
                    }}</p>
                </span>
                <span class="flex flex-col items-center">
                    <label class="font-semibold" v-if="data != null">Low</label>
                    <p v-if="data != null">{{ data.daily.temperature_2m_min[0] }} {{ data.current_units.temperature_2m
                    }}</p>
                </span>
                <span class="flex flex-col items-center">
                    <label class="font-semibold" v-if="data != null">Wind Speed</label>
                    <p v-if="data != null">{{ data.current.wind_speed_10m }} {{ data.current_units.wind_speed_10m }}</p>
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
    <div >
        <div class="bg-secondary  justify-around px-2">
            <p v-for="(day, days) in data?.daily?.time" :key="days">{{ day }}</p>

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
