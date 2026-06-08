<template>
  <AppShell>
    <AppNavbar />

    <div class="max-w-4xl mx-auto px-6 py-8">

      <!-- Back link -->
      <router-link to="/owner" class="text-violet-600 hover:text-violet-800 text-sm font-medium mb-4 inline-block">
        ← Back to my hotels
      </router-link>

      <div v-if="loading" class="text-gray-500 text-center py-16">Loading...</div>

      <template v-else-if="hotel">
        <!-- Header -->
        <div class="flex items-center gap-4 mb-6">
          <h1 class="text-3xl font-bold text-gray-900 flex-1">{{ hotel.name }}</h1>
          <span class="px-3 py-1 text-sm font-semibold rounded-full"
            :class="{
              'bg-yellow-100 text-yellow-700': hotel.status === 'pending',
              'bg-green-100 text-green-700': hotel.status === 'approved',
              'bg-red-100 text-red-700': hotel.status === 'rejected'
            }">
            {{ hotel.status }}
          </span>
        </div>
        <p v-if="hotel.status === 'rejected'" class="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">
          Rejected: {{ hotel.rejection_reason }}
        </p>

        <!-- Tabs -->
        <div class="flex gap-2 mb-6 border-b border-gray-200">
          <button v-for="t in ['details', 'rooms', 'images', 'bookings']" :key="t"
            @click="tab = t"
            class="px-5 py-2.5 font-medium text-sm capitalize transition-colors -mb-px border-b-2"
            :class="tab === t ? 'border-violet-500 text-violet-600' : 'border-transparent text-gray-500 hover:text-gray-800'"
          >{{ t }}</button>
        </div>

        <!-- ── Details Tab ── -->
        <div v-if="tab === 'details'" class="space-y-6">
          <div class="glass-card rounded-2xl p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Basic information</h2>
            <p class="text-sm text-amber-600 mb-4 bg-amber-50 rounded-lg px-3 py-2">
              Saving changes resets status to "pending" — admin will re-review.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input v-model="infoForm.name" placeholder="Hotel name *" class="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300" />
              <input v-model="infoForm.city" placeholder="City *" class="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300" />
              <input v-model="infoForm.address" placeholder="Full address" class="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300 md:col-span-2" />
            </div>
            <textarea v-model="infoForm.description" placeholder="Describe your hotel..." rows="3" class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300 mb-4"></textarea>
            <label class="block text-sm font-medium text-gray-700 mb-1">What's nearby <span class="text-gray-400 font-normal">(optional)</span></label>
            <textarea v-model="infoForm.nearby" placeholder="Describe nearby attractions, transport links, ski slopes, walking distance landmarks..." rows="3" class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300 mb-4"></textarea>
            <button @click="saveInfo" :disabled="savingInfo" class="px-5 py-2 bg-gradient-primary text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50">
              {{ savingInfo ? 'Saving...' : 'Save info' }}
            </button>
            <p v-if="infoError" class="text-red-600 text-sm mt-2">{{ infoError }}</p>
          </div>

          <!-- Amenities (on-site facilities) -->
          <div class="glass-card rounded-2xl p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-1">Facilities</h2>
            <p class="text-sm text-gray-500 mb-4">What's available at the hotel.</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              <label v-for="a in allAmenities" :key="a.id"
                class="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" :value="a.id" v-model="selectedAmenities"
                  class="w-4 h-4 rounded accent-violet-500" />
                <span class="text-sm text-gray-700">{{ a.name }}</span>
              </label>
            </div>
            <button @click="saveAmenities" :disabled="savingAmenities" class="px-5 py-2 bg-gradient-primary text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50">
              {{ savingAmenities ? 'Saving...' : 'Save facilities' }}
            </button>
          </div>

          <!-- Activities (nearby things to do) -->
          <div class="glass-card rounded-2xl p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-1">Activities</h2>
            <p class="text-sm text-gray-500 mb-4">Things guests can do in and around your hotel. Used in search filters.</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              <label v-for="a in allActivities" :key="a.id"
                class="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" :value="a.id" v-model="selectedActivities"
                  class="w-4 h-4 rounded accent-violet-500" />
                <span class="text-sm text-gray-700">{{ a.name }}</span>
              </label>
            </div>
            <button @click="saveActivities" :disabled="savingActivities" class="px-5 py-2 bg-gradient-primary text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50">
              {{ savingActivities ? 'Saving...' : 'Save activities' }}
            </button>
          </div>
        </div>

        

        <!-- ── Rooms Tab ── -->
        <div v-if="tab === 'rooms'">
          <div class="glass-card rounded-2xl p-6 mb-4">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-900">Rooms</h2>
              <button @click="openRoomForm()" class="px-4 py-2 bg-gradient-primary text-white text-sm font-medium rounded-lg hover:opacity-90">
                + Add room
              </button>
            </div>

            <div v-if="hotel.rooms.length === 0" class="text-gray-500 text-center py-8">No rooms yet.</div>
            <div v-else class="space-y-3">
              <div v-for="room in hotel.rooms" :key="room.id"
                class="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-gray-100">
                <div>
                  <p class="font-semibold text-gray-900">{{ room.name }}
                    <span class="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{{ room.type_name }}</span>
                  </p>
                  <p class="text-sm text-gray-600 mt-0.5">
                    {{ room.capacity }} guests · {{ room.beds }} bed(s) · €{{ room.price_per_night }}/night
                  </p>
                  <p v-if="room.description" class="text-xs text-gray-400 mt-0.5">{{ room.description }}</p>
                </div>
                <div class="flex gap-2">
                  <button @click="openRoomForm(room)" class="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="deleteRoom(room)" class="p-2 hover:bg-gray-100 rounded-lg" title="Delete">
                    <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Room Form -->
          <div v-if="showRoomForm" class="glass-card rounded-2xl p-6">
            <h3 class="font-bold text-gray-900 mb-4">{{ editingRoom ? 'Edit room' : 'Add room' }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input v-model="roomForm.name" placeholder="Room name *" class="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300" />
              <select v-model="roomForm.roomTypeId" class="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white">
                <option value="" disabled>Room type *</option>
                <option v-for="rt in roomTypes" :key="rt.id" :value="rt.id">{{ rt.name }}</option>
              </select>
              <input v-model.number="roomForm.capacity" type="number" min="1" placeholder="Capacity (guests) *" class="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300" />
              <input v-model.number="roomForm.beds" type="number" min="1" placeholder="Number of beds *" class="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300" />
              <input v-model.number="roomForm.pricePerNight" type="number" min="0" step="0.01" placeholder="Price per night (€) *" class="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300 md:col-span-2" />
            </div>
            <textarea v-model="roomForm.description" placeholder="Room description (optional)" rows="2" class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-300 mb-4"></textarea>
            <div class="flex gap-2">
              <button @click="saveRoom" :disabled="savingRoom" class="px-5 py-2 bg-gradient-primary text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50">
                {{ savingRoom ? 'Saving...' : 'Save room' }}
              </button>
              <button @click="showRoomForm = false" class="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200">Cancel</button>
            </div>
            <p v-if="roomFormError" class="text-red-600 text-sm mt-2">{{ roomFormError }}</p>
          </div>
        </div>

        <!-- ── Images Tab ── -->
        <div v-if="tab === 'images'">
          <div class="glass-card rounded-2xl p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Hotel images</h2>

            <!-- Upload -->
            <label class="flex items-center gap-3 cursor-pointer px-5 py-3 bg-violet-50 hover:bg-violet-100 rounded-xl w-fit mb-6 transition-colors">
              <svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span class="text-violet-700 font-medium text-sm">{{ uploadingImage ? 'Uploading...' : 'Upload image' }}</span>
              <input type="file" accept="image/*" class="hidden" @change="uploadImage" :disabled="uploadingImage" />
            </label>
            <p v-if="uploadError" class="text-red-600 text-sm mb-4">{{ uploadError }}</p>

            <!-- Gallery -->
            <div v-if="hotel.images.length === 0" class="text-gray-500 text-center py-8">No images yet.</div>
            <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div v-for="img in hotel.images" :key="img.hotel_image_id" class="relative group rounded-xl overflow-hidden aspect-video bg-gray-100">
                <img :src="`http://localhost:3000/${img.storage_path}`" :alt="img.original_name" class="w-full h-full object-cover" />
                <button
                  @click="deleteImage(img.hotel_image_id)"
                  class="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Remove image"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="tab === 'bookings'">
          <div class="glass-card rounded-2xl p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Bookings</h2>
            <div v-if="loadingBookings" class="text-gray-500 text-center py-8">Loading bookings...</div>
            <div v-else-if="bookings.length === 0" class="text-gray-500 text-center py-8">No bookings yet.</div>
            <div v-else class="space-y-3">
              <div v-for="b in bookings" :key="b.id" class="p-4 bg-white/60 rounded-xl border border-gray-100">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="font-semibold text-gray-900">{{ b.user_name || b.user_email }}</p>
                    <p class="text-sm text-gray-600">{{ b.user_email }}</p>
                    <p class="text-sm text-gray-600 mt-2">Room: {{ b.room_name }}</p>
                    <p class="text-sm text-gray-600">{{ b.check_in }} → {{ b.check_out }} · {{ b.guests }} guest(s)</p>
                    <p v-if="b.note" class="text-sm text-gray-500 mt-2">{{ b.note }}</p>
                  </div>
                  <div class="flex flex-col items-end gap-2">
                    <span class="px-3 py-1 text-xs font-semibold rounded-full"
                      :class="{
                        'bg-yellow-100 text-yellow-700': b.status === 'pending',
                        'bg-green-100 text-green-700': b.status === 'confirmed',
                        'bg-red-100 text-red-700': b.status === 'rejected'
                      }">
                      {{ b.status }}
                    </span>
                    <div v-if="b.status === 'pending'" class="flex gap-2">
                      <button @click="acceptBooking(b.id)" class="px-3 py-1 rounded-lg bg-green-600 text-white text-sm">Accept</button>
                      <button @click="rejectBooking(b.id)" class="px-3 py-1 rounded-lg bg-red-600 text-white text-sm">Reject</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="text-center text-gray-500 py-16">Hotel not found.</div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppShell from '../components/AppShell.vue'
import AppNavbar from '../components/AppNavbar.vue'

const API = 'http://localhost:3000'
const route = useRoute()
const hotelId = route.params.id

const hotel = ref(null)
const loading = ref(true)
const tab = ref('details')

// Reference data
const allAmenities  = ref([])
const allActivities = ref([])
const roomTypes     = ref([])

// Details tab state
const infoForm = ref({ name: '', city: '', address: '', description: '', nearby: '' })
const savingInfo = ref(false)
const infoError = ref('')
const selectedAmenities  = ref([])
const savingAmenities    = ref(false)
const selectedActivities = ref([])
const savingActivities   = ref(false)

// Rooms tab state
const showRoomForm = ref(false)
const editingRoom = ref(null)
const savingRoom = ref(false)
const roomFormError = ref('')
const roomForm = ref({ name: '', roomTypeId: '', capacity: 1, beds: 1, pricePerNight: 0, description: '' })

// Images tab state
const uploadingImage = ref(false)
const uploadError = ref('')

// Bookings tab state
const bookings = ref([])
const loadingBookings = ref(false)


async function loadHotel() {
  const res = await fetch(`${API}/owner/hotels/${hotelId}`, { credentials: 'include' })
  if (!res.ok) { hotel.value = null; loading.value = false; return }
  hotel.value = await res.json()
  infoForm.value = {
    name:        hotel.value.name,
    city:        hotel.value.city,
    address:     hotel.value.address     || '',
    description: hotel.value.description || '',
    nearby:      hotel.value.nearby      || '',
  }
  selectedAmenities.value  = hotel.value.amenities.map(a => a.id)
  selectedActivities.value = hotel.value.activities?.map(a => a.id) ?? []
  loading.value = false
}

async function loadBookings() {
  loadingBookings.value = true
  const res = await fetch(`${API}/owner/hotels/${hotelId}/bookings`, { credentials: 'include' })
  if (!res.ok) {
    bookings.value = []
    loadingBookings.value = false
    return
  }
  bookings.value = await res.json()
  loadingBookings.value = false
}

async function acceptBooking(id) {
  const res = await fetch(`${API}/owner/bookings/${id}/accept`, {
    method: 'PUT',
    credentials: 'include',
  })
  if (!res.ok) return
  await loadBookings()
}

async function rejectBooking(id) {
  const res = await fetch(`${API}/owner/bookings/${id}/reject`, {
    method: 'PUT',
    credentials: 'include',
  })
  if (!res.ok) return
  await loadBookings()
}

async function saveInfo() {
  infoError.value = ''
  if (!infoForm.value.name || !infoForm.value.city) {
    infoError.value = 'Name and city are required'
    return
  }
  savingInfo.value = true
  const res = await fetch(`${API}/owner/hotels/${hotelId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(infoForm.value)
  })
  savingInfo.value = false
  if (!res.ok) { infoError.value = 'Failed to save'; return }
  await loadHotel()
}

async function saveAmenities() {
  savingAmenities.value = true
  await fetch(`${API}/owner/hotels/${hotelId}/amenities`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ amenityIds: selectedAmenities.value })
  })
  savingAmenities.value = false
}

async function saveActivities() {
  savingActivities.value = true
  await fetch(`${API}/owner/hotels/${hotelId}/activities`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ activityIds: selectedActivities.value })
  })
  savingActivities.value = false
}

function openRoomForm(room = null) {
  editingRoom.value = room
  roomFormError.value = ''
  roomForm.value = room
    ? { name: room.name, roomTypeId: room.room_type_id, capacity: room.capacity, beds: room.beds, pricePerNight: room.price_per_night, description: room.description || '' }
    : { name: '', roomTypeId: '', capacity: 1, beds: 1, pricePerNight: 0, description: '' }
  showRoomForm.value = true
}

async function saveRoom() {
  roomFormError.value = ''
  if (!roomForm.value.name || !roomForm.value.roomTypeId) {
    roomFormError.value = 'Room name and type are required'
    return
  }
  savingRoom.value = true
  const url = editingRoom.value
    ? `${API}/owner/rooms/${editingRoom.value.id}`
    : `${API}/owner/hotels/${hotelId}/rooms`
  const method = editingRoom.value ? 'PUT' : 'POST'
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ hotelId: Number(hotelId), ...roomForm.value })
  })
  savingRoom.value = false
  if (!res.ok) {
    const data = await res.json()
    roomFormError.value = data.error || 'Failed to save room'
    return
  }
  showRoomForm.value = false
  editingRoom.value = null
  await loadHotel()
}

async function deleteRoom(room) {
  if (!confirm(`Delete room "${room.name}"?`)) return
  await fetch(`${API}/owner/rooms/${room.id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ hotelId: Number(hotelId) })
  })
  await loadHotel()
}

async function uploadImage(e) {
  const file = e.target.files[0]
  if (!file) return
  uploadError.value = ''
  uploadingImage.value = true
  const form = new FormData()
  form.append('image', file)
  const res = await fetch(`${API}/owner/hotels/${hotelId}/images`, {
    method: 'POST',
    credentials: 'include',
    body: form
  })
  uploadingImage.value = false
  e.target.value = ''
  if (!res.ok) {
    const data = await res.json()
    uploadError.value = data.error || 'Upload failed'
    return
  }
  await loadHotel()
}

async function deleteImage(hotelImageId) {
  if (!confirm('Remove this image?')) return
  await fetch(`${API}/owner/hotels/${hotelId}/images/${hotelImageId}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  await loadHotel()
}

onMounted(async () => {
  const [a, act, rt] = await Promise.all([
    fetch(`${API}/amenities`).then(r => r.json()),
    fetch(`${API}/activities`).then(r => r.json()),
    fetch(`${API}/room-types`).then(r => r.json()),
  ])
  allAmenities.value  = a
  allActivities.value = act
  roomTypes.value     = rt
  await loadHotel()
})

watch(tab, async (value) => {
  if (value === 'bookings') {
    await loadBookings()
  }
})
</script>
