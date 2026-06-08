<template>
  <div class="glass-card rounded-2xl p-6">
    <h3 class="text-sm font-medium text-gray-600 mb-2">{{ label }}</h3>
    <p class="text-3xl font-bold text-gray-900">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
})
</script>
