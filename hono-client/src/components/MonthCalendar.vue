<template>
  <div class="bg-white/65 rounded-2xl p-4 border border-white/60">
    <p class="text-sm font-bold text-gray-800 mb-3 text-center">{{ MONTH_NAMES[month] }} {{ year }}</p>
    <div class="grid grid-cols-7 gap-0.5 mb-1">
      <div v-for="d in DAY_NAMES" :key="d"
        class="text-center text-[10px] font-semibold text-gray-400 py-0.5">{{ d }}</div>
    </div>
    <div class="grid grid-cols-7 gap-0.5">
      <div v-for="(day, i) in cells" :key="day ? dateStr(day) : `e${i}`" :class="dayClass(day)">
        {{ day || '' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  year:        { type: Number, required: true },
  month:       { type: Number, required: true }, // 0-indexed
  bookedDates: { type: Object, required: true }, // Set<string>
})

const DAY_NAMES   = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December']

const cells = computed(() => {
  const firstDay = new Date(props.year, props.month, 1)
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6
  const daysInMonth = new Date(props.year, props.month + 1, 0).getDate()
  const result = []
  for (let i = 0; i < startOffset; i++) result.push(null)
  for (let d = 1; d <= daysInMonth; d++) result.push(d)
  return result
})

function dateStr(day) {
  return `${props.year}-${String(props.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function dayClass(day) {
  const base = 'w-full aspect-square flex items-center justify-center text-xs rounded-lg transition-colors '
  if (!day) return base
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date     = new Date(props.year, props.month, day)
  const isPast   = date < today
  const isToday  = date.getTime() === today.getTime()
  const isBooked = props.bookedDates.has(dateStr(day))
  if (isPast)   return base + 'text-gray-300 cursor-default'
  if (isToday)  return base + 'bg-gray-900 text-white font-bold'
  if (isBooked) return base + 'bg-violet-100 text-violet-600 font-medium'
  return base + 'text-gray-700 hover:bg-violet-50'
}
</script>
