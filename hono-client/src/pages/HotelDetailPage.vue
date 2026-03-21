<template>
  <AppShell>
    <AppNavbar />

    <div class="max-w-5xl mx-auto px-6 py-8">
      <!-- Loading -->
      <div v-if="loading" class="glass-card rounded-2xl p-12 text-center text-gray-500">Loading...</div>

      <!-- Error -->
      <div v-else-if="error" class="glass-card rounded-2xl p-12 text-center text-red-600">{{ error }}</div>

      <template v-else-if="hotel">
        <!-- Hotel Header -->
        <div class="glass-card rounded-2xl overflow-hidden mb-6">
          <img :src="hotelImage" :alt="hotel.name" class="w-full h-72 object-cover" />
          <div class="p-6">
            <h1 class="text-3xl font-bold text-gray-900 mb-1">{{ hotel.name }}</h1>
            <p class="text-gray-600 mb-3">{{ hotel.city }}{{ hotel.address ? ' - ' + hotel.address : '' }}</p>
            <p v-if="hotel.description" class="text-gray-700">{{ hotel.description }}</p>
          </div>
        </div>

        <!-- Rooms -->
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Available Rooms</h2>

        <div v-if="rooms.length === 0" class="glass-card rounded-2xl p-8 text-center text-gray-500">
          No rooms available for this hotel.
        </div>

        <div class="space-y-4">
          <div v-for="room in rooms" :key="room.id" class="glass-card rounded-2xl p-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-1">
                  <h3 class="text-lg font-bold text-gray-900">{{ room.name }}</h3>
                  <span class="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">{{ room.type_name }}</span>
                </div>
                <p v-if="room.description" class="text-sm text-gray-600 mb-2">{{ room.description }}</p>
                <div class="flex flex-wrap gap-3 text-sm text-gray-500">
                  <span>{{ room.capacity }} guests</span>
                  <span>{{ room.beds }} bed{{ room.beds > 1 ? 's' : '' }}</span>
                </div>
                <div v-if="room.amenities" class="flex flex-wrap gap-1.5 mt-2">
                  <span v-for="a in room.amenities.split(', ')" :key="a" class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">{{ a }}</span>
                </div>
              </div>
              <div class="text-right shrink-0">
                <p class="text-2xl font-bold text-gray-900">&euro;{{ room.price_per_night }}</p>
                <p class="text-xs text-gray-500 mb-3">per night</p>
                <button
                  @click="openBooking(room)"
                  class="px-5 py-2 bg-gradient-primary text-white font-medium rounded-lg hover:opacity-90 transition-opacity text-sm"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Modal -->
        <div v-if="bookingRoom" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="bookingRoom = null">
          <div class="glass-card rounded-2xl p-6 w-full max-w-md bg-white">
            <h3 class="text-xl font-bold text-gray-900 mb-1">Book: {{ bookingRoom.name }}</h3>
            <p class="text-sm text-gray-600 mb-4">{{ hotel.name }} - &euro;{{ bookingRoom.price_per_night }}/night</p>

            <div class="space-y-3 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                <input v-model="bookForm.checkIn" type="date" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                <input v-model="bookForm.checkOut" type="date" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                <select v-model="bookForm.guests" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  <option v-for="n in bookingRoom.capacity" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                <input v-model="bookForm.note" type="text" placeholder="Any special requests" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
            </div>

            <!-- Total -->
            <div v-if="nights > 0" class="flex justify-between items-center mb-4 p-3 bg-indigo-50 rounded-lg">
              <span class="text-sm text-gray-700">{{ nights }} night{{ nights > 1 ? 's' : '' }} x &euro;{{ bookingRoom.price_per_night }}</span>
              <span class="text-lg font-bold text-gray-900">&euro;{{ total }}</span>
            </div>

            <p v-if="bookError" class="text-red-600 text-sm mb-3">{{ bookError }}</p>

            <div class="flex gap-2">
              <button @click="submitBooking" :disabled="bookLoading" class="flex-1 py-2.5 bg-gradient-primary text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                {{ bookLoading ? 'Booking...' : 'Confirm Booking' }}
              </button>
              <button @click="bookingRoom = null" class="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">Cancel</button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppShell from '../components/AppShell.vue'
import AppNavbar from '../components/AppNavbar.vue'
import { useAuthStore } from '../stores/auth'

const API = 'http://localhost:3000'
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const hotel = ref(null)
const rooms = ref([])
const loading = ref(true)
const error = ref(null)

const hotelImages = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
]
const hotelImage = computed(() => hotelImages[((hotel.value?.id || 1) - 1) % hotelImages.length])

// Booking modal
const bookingRoom = ref(null)
const bookForm = ref({ checkIn: '', checkOut: '', guests: 1, note: '' })
const bookError = ref('')
const bookLoading = ref(false)

const nights = computed(() => {
  if (!bookForm.value.checkIn || !bookForm.value.checkOut) return 0
  const diff = new Date(bookForm.value.checkOut) - new Date(bookForm.value.checkIn)
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0
})

const total = computed(() => {
  if (!bookingRoom.value) return 0
  return (nights.value * bookingRoom.value.price_per_night).toFixed(2)
})

function openBooking(room) {
  if (!authStore.user) {
    router.push('/login')
    return
  }
  bookingRoom.value = room
  bookForm.value = { checkIn: '', checkOut: '', guests: 1, note: '' }
  bookError.value = ''
}

async function submitBooking() {
  bookError.value = ''
  if (!bookForm.value.checkIn || !bookForm.value.checkOut) {
    bookError.value = 'Please select check-in and check-out dates'
    return
  }
  if (nights.value <= 0) {
    bookError.value = 'Check-out must be after check-in'
    return
  }

  bookLoading.value = true
  try {
    const res = await fetch(`${API}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        roomId: bookingRoom.value.id,
        checkIn: bookForm.value.checkIn,
        checkOut: bookForm.value.checkOut,
        guests: bookForm.value.guests,
        note: bookForm.value.note,
      })
    })
    const data = await res.json()
    if (!res.ok) {
      bookError.value = data.error || 'Booking failed'
      return
    }
    bookingRoom.value = null
    router.push('/my-bookings')
  } catch {
    bookError.value = 'Something went wrong'
  } finally {
    bookLoading.value = false
  }
}

onMounted(async () => {
  try {
    const id = route.params.id
    const [hotelRes, roomsRes] = await Promise.all([
      fetch(`${API}/hotels/${id}`),
      fetch(`${API}/hotels/${id}/rooms`),
    ])
    if (!hotelRes.ok) throw new Error('Hotel not found')
    hotel.value = await hotelRes.json()
    rooms.value = await roomsRes.json()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>
