<script setup lang="ts">
import  { ref } from 'vue'

const city = ref('Queen Creek')
</script>

<template>
  <nav class="w-full flex gap-6 justify-center items-center h-17 bg-primary border-b border-gray-100">
    <h1>Nav</h1>
    <input v-model="city" type="text" placeholder="Search..." class="input input-bordered input-secondary w-full max-w-xs" />
    <button class="btn bg-success p-2 rounded">Search</button>
  </nav>
</template>
