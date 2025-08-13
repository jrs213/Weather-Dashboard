onMounted(async () => {

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
  <nav class="w-full flex gap-6 justify-center items-center h-17 bg-primary border-b border-gray-100">
    <h1>Nav</h1>
    <input v-model="city" type="text" placeholder="Search..." class="input input-bordered input-secondary w-full max-w-xs" />
    <button @click="searchCity" class="btn bg-success p-2 rounded">Search</button>
  </nav>
    <div class="flex flex-col items-center">
        <div class="bg-secondary w-70vw p-4">
            <h1 class="text-xl">{{ location?.name || 'Town Name' }}</h1>
            <section class="flex items-center pb-4">
                <p class="text-yellow px-3" v-if="data != null && data.current.is_day">
                    <Sun />
                </p>
                <p v-if="data != null && !data.current.is_day">
                    <Moon />
                </p>
                <h4 class="text-lg" v-if="data != null">{{ data.current.temperature_2m }}°F
                </h4>
            </section>
            <p v-if="data != null">High: {{ data.daily.temperature_2m_max[0] }}</p>
            <p v-if="data != null">Low: {{ data.daily.temperature_2m_min[0] }}</p>
            <p v-if="data != null">Sunrise: {{ data.daily.sunrise[0].slice(-5) }}</p>
            <p v-if="data != null">Sunset: {{ data.daily.sunset[0].slice(-5) }}</p>
        </div>
        <pre>{{ data }}</pre>
    </div>
</template>

<style scoped>
.sun {
    color: yellow;
}
</style>

<!-- Apt 1036 -->
<!-- 33.26086610267396, -111.59837523951511 -->
