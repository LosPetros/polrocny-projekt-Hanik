<template>
  <AppShell>
    <AppNavbar />

    <div class="max-w-5xl mx-auto px-6 py-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">My Bookings</h1>

      <!-- User Info -->
      <div v-if="authStore.user" class="glass-card rounded-2xl p-6 mb-8">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {{ authStore.user.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">{{ authStore.user.name }}</h2>
            <p class="text-gray-600">{{ authStore.user.email }}</p>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="glass-card rounded-2xl p-12 text-center text-gray-500">Loading bookings...</div>

      <!-- Bookings List -->
      <div v-else-if="bookings.length > 0" class="space-y-6">
        <div
          v-for="b in bookings"
          :key="b.id"
          class="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-xl font-bold text-gray-900">{{ b.hotel_name }}</h3>
                <span
                  class="px-3 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-green-100 text-green-700': b.status === 'confirmed',
                    'bg-yellow-100 text-yellow-700': b.status === 'pending',
                    'bg-red-100 text-red-700': b.status === 'cancelled'
                  }"
                >
                  {{ b.status }}
                </span>
              </div>
              <div class="space-y-1 text-sm text-gray-600">
                <p class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(b.check_in) }} - {{ formatDate(b.check_out) }}
                </p>
                <p class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {{ b.guests }} guest{{ b.guests > 1 ? 's' : '' }}
                </p>
                <p class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {{ b.room_name }}
                </p>
              </div>
            </div>

            <div class="flex flex-col items-end gap-3">
              <div class="text-right">
                <p class="text-2xl font-bold text-gray-900">&euro;{{ (b.nights * b.price_per_night).toFixed(2) }}</p>
                <p class="text-sm text-gray-600">{{ b.nights }} night{{ b.nights > 1 ? 's' : '' }}</p>
              </div>
              <button
                v-if="b.status !== 'cancelled'"
                @click="cancelBooking(b.id)"
                class="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="glass-card rounded-2xl p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
        <p class="text-gray-600 mb-6">Start exploring hotels and make your first booking!</p>
        <router-link
          to="/search"
          class="inline-block px-6 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Browse Hotels
        </router-link>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import AppShell from '../components/AppShell.vue'
import AppNavbar from '../components/AppNavbar.vue'

const API = 'http://localhost:3000'
const authStore = useAuthStore()

const bookings = ref([])
const loading = ref(true)

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function fetchBookings() {
  loading.value = true
  try {
    const res = await fetch(`${API}/bookings/my`, { credentials: 'include' })
    bookings.value = await res.json()
  } catch (e) {
    console.error('Failed to fetch bookings', e)
  } finally {
    loading.value = false
  }
}

async function cancelBooking(id) {
  if (!confirm('Cancel this booking?')) return
  await fetch(`${API}/bookings/${id}/cancel`, { method: 'PUT', credentials: 'include' })
  await fetchBookings()
}

onMounted(fetchBookings)
</script>
