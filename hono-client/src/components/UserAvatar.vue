<template>
  <div
    class="bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
    :class="sizeClasses"
    :title="name"
  >
    {{ initial }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: String, default: 'md' }  // 'sm' | 'md' | 'lg'
})

const initial = computed(() => props.name?.charAt(0).toUpperCase() ?? '?')

const sizeClasses = computed(() => ({
  'w-8 h-8 text-sm':   props.size === 'sm',
  'w-10 h-10 text-base': props.size === 'md',
  'w-16 h-16 text-2xl': props.size === 'lg',
}))
</script>
