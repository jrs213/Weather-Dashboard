<script setup lang="ts">
import { ref } from 'vue'

const city = ref('')
const emit = defineEmits(['search'])

const handleSearch = () => {
  if (city.value.trim()) {
    emit('search', city.value)
  }
}
</script>

<template>
  <nav class="w-full flex gap-6 justify-center items-center h-17 bg-primary border-b border-gray-100">
    <h1>Nav</h1>
    <input 
      v-model="city" 
      type="text" 
      placeholder="Search..." 
      class="input input-bordered input-secondary w-full max-w-xs"
      @keyup.enter="handleSearch"
    />
    <button 
      @click="handleSearch"
      class="btn bg-blue-600 p-2 rounded text-white hover:bg-blue-700"
    >
      Search
    </button>
  </nav>
</template>
