<template>
  <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full" :class="classes">
    {{ status }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true }
})

const classes = computed(() => ({
  'bg-green-100 text-green-700':  props.status === 'confirmed' || props.status === 'approved',
  'bg-yellow-100 text-yellow-700': props.status === 'pending',
  'bg-red-100 text-red-700':      props.status === 'cancelled' || props.status === 'rejected',
  'bg-gray-100 text-gray-600':    !['confirmed','approved','pending','cancelled','rejected'].includes(props.status),
}))
</script>
