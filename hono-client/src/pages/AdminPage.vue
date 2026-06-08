<template>
  <AppShell>
    <AppNavbar />

    <!-- SSE toast notification -->
    <transition name="toast">
      <div v-if="toast"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 bg-gray-900 text-white text-sm font-medium rounded-2xl shadow-xl">
        <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0"></span>
        {{ toast.message }}
        <button @click="toast = null" class="ml-2 opacity-60 hover:opacity-100">✕</button>
      </div>
    </transition>

    <div class="max-w-6xl mx-auto px-6 py-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Hotels" :value="stats.hotels" />
        <StatCard label="Users" :value="stats.users" />
        <StatCard label="Bookings" :value="stats.bookings" />
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6">
        <button
          v-for="t in ['hotels', 'pending', 'bookings', 'users']"
          :key="t"
          @click="tab = t"
          class="px-4 py-2 rounded-lg font-medium transition-colors capitalize flex items-center gap-2"
          :class="tab === t ? 'bg-gradient-primary text-white' : 'bg-white/50 text-gray-700 hover:bg-white'"
        >
          {{ t }}
          <span v-if="t === 'pending' && pendingHotels.length > 0"
            class="text-xs px-1.5 py-0.5 rounded-full bg-red-500 text-white font-bold">
            {{ pendingHotels.length }}
          </span>
        </button>
      </div>

      <!-- Hotels Tab -->
      <div v-if="tab === 'hotels'" class="glass-card rounded-2xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Hotels</h2>
          <button @click="openHotelForm()" class="px-4 py-2 bg-gradient-primary text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
            Add Hotel
          </button>
        </div>

        <!-- Hotel Form (add/edit) -->
        <div v-if="showHotelForm" class="mb-6 p-4 bg-white/50 rounded-xl border border-gray-200">
          <h3 class="font-semibold text-gray-900 mb-4">{{ editingHotel ? 'Edit Hotel' : 'New Hotel' }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input v-model="hotelForm.name" placeholder="Hotel name *" class="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300" />
            <input v-model="hotelForm.city" placeholder="City *" class="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300" />
            <input v-model="hotelForm.address" placeholder="Address" class="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300 md:col-span-2" />
          </div>
          <textarea v-model="hotelForm.description" placeholder="Description" rows="2" class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300 mb-4"></textarea>
          <div class="flex gap-2">
            <button @click="saveHotel" class="px-4 py-2 bg-gradient-primary text-white font-medium rounded-lg hover:opacity-90">Save</button>
            <button @click="showHotelForm = false" class="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">Cancel</button>
          </div>
          <p v-if="formError" class="text-red-600 text-sm mt-2">{{ formError }}</p>
        </div>

        <div v-if="hotels.length === 0" class="text-gray-500 text-center py-8">No hotels yet.</div>
        <div v-else class="space-y-3">
          <div v-for="hotel in hotels" :key="hotel.id" class="p-4 bg-white/50 rounded-xl border border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-semibold text-gray-900">{{ hotel.name }}</h3>
                <p class="text-sm text-gray-600">{{ hotel.city }}{{ hotel.address ? ' - ' + hotel.address : '' }}</p>
                <p v-if="hotel.min_price" class="text-sm text-violet-600 font-medium mt-1">From {{ hotel.min_price }} /night</p>
              </div>
              <div class="flex gap-2">
                <button @click="openHotelForm(hotel)" class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="deleteHotel(hotel.id)" class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Delete">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Hotels Tab -->
      <div v-if="tab === 'pending'" class="glass-card rounded-2xl p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Pending hotel listings</h2>
        <div v-if="pendingHotels.length === 0" class="text-gray-500 text-center py-8">No pending listings.</div>
        <div v-else class="space-y-4">
          <div v-for="hotel in pendingHotels" :key="hotel.id" class="p-5 bg-white/50 rounded-xl border border-yellow-200">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-bold text-gray-900">{{ hotel.name }}</h3>
                <p class="text-sm text-gray-600 mt-0.5">{{ hotel.city }}{{ hotel.address ? ' — ' + hotel.address : '' }}</p>
                <p class="text-sm text-gray-500 mt-1">Submitted by: <span class="font-medium">{{ hotel.owner_name || hotel.owner_email }}</span></p>
                <p v-if="hotel.description" class="text-sm text-gray-500 mt-2 italic">{{ hotel.description }}</p>
              </div>
              <div class="flex gap-2 ml-4 flex-wrap">
                <router-link :to="`/admin/hotels/${hotel.id}`"
                  class="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  View listing →
                </router-link>
                <button @click="approveHotel(hotel.id)" class="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors">
                  Approve
                </button>
                <button @click="openRejectDialog(hotel)" class="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors">
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Reject dialog -->
        <div v-if="rejectingHotel" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p class="font-medium text-red-800 mb-2">Rejecting: {{ rejectingHotel.name }}</p>
          <textarea v-model="rejectReason" placeholder="Reason for rejection (optional)" rows="2"
            class="w-full px-3 py-2 rounded-lg border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 mb-3"></textarea>
          <div class="flex gap-2">
            <button @click="confirmReject" class="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600">Confirm Reject</button>
            <button @click="rejectingHotel = null" class="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Bookings Tab -->
      <div v-if="tab === 'bookings'" class="glass-card rounded-2xl p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">All Bookings</h2>
        <div v-if="bookings.length === 0" class="text-gray-500 text-center py-8">No bookings yet.</div>
        <div v-else class="space-y-3">
          <div v-for="b in bookings" :key="b.id" class="p-4 bg-white/50 rounded-xl border border-gray-100">
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-semibold text-gray-900">{{ b.user_name || b.user_email }}</h3>
              <StatusBadge :status="b.status" />
            </div>
            <p class="text-sm text-gray-600">{{ b.hotel_name }} - {{ b.room_name }}</p>
            <p class="text-sm text-gray-500">{{ b.check_in }} to {{ b.check_out }} | {{ b.guests }} guests</p>
          </div>
        </div>
      </div>

      <!-- Users Tab -->
      <div v-if="tab === 'users'" class="glass-card rounded-2xl p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Users</h2>
        <div v-if="users.length === 0" class="text-gray-500 text-center py-8">No users yet.</div>
        <div v-else class="space-y-3">
          <div v-for="u in users" :key="u.id" class="p-4 bg-white/50 rounded-xl border border-gray-100 flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-gray-900">{{ u.name || 'No name' }}</h3>
              <p class="text-sm text-gray-600">{{ u.email }}</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="px-2 py-1 text-xs rounded-full font-medium"
                :class="{
                  'bg-purple-100 text-purple-700': u.role === 'admin',
                  'bg-blue-100 text-blue-700': u.role === 'owner',
                  'bg-gray-100 text-gray-700': u.role === 'user'
                }">
                {{ u.role }}
              </span>
              <select
                v-if="u.id !== currentUserId"
                :value="u.role"
                @change="setRole(u, $event.target.value)"
                class="text-xs px-2 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              >
                <option value="user">user</option>
                <option value="owner">owner</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import AppShell from '../components/AppShell.vue'
import AppNavbar from '../components/AppNavbar.vue'
import StatusBadge from '../components/StatusBadge.vue'
import StatCard from '../components/StatCard.vue'
import { useAuthStore } from '../stores/auth'

const API = 'http://localhost:3000'
const authStore = useAuthStore()
const currentUserId = computed(() => authStore.user?.id)

const tab = ref('hotels')
const stats = ref({ hotels: 0, users: 0, bookings: 0 })
const hotels = ref([])
const pendingHotels = ref([])
const bookings = ref([])
const users = ref([])
const rejectingHotel = ref(null)
const rejectReason = ref('')

// SSE real-time notifications
const toast = ref(null)   // { message: string }
let eventSource = null
let toastTimer = null

function showToast(message) {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { message }
  toastTimer = setTimeout(() => { toast.value = null }, 5000)
}

// Hotel form
const showHotelForm = ref(false)
const editingHotel = ref(null)
const formError = ref('')
const hotelForm = ref({ name: '', city: '', address: '', description: '' })

async function fetchAll() {
  const opts = { credentials: 'include' }
  const [s, h, p, b, u] = await Promise.all([
    fetch(`${API}/admin/stats`, opts).then(r => r.json()),
    fetch(`${API}/admin/hotels`, opts).then(r => r.json()),
    fetch(`${API}/admin/hotels/pending`, opts).then(r => r.json()),
    fetch(`${API}/admin/bookings`, opts).then(r => r.json()),
    fetch(`${API}/admin/users`, opts).then(r => r.json()),
  ])
  stats.value = s
  hotels.value = h
  pendingHotels.value = p
  bookings.value = b
  users.value = u
}

function openHotelForm(hotel = null) {
  editingHotel.value = hotel
  formError.value = ''
  if (hotel) {
    hotelForm.value = { name: hotel.name, city: hotel.city, address: hotel.address || '', description: hotel.description || '' }
  } else {
    hotelForm.value = { name: '', city: '', address: '', description: '' }
  }
  showHotelForm.value = true
}

async function saveHotel() {
  formError.value = ''
  if (!hotelForm.value.name || !hotelForm.value.city) {
    formError.value = 'Name and city are required'
    return
  }
  const url = editingHotel.value ? `${API}/admin/hotels/${editingHotel.value.id}` : `${API}/admin/hotels`
  const method = editingHotel.value ? 'PUT' : 'POST'
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(hotelForm.value)
  })
  if (!res.ok) {
    const data = await res.json()
    formError.value = data.error || 'Failed to save'
    return
  }
  showHotelForm.value = false
  await fetchAll()
}

async function deleteHotel(id) {
  if (!confirm('Delete this hotel?')) return
  await fetch(`${API}/admin/hotels/${id}`, { method: 'DELETE', credentials: 'include' })
  await fetchAll()
}

async function setRole(user, newRole) {
  if (newRole === user.role) return
  if (!confirm(`Change ${user.name || user.email} to "${newRole}"?`)) return
  await fetch(`${API}/admin/users/${user.id}/role`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ role: newRole })
  })
  await fetchAll()
}

async function approveHotel(id) {
  await fetch(`${API}/admin/hotels/${id}/approve`, { method: 'PUT', credentials: 'include' })
  await fetchAll()
}

function openRejectDialog(hotel) {
  rejectingHotel.value = hotel
  rejectReason.value = ''
}

async function confirmReject() {
  await fetch(`${API}/admin/hotels/${rejectingHotel.value.id}/reject`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ reason: rejectReason.value })
  })
  rejectingHotel.value = null
  await fetchAll()
}

onMounted(() => {
  fetchAll()

  // Connect to SSE stream for real-time admin notifications
  eventSource = new EventSource(`${API}/admin/events`, { withCredentials: true })

  eventSource.addEventListener('new_listing', (e) => {
    const data = JSON.parse(e.data)
    showToast(`New listing: "${data.hotelName}" by ${data.ownerName}`)
    fetchAll()   // refresh pending count + list
  })

  eventSource.onerror = () => {
    // Browser auto-reconnects on error — nothing to do here
  }
})

onUnmounted(() => {
  if (eventSource) eventSource.close()
  if (toastTimer) clearTimeout(toastTimer)
})
</script>
