<template>
  <AppShell>
    <AppNavbar />

    <div class="max-w-5xl mx-auto px-6 py-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">My Bookings</h1>

      <!-- User Info -->
      <div v-if="authStore.user" class="glass-card rounded-2xl p-6 mb-8">
        <div class="flex items-center gap-4">
          <UserAvatar :name="authStore.user.name" size="lg" />
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
        <BookingListItem
          v-for="b in bookings"
          :key="b.id"
          :booking="b"
          @cancel="cancelBooking" />
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
import UserAvatar from '../components/UserAvatar.vue'
import BookingListItem from '../components/BookingListItem.vue'

const API = 'http://localhost:3000'
const authStore = useAuthStore()

const bookings = ref([])
const loading  = ref(true)

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
