<template>
  <AppShell>
    <AppNavbar />

    <div class="max-w-7xl mx-auto px-6 py-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-6">Search for <span class="font-extrabold">Hotels</span></h1>

      <!-- Top Search Bar -->
      <div class="glass-card rounded-2xl p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-3">
          <!-- Destination -->
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <input
              v-model="cityInput"
              @keyup.enter="search"
              type="text"
              placeholder="Destination"
              class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white/70 text-sm"
            />
          </div>

          <!-- Dates -->
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <input
              v-model="checkIn"
              type="date"
              class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white/70 text-sm text-gray-600"
            />
          </div>
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <input
              v-model="checkOut"
              type="date"
              class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white/70 text-sm text-gray-600"
            />
          </div>

          <!-- Guests -->
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <select
              v-model="guests"
              class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white/70 text-sm text-gray-600 appearance-none"
            >
              <option value="">Guests</option>
              <option value="1">1 Adult</option>
              <option value="2">2 Adults</option>
              <option value="3">3 Adults</option>
              <option value="4">4 Adults</option>
              <option value="5">5+ Adults</option>
            </select>
          </div>

          <!-- Search Button -->
          <button
            @click="search"
            class="px-8 py-2.5 bg-gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </div>

      <!-- Results count + sort -->
      <div class="flex items-center justify-between mb-4">
        <p class="text-gray-600 text-sm">
          <template v-if="loading">Searching...</template>
          <template v-else>
            Showing <strong>{{ sortedHotels.length }}</strong> hotel{{ sortedHotels.length !== 1 ? 's' : '' }}
            <span v-if="cityInput.trim()"> in <strong>{{ cityInput }}</strong></span>
          </template>
        </p>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500">Sort by</span>
          <div class="relative">
            <select
              v-model="sortBy"
              class="appearance-none pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg bg-white/80 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 cursor-pointer"
            >
              <option value="name">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
          <button
            v-if="cityInput || maxPrice < 800 || guests"
            @click="clearFilters"
            class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-violet-600 hover:bg-violet-50 transition-colors"
          >
            Clear filters
          </button>
        </div>
      </div>

      <!-- Main layout: sidebar + results -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <!-- Sidebar Filters -->
        <aside class="lg:col-span-1">
          <div class="glass-card rounded-2xl p-6 sticky top-24 space-y-6">
            <h2 class="text-lg font-bold text-gray-900">Filters</h2>

            <!-- Destination -->
            <div>
              <button @click="openSections.destination = !openSections.destination" class="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                Destination
                <svg :class="openSections.destination ? 'rotate-180' : ''" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div v-show="openSections.destination" class="relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <input
                  v-model="cityInput"
                  @keyup.enter="search"
                  type="text"
                  placeholder="City name"
                  class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white/70"
                />
              </div>
            </div>

            <!-- Dates -->
            <div>
              <button @click="openSections.dates = !openSections.dates" class="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                Dates
                <svg :class="openSections.dates ? 'rotate-180' : ''" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div v-show="openSections.dates" class="space-y-2">
                <input v-model="checkIn" type="date" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white/70 text-gray-600" />
                <input v-model="checkOut" type="date" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white/70 text-gray-600" />
              </div>
            </div>

            <!-- Guests -->
            <div>
              <button @click="openSections.guests = !openSections.guests" class="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                Guests
                <svg :class="openSections.guests ? 'rotate-180' : ''" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div v-show="openSections.guests">
                <select v-model="guests" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white/70 text-gray-600">
                  <option value="">Any</option>
                  <option value="1">1 Adult</option>
                  <option value="2">2 Adults</option>
                  <option value="3">3 Adults</option>
                  <option value="4">4 Adults</option>
                  <option value="5">5+ Adults</option>
                </select>
              </div>
            </div>

            <!-- Price Range -->
            <div>
              <button @click="openSections.price = !openSections.price" class="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                Price Range
                <svg :class="openSections.price ? 'rotate-180' : ''" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div v-show="openSections.price" class="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="800"
                  step="10"
                  v-model="maxPrice"
                  @change="search"
                  class="w-full"
                  :style="`background: linear-gradient(to right, #6366f1 0%, #6366f1 ${(maxPrice/800)*100}%, #e5e7eb ${(maxPrice/800)*100}%, #e5e7eb 100%)`"
                />
                <div class="flex justify-between text-sm">
                  <span class="text-gray-400">€0</span>
                  <span class="font-semibold text-violet-600">€{{ maxPrice }}</span>
                </div>
              </div>
            </div>

            <!-- Star Rating -->
            <div>
              <button @click="openSections.stars = !openSections.stars" class="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                Star Rating
                <svg :class="openSections.stars ? 'rotate-180' : ''" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div v-show="openSections.stars" class="space-y-2">
                <label v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" v-model="selectedStars" :value="star" class="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                  <div class="flex items-center gap-1">
                    <svg v-for="n in star" :key="n" class="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span class="text-sm text-gray-600">{{ star }} Stars</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <!-- Hotel Cards -->
        <main class="lg:col-span-3">

          <!-- Error -->
          <div v-if="error" class="glass-card rounded-2xl p-6 text-red-600">{{ error }}</div>

          <!-- Loading skeleton -->
          <div v-else-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div v-for="n in 4" :key="n" class="glass-card rounded-2xl overflow-hidden animate-pulse">
              <div class="h-52 bg-gray-200"></div>
              <div class="p-5 space-y-3">
                <div class="h-5 bg-gray-200 rounded w-3/4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                <div class="flex gap-2">
                  <div class="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div class="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div class="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- No results -->
          <div v-else-if="sortedHotels.length === 0" class="glass-card rounded-2xl p-12 text-center">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <p class="text-gray-500 text-lg font-medium">No hotels found</p>
            <p class="text-gray-400 text-sm mt-1">Try a different city or adjust your price range</p>
          </div>

          <!-- Cards Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <HotelCard v-for="hotel in sortedHotels" :key="hotel.id" :hotel="hotel" />
          </div>
        </main>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppShell from '../components/AppShell.vue'
import AppNavbar from '../components/AppNavbar.vue'
import HotelCard from '../components/HotelCard.vue'

const API_URL = 'http://localhost:3000'
const route = useRoute()

// State
const hotels     = ref([])
const loading    = ref(false)
const error      = ref(null)

// Search bar inputs
const cityInput  = ref('')
const checkIn    = ref('')
const checkOut   = ref('')
const guests     = ref('')

// Sidebar filters
const maxPrice     = ref(800)
const selectedStars = ref([])
const sortBy       = ref('name')

// Which sidebar sections are open
const openSections = ref({
  destination: true,
  dates: true,
  guests: true,
  price: true,
  stars: true,
})

// Deterministic star rating per hotel (placeholder until stars added to DB)
const starMap = [5, 5, 4, 4, 4, 3]
function hotelStars(id) {
  return starMap[(id - 1) % starMap.length]
}

// Client-side sort + star filter
const sortedHotels = computed(() => {
  let list = [...hotels.value]

  // Filter by selected stars
  if (selectedStars.value.length > 0) {
    list = list.filter(h => selectedStars.value.includes(hotelStars(h.id)))
  }

  if (sortBy.value === 'price_asc')  return list.sort((a, b) => (a.min_price ?? 9999) - (b.min_price ?? 9999))
  if (sortBy.value === 'price_desc') return list.sort((a, b) => (b.min_price ?? 0) - (a.min_price ?? 0))
  return list
})

async function search() {
  loading.value = true
  error.value = null

  try {
    const params = new URLSearchParams()
    if (cityInput.value.trim()) params.set('city', cityInput.value.trim())
    if (maxPrice.value < 800)   params.set('maxPrice', maxPrice.value)
    if (guests.value)           params.set('guests', guests.value)
    // Send dates so the backend can filter out unavailable rooms
    if (checkIn.value)          params.set('checkIn', checkIn.value)
    if (checkOut.value)         params.set('checkOut', checkOut.value)

    const res = await fetch(`${API_URL}/hotels?${params}`)
    if (!res.ok) throw new Error('Failed to fetch hotels')
    hotels.value = await res.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function clearFilters() {
  cityInput.value  = ''
  checkIn.value    = ''
  checkOut.value   = ''
  guests.value     = ''
  maxPrice.value   = 800
  selectedStars.value = []
  search()
}

onMounted(() => {
  // Pre-fill destination from the landing page search bar (?city=X)
  if (route.query.city) {
    cityInput.value = route.query.city
  }
  search()
})
</script>
