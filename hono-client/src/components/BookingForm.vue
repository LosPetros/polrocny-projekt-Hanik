<template>
  <div class="glass-card rounded-2xl p-6 sticky top-24" data-booking-card>
    <h3 class="text-lg font-bold text-gray-900 mb-4">Reserve a room</h3>

    <!-- Room selector -->
    <div class="mb-4">
      <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Room</label>
      <select v-model="form.roomId"
        class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white/80 text-sm text-gray-700">
        <option value="">Select a room</option>
        <option v-for="r in rooms" :key="r.id" :value="r.id">
          {{ r.name }} — €{{ r.price_per_night }}/night
        </option>
      </select>
    </div>

    <!-- Date row -->
    <div class="grid grid-cols-2 gap-2 mb-4">
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Check-in</label>
        <input v-model="form.checkIn" type="date"
          class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white/80 text-sm" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Check-out</label>
        <input v-model="form.checkOut" type="date"
          class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white/80 text-sm" />
      </div>
    </div>

    <!-- Guests -->
    <div class="mb-5">
      <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Guests</label>
      <select v-model="form.guests"
        class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white/80 text-sm text-gray-700">
        <option v-for="n in guestOptions" :key="n" :value="n">{{ n }} {{ n === 1 ? 'guest' : 'guests' }}</option>
      </select>
    </div>

    <!-- Price summary -->
    <div v-if="nights > 0 && selectedRoom"
      class="flex justify-between items-center mb-4 px-4 py-3 bg-violet-50 rounded-xl">
      <span class="text-sm text-gray-600">{{ nights }} night{{ nights > 1 ? 's' : '' }} × €{{ selectedRoom.price_per_night }}</span>
      <span class="text-lg font-extrabold text-gray-900">€{{ total }}</span>
    </div>

    <p v-if="formError" class="text-red-500 text-sm mb-3">{{ formError }}</p>

    <button @click="submit" :disabled="loading"
      class="w-full py-3 bg-gradient-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm">
      {{ loading ? 'Booking...' : 'Confirm booking' }}
    </button>

    <p class="text-xs text-gray-400 text-center mt-3">Free cancellation · No hidden fees</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  rooms: { type: Array, required: true },
})

const router    = useRouter()
const authStore = useAuthStore()
const API       = 'http://localhost:3000'

const form      = ref({ roomId: '', checkIn: '', checkOut: '', guests: 1, note: '' })
const formError = ref('')
const loading   = ref(false)

const selectedRoom = computed(() => props.rooms.find(r => r.id === form.value.roomId) ?? null)

const guestOptions = computed(() => {
  const cap = selectedRoom.value?.capacity ?? 4
  return Array.from({ length: cap }, (_, i) => i + 1)
})

const nights = computed(() => {
  if (!form.value.checkIn || !form.value.checkOut) return 0
  const diff = new Date(form.value.checkOut) - new Date(form.value.checkIn)
  return diff > 0 ? Math.ceil(diff / 86400000) : 0
})

const total = computed(() => {
  if (!selectedRoom.value || nights.value <= 0) return 0
  return (nights.value * Number(selectedRoom.value.price_per_night)).toFixed(2)
})

function open(room) {
  if (!authStore.user) { router.push('/login'); return }
  form.value  = { roomId: room.id, checkIn: '', checkOut: '', guests: 1, note: '' }
  formError.value = ''
  setTimeout(() => document.querySelector('[data-booking-card]')?.scrollIntoView({ behavior: 'smooth' }), 50)
}

async function submit() {
  formError.value = ''
  if (!form.value.roomId)                         { formError.value = 'Please select a room'; return }
  if (!form.value.checkIn || !form.value.checkOut) { formError.value = 'Please select dates'; return }
  if (nights.value <= 0)                           { formError.value = 'Check-out must be after check-in'; return }

  loading.value = true
  try {
    const res = await fetch(`${API}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        roomId:   form.value.roomId,
        checkIn:  form.value.checkIn,
        checkOut: form.value.checkOut,
        guests:   form.value.guests,
        note:     form.value.note,
      }),
    })
    const data = await res.json()
    if (!res.ok) { formError.value = data.error || 'Booking failed'; return }
    router.push('/my-bookings')
  } catch {
    formError.value = 'Something went wrong'
  } finally {
    loading.value = false
  }
}

defineExpose({ open })
</script>
