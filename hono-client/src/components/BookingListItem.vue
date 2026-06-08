<template>
  <div class="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
          <h3 class="text-xl font-bold text-gray-900">{{ booking.hotel_name }}</h3>
          <StatusBadge :status="booking.status" />
        </div>
        <div class="space-y-1 text-sm text-gray-600">
          <p class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(booking.check_in) }} - {{ formatDate(booking.check_out) }}
          </p>
          <p class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {{ booking.guests }} guest{{ booking.guests > 1 ? 's' : '' }}
          </p>
          <p class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {{ booking.room_name }}
          </p>
        </div>
      </div>
      <div class="flex flex-col items-end gap-3">
        <div class="text-right">
          <p class="text-2xl font-bold text-gray-900">&euro;{{ (booking.nights * booking.price_per_night).toFixed(2) }}</p>
          <p class="text-sm text-gray-600">{{ booking.nights }} night{{ booking.nights > 1 ? 's' : '' }}</p>
        </div>
        <button
          v-if="booking.status !== 'cancelled'"
          @click="$emit('cancel', booking.id)"
          class="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from './StatusBadge.vue'

defineProps({
  booking: { type: Object, required: true },
})

defineEmits(['cancel'])

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
