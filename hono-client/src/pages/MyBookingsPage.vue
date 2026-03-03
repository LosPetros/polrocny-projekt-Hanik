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

      <!-- Bookings List -->
      <div class="space-y-6">
        <div 
          v-for="booking in bookings" 
          :key="booking.id"
          class="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <!-- Booking Info -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-xl font-bold text-gray-900">{{ booking.hotelName }}</h3>
                <span 
                  class="px-3 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-green-100 text-green-700': booking.status === 'Confirmed',
                    'bg-yellow-100 text-yellow-700': booking.status === 'Pending',
                    'bg-red-100 text-red-700': booking.status === 'Cancelled'
                  }"
                >
                  {{ booking.status }}
                </span>
              </div>
              
              <div class="space-y-1 text-sm text-gray-600">
                <p class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ booking.checkIn }} - {{ booking.checkOut }}
                </p>
                <p class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {{ booking.guests }}
                </p>
                <p class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {{ booking.roomType }}
                </p>
              </div>
            </div>

            <!-- Price and Actions -->
            <div class="flex flex-col items-end gap-3">
              <div class="text-right">
                <p class="text-2xl font-bold text-gray-900">${{ booking.totalPrice }}</p>
                <p class="text-sm text-gray-600">Total</p>
              </div>

              <div class="flex gap-2">
                <button class="px-4 py-2 bg-gradient-primary text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                  View Details
                </button>
                <button 
                  v-if="booking.status !== 'Cancelled'"
                  class="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="bookings.length === 0" class="glass-card rounded-2xl p-12 text-center">
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
    </div>
  </AppShell>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import AppShell from '../components/AppShell.vue'
import AppNavbar from '../components/AppNavbar.vue'

const authStore = useAuthStore()

// Dummy booking data
const bookings = ref([
  {
    id: 1,
    hotelName: 'Grand Central Hotel',
    status: 'Confirmed',
    checkIn: 'Apr 20, 2026',
    checkOut: 'Apr 22, 2026',
    guests: '2 Adults',
    roomType: 'Deluxe Suite',
    totalPrice: 498
  },
  {
    id: 2,
    hotelName: 'Skyline Luxury Suites',
    status: 'Pending',
    checkIn: 'May 15, 2026',
    checkOut: 'May 18, 2026',
    guests: '2 Adults, 1 Child',
    roomType: 'Premium Room',
    totalPrice: 1125
  }
])
</script>
