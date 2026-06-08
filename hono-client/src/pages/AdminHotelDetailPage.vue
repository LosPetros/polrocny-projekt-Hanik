<template>
  <AppShell>
    <AppNavbar />

    <div class="max-w-4xl mx-auto px-6 py-8">

      <router-link to="/admin" class="text-violet-600 hover:text-violet-800 text-sm font-medium mb-4 inline-block">
        ← Back to admin
      </router-link>

      <div v-if="loading" class="text-gray-500 text-center py-16">Loading...</div>

      <template v-else-if="hotel">
        <!-- Header -->
        <div class="flex flex-wrap items-center gap-3 mb-2">
          <h1 class="text-3xl font-bold text-gray-900 flex-1">{{ hotel.name }}</h1>
          <span class="px-3 py-1 text-sm font-semibold rounded-full"
            :class="{
              'bg-yellow-100 text-yellow-700': hotel.status === 'pending',
              'bg-green-100 text-green-700': hotel.status === 'approved',
              'bg-red-100 text-red-700': hotel.status === 'rejected'
            }">{{ hotel.status }}</span>
        </div>
        <p class="text-gray-500 text-sm mb-6">
          Submitted by <span class="font-medium text-gray-700">{{ hotel.owner_name || hotel.owner_email }}</span>
          ({{ hotel.owner_email }})
        </p>

        <!-- Approve / Reject actions for pending hotels -->
        <div v-if="hotel.status === 'pending'" class="flex gap-3 mb-8">
          <button @click="approve" class="px-6 py-2.5 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors">
            Approve listing
          </button>
          <button @click="showReject = !showReject" class="px-6 py-2.5 bg-red-100 text-red-700 font-medium rounded-xl hover:bg-red-200 transition-colors">
            Reject listing
          </button>
        </div>
        <div v-if="showReject" class="glass-card rounded-2xl p-5 mb-6">
          <p class="font-medium text-red-800 mb-2">Rejection reason</p>
          <textarea v-model="rejectReason" placeholder="Explain why this listing is rejected..." rows="2"
            class="w-full px-3 py-2 rounded-lg border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 mb-3"></textarea>
          <div class="flex gap-2">
            <button @click="reject" class="px-5 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600">Confirm</button>
            <button @click="showReject = false" class="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">Cancel</button>
          </div>
        </div>

        <!-- Hotel info -->
        <div class="glass-card rounded-2xl p-6 mb-6">
          <h2 class="text-lg font-bold text-gray-900 mb-3">Details</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div><span class="text-gray-500">City:</span> <span class="font-medium text-gray-800">{{ hotel.city }}</span></div>
            <div><span class="text-gray-500">Address:</span> <span class="font-medium text-gray-800">{{ hotel.address || '—' }}</span></div>
          </div>
          <p v-if="hotel.description" class="mt-3 text-gray-700 text-sm leading-relaxed">{{ hotel.description }}</p>
        </div>

        <!-- Amenities -->
        <div class="glass-card rounded-2xl p-6 mb-6">
          <h2 class="text-lg font-bold text-gray-900 mb-3">Amenities</h2>
          <div v-if="hotel.amenities.length === 0" class="text-gray-400 text-sm">None listed.</div>
          <div v-else class="flex flex-wrap gap-2">
            <span v-for="a in hotel.amenities" :key="a.id"
              class="px-3 py-1 bg-violet-50 text-violet-700 text-sm rounded-full font-medium">
              {{ a.name }}
            </span>
          </div>
        </div>

        <!-- Rooms -->
        <div class="glass-card rounded-2xl p-6 mb-6">
          <h2 class="text-lg font-bold text-gray-900 mb-3">Rooms ({{ hotel.rooms.length }})</h2>
          <div v-if="hotel.rooms.length === 0" class="text-gray-400 text-sm">No rooms added yet.</div>
          <div v-else class="space-y-3">
            <div v-for="room in hotel.rooms" :key="room.id"
              class="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-gray-100">
              <div>
                <p class="font-semibold text-gray-900">{{ room.name }}
                  <span class="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{{ room.type_name }}</span>
                </p>
                <p class="text-sm text-gray-600 mt-0.5">
                  {{ room.capacity }} guests · {{ room.beds }} bed(s) · <span class="text-violet-600 font-medium">€{{ room.price_per_night }}/night</span>
                </p>
                <p v-if="room.description" class="text-xs text-gray-400 mt-0.5">{{ room.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Images -->
        <div class="glass-card rounded-2xl p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-3">Images ({{ hotel.images.length }})</h2>
          <div v-if="hotel.images.length === 0" class="text-gray-400 text-sm">No images uploaded.</div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div v-for="img in hotel.images" :key="img.hotel_image_id"
              class="rounded-xl overflow-hidden aspect-video bg-gray-100">
              <img :src="`http://localhost:3000/${img.storage_path}`" :alt="img.original_name" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </template>

      <div v-else class="text-center text-gray-500 py-16">Hotel not found.</div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppShell from '../components/AppShell.vue'
import AppNavbar from '../components/AppNavbar.vue'

const API = 'http://localhost:3000'
const route = useRoute()
const router = useRouter()
const hotelId = route.params.id

const hotel = ref(null)
const loading = ref(true)
const showReject = ref(false)
const rejectReason = ref('')

async function loadHotel() {
  const res = await fetch(`${API}/admin/hotels/${hotelId}/full`, { credentials: 'include' })
  hotel.value = res.ok ? await res.json() : null
  loading.value = false
}

async function approve() {
  await fetch(`${API}/admin/hotels/${hotelId}/approve`, { method: 'PUT', credentials: 'include' })
  router.push('/admin')
}

async function reject() {
  await fetch(`${API}/admin/hotels/${hotelId}/reject`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ reason: rejectReason.value })
  })
  router.push('/admin')
}

onMounted(loadHotel)
</script>
