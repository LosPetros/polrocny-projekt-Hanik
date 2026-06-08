<template>
  <AppShell>
    <AppNavbar />

    <div class="max-w-5xl mx-auto px-6 py-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">My Hotels</h1>
      <p class="text-gray-600 mb-8">Manage your property listings. New listings require admin approval before going live.</p>

      <!-- Add Hotel Button -->
      <div class="flex justify-end mb-6">
        <button
          @click="openForm()"
          class="px-5 py-2.5 bg-gradient-primary text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          + Add hotel listing
        </button>
      </div>

      <!-- Hotel Form (add/edit) -->
      <div v-if="showForm" class="glass-card rounded-2xl p-6 mb-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">{{ editingHotel ? 'Edit listing' : 'New listing' }}</h2>
        <p v-if="editingHotel" class="text-sm text-amber-600 mb-4 bg-amber-50 rounded-lg px-3 py-2">
          Editing will reset the status to "pending" — admin will need to re-approve.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input v-model="form.name" placeholder="Hotel name *" class="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300" />
          <input v-model="form.city" placeholder="City *" class="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300" />
          <input v-model="form.address" placeholder="Full address" class="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300 md:col-span-2" />
        </div>
        <textarea v-model="form.description" placeholder="Describe your hotel..." rows="3" class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300 mb-4"></textarea>
        <div class="flex gap-2">
          <button @click="saveHotel" :disabled="saving" class="px-5 py-2 bg-gradient-primary text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50">
            {{ saving ? 'Saving...' : 'Submit listing' }}
          </button>
          <button @click="showForm = false" class="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">Cancel</button>
        </div>
        <p v-if="formError" class="text-red-600 text-sm mt-2">{{ formError }}</p>
      </div>

      <!-- Hotels List -->
      <div v-if="loading" class="text-center text-gray-500 py-12">Loading your listings...</div>

      <div v-else-if="hotels.length === 0" class="glass-card rounded-2xl p-12 text-center">
        <p class="text-gray-500 text-lg">You have no hotel listings yet.</p>
        <p class="text-gray-400 text-sm mt-1">Click "Add hotel listing" to get started.</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="hotel in hotels" :key="hotel.id" class="glass-card rounded-2xl p-5">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-1">
                <h3 class="text-lg font-bold text-gray-900">{{ hotel.name }}</h3>
                <StatusBadge :status="hotel.status" />
              </div>
              <p class="text-gray-600 text-sm">{{ hotel.city }}{{ hotel.address ? ' — ' + hotel.address : '' }}</p>
              <p v-if="hotel.min_price" class="text-violet-600 text-sm font-medium mt-1">From €{{ hotel.min_price }} / night · {{ hotel.room_count }} room(s)</p>
              <p v-if="hotel.status === 'pending'" class="text-yellow-600 text-xs mt-2">Waiting for admin approval before appearing in search.</p>
              <p v-if="hotel.status === 'rejected'" class="text-red-600 text-xs mt-2">
                Rejected{{ hotel.rejection_reason ? ': ' + hotel.rejection_reason : '' }}
              </p>
            </div>
            <div class="flex gap-2 ml-4">
              <router-link
                :to="`/owner/hotels/${hotel.id}`"
                class="px-4 py-2 bg-violet-50 text-violet-700 font-medium text-sm rounded-lg hover:bg-violet-100 transition-colors"
              >
                Manage →
              </router-link>
              <button @click="deleteHotel(hotel.id)" class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Delete">
                <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppShell from '../components/AppShell.vue'
import AppNavbar from '../components/AppNavbar.vue'
import StatusBadge from '../components/StatusBadge.vue'

const API = 'http://localhost:3000'

const hotels = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingHotel = ref(null)
const saving = ref(false)
const formError = ref('')
const form = ref({ name: '', city: '', address: '', description: '', nearby: '' })

async function fetchHotels() {
  loading.value = true
  const res = await fetch(`${API}/owner/hotels`, { credentials: 'include' })
  hotels.value = await res.json()
  loading.value = false
}

function openForm(hotel = null) {
  editingHotel.value = hotel
  formError.value = ''
  form.value = hotel
    ? { name: hotel.name, city: hotel.city, address: hotel.address || '', description: hotel.description || '', nearby: hotel.nearby || '' }
    : { name: '', city: '', address: '', description: '', nearby: '' }
  showForm.value = true
}

async function saveHotel() {
  formError.value = ''
  if (!form.value.name || !form.value.city) {
    formError.value = 'Name and city are required'
    return
  }
  saving.value = true
  const url = editingHotel.value ? `${API}/owner/hotels/${editingHotel.value.id}` : `${API}/owner/hotels`
  const method = editingHotel.value ? 'PUT' : 'POST'
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(form.value)
  })
  saving.value = false
  if (!res.ok) {
    const data = await res.json()
    formError.value = data.error || 'Failed to save'
    return
  }
  showForm.value = false
  await fetchHotels()
}

async function deleteHotel(id) {
  if (!confirm('Remove this listing?')) return
  await fetch(`${API}/owner/hotels/${id}`, { method: 'DELETE', credentials: 'include' })
  await fetchHotels()
}

onMounted(fetchHotels)
</script>
