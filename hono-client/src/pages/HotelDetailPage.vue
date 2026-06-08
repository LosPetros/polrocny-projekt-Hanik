<template>
  <AppShell>
    <AppNavbar />

    <!-- Loading -->
    <div v-if="loading" class="max-w-5xl mx-auto px-6 py-20 text-center text-gray-400">Loading...</div>

    <!-- Error -->
    <div v-else-if="error" class="max-w-5xl mx-auto px-6 py-20 text-center text-red-500">{{ error }}</div>

    <template v-else-if="hotel">

      <!-- ─── Photo gallery ─────────────────────────────────────────── -->
      <div class="max-w-6xl mx-auto px-6 pt-6">
        <div class="grid grid-cols-4 grid-rows-2 gap-2 rounded-3xl overflow-hidden h-72 md:h-[420px]">
          <div class="col-span-2 row-span-2 overflow-hidden">
            <img :src="galleryImages[0]" :alt="hotel.name"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer"
              loading="eager" />
          </div>
          <div v-for="i in [1,2,3,4]" :key="i" class="overflow-hidden relative">
            <img :src="galleryImages[i % galleryImages.length]"
              :alt="hotel.name + ' photo ' + i"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
              loading="lazy" />
            <div v-if="i === 4"
              class="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
              <span class="text-white text-sm font-semibold">All photos</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── Hotel name + meta bar ─────────────────────────────────── -->
      <div class="max-w-6xl mx-auto px-6 mt-6">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-1">
              {{ hotel.name }}
            </h1>
            <p class="text-gray-500 text-sm">
              <svg class="inline w-3.5 h-3.5 mr-1 -mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ hotel.city }}{{ hotel.address ? ', ' + hotel.address : '' }}
            </p>
          </div>
          <!-- Price block -->
          <div class="flex-shrink-0 text-right">
            <p class="text-sm text-gray-400 leading-none">from</p>
            <p class="text-4xl font-extrabold text-gray-900 leading-none tracking-tight">
              €{{ minPrice ?? '—' }}
            </p>
            <p class="text-sm text-gray-400">per night</p>
          </div>
        </div>

        <!-- Top amenity pills -->
        <div v-if="hotel.amenities?.length" class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          <span v-for="a in hotel.amenities.slice(0, 6)" :key="a.id"
            class="flex items-center gap-1.5 px-3 py-1 bg-white/70 border border-gray-150 rounded-full text-xs font-medium text-gray-600">
            <span class="text-primary">✓</span>{{ a.name }}
          </span>
          <span v-if="hotel.amenities.length > 6"
            class="px-3 py-1 bg-white/70 border border-gray-150 rounded-full text-xs text-gray-400">
            +{{ hotel.amenities.length - 6 }} more
          </span>
        </div>
      </div>

      <!-- ─── Two-column layout ─────────────────────────────────────── -->
      <div class="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 pb-24">

        <!-- LEFT: Tabs + content -->
        <div>
          <div class="flex gap-1 p-1 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 w-fit mb-7">
            <button v-for="tab in TABS" :key="tab.id" @click="activeTab = tab.id"
              class="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              :class="activeTab === tab.id
                ? 'bg-gradient-primary text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'">
              {{ tab.label }}
            </button>
          </div>

          <!-- ── Overview tab ── -->
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <p class="text-gray-700 leading-relaxed text-[1.05rem]" style="text-wrap: pretty">
              {{ hotel.description }}
            </p>
            <div v-if="hotel.nearby" class="glass-card rounded-2xl p-6">
              <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                </svg>
                What's nearby
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed">{{ hotel.nearby }}</p>
            </div>
            <div v-if="hotel.amenities?.length">
              <h3 class="font-bold text-gray-900 mb-3">Hotel facilities</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div v-for="a in hotel.amenities" :key="a.id"
                  class="flex items-center gap-2 px-3 py-2.5 bg-white/65 rounded-xl border border-white/60">
                  <span class="text-primary text-sm font-bold">✓</span>
                  <span class="text-sm text-gray-700">{{ a.name }}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-4">Availability</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MonthCalendar
                  v-for="offset in [0, 1]" :key="offset"
                  :year="calendarMonths[offset].year"
                  :month="calendarMonths[offset].month"
                  :booked-dates="bookedDates" />
              </div>
              <p class="text-xs text-gray-400 mt-3 flex items-center gap-2">
                <span class="inline-block w-3 h-3 rounded-sm bg-violet-100 border border-violet-200"></span>
                Dates with bookings
                <span class="inline-block w-3 h-3 rounded-sm bg-gray-100 ml-2"></span>
                Past / unavailable
              </p>
            </div>
          </div>

          <!-- ── Rooms tab ── -->
          <div v-if="activeTab === 'rooms'" class="space-y-4">
            <div v-if="rooms.length === 0"
              class="text-gray-500 text-center py-12 glass-card rounded-2xl">
              No rooms added yet.
            </div>
            <RoomCard
              v-for="room in rooms"
              :key="room.id"
              :room="room"
              @book="handleBook" />
          </div>

          <!-- ── Activities tab ── -->
          <div v-if="activeTab === 'activities'">
            <div v-if="!hotel.activities?.length" class="text-gray-400 text-center py-12">
              No activities listed.
            </div>
            <template v-else>
              <p class="text-gray-500 text-sm mb-5">Things to do in and around {{ hotel.city }}:</p>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div v-for="act in hotel.activities" :key="act.id"
                  class="flex items-center gap-3 p-4 bg-white/70 rounded-2xl border border-white/60 backdrop-blur-sm">
                  <span class="text-2xl leading-none">{{ activityEmoji(act.icon) }}</span>
                  <span class="text-sm font-semibold text-gray-800">{{ act.name }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- RIGHT: Sticky booking form -->
        <div>
          <BookingForm ref="bookFormRef" :rooms="rooms" />
        </div>
      </div>

    </template>
  </AppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppShell from '../components/AppShell.vue'
import AppNavbar from '../components/AppNavbar.vue'
import MonthCalendar from '../components/MonthCalendar.vue'
import RoomCard from '../components/RoomCard.vue'
import BookingForm from '../components/BookingForm.vue'

const API   = 'http://localhost:3000'
const route = useRoute()

const hotel   = ref(null)
const rooms   = ref([])
const loading = ref(true)
const error   = ref(null)

const activeTab = ref('overview')
const TABS = [
  { id: 'overview',   label: 'Overview'   },
  { id: 'rooms',      label: 'Rooms'      },
  { id: 'activities', label: 'Activities' },
]

const ALL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
]

const galleryImages = computed(() => {
  if (!hotel.value) return ALL_IMAGES.slice(0, 5)
  const uploaded = hotel.value.images?.map(img => `${API}/${img.storage_path}`) ?? []
  const combined = [...uploaded]
  for (const img of ALL_IMAGES) {
    if (combined.length >= 5) break
    combined.push(img)
  }
  return combined
})

const EMOJI_MAP = {
  mountain: '🥾', ski: '⛷️', snowboard: '🏂', bike: '🚵',
  bicycle:  '🚴', waves: '🏊', spa: '🧖', tennis: '🎾',
  golf:     '⛳', kayak: '🛶', map: '🗺️', wine: '🍷', star: '⭐',
}
function activityEmoji(icon) { return EMOJI_MAP[icon] ?? '✦' }

const minPrice = computed(() => {
  if (!rooms.value.length) return null
  return Math.min(...rooms.value.map(r => Number(r.price_per_night)))
})

const bookedDates = ref(new Set())
const calendarMonths = computed(() => {
  const now = new Date()
  return [0, 1].map(offset => {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1)
    return { year: d.getFullYear(), month: d.getMonth() }
  })
})

function expandRangesToDates(ranges) {
  const dates = new Set()
  for (const { checkIn, checkOut } of ranges) {
    const start = new Date(checkIn)
    const end   = new Date(checkOut)
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      dates.add(d.toISOString().slice(0, 10))
    }
  }
  return dates
}

const bookFormRef = ref(null)

function handleBook(room) {
  activeTab.value = 'rooms'
  bookFormRef.value?.open(room)
}

onMounted(async () => {
  try {
    const id = route.params.id
    const [hotelRes, roomsRes, datesRes] = await Promise.all([
      fetch(`${API}/hotels/${id}`),
      fetch(`${API}/hotels/${id}/rooms`),
      fetch(`${API}/hotels/${id}/booked-dates`),
    ])
    if (!hotelRes.ok) throw new Error('Hotel not found')
    hotel.value  = await hotelRes.json()
    rooms.value  = await roomsRes.json()
    const ranges = await datesRes.json()
    bookedDates.value = expandRangesToDates(ranges)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>
