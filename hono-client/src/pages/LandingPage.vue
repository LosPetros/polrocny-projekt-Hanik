<template>
  <AppShell>
    <AppNavbar />

    <!-- ── Hero ─────────────────────────────────────────── -->
    <!-- Full-height section that uses the sky background.   -->
    <section class="relative flex flex-col items-center justify-center min-h-[88vh] px-6 text-center pb-16 pt-4">

      <div class="max-w-2xl mx-auto">
        <!-- Headline -->
        <h1
          class="fade-up text-[clamp(2.8rem,7vw,5rem)] font-extrabold text-gray-900 leading-[1.06] tracking-tight mb-5"
          style="text-wrap: balance"
        >
          Find your perfect stay
        </h1>

        <!-- Subtitle -->
        <p
          class="fade-up fade-up-delay-1 text-lg text-gray-500 mb-10 max-w-md mx-auto leading-relaxed"
          style="text-wrap: pretty"
        >
          Verified hotels across Slovakia. Transparent pricing, no surprise fees.
        </p>

        <!-- Inline destination search -->
        <div class="fade-up fade-up-delay-2 glass-card rounded-2xl p-2 flex items-center gap-2 max-w-sm mx-auto">
          <div class="relative flex-1 min-w-0">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none flex-shrink-0"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <input
              v-model="destination"
              @keyup.enter="goSearch"
              type="text"
              placeholder="Bratislava, Poprad…"
              class="w-full pl-9 pr-3 py-3 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm font-medium"
              aria-label="Destination city"
            />
          </div>
          <button
            @click="goSearch"
            class="flex-shrink-0 px-5 py-3 bg-gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all"
          >
            Search
          </button>
        </div>

        <!-- Trust line -->
        <p class="fade-up fade-up-delay-3 mt-5 text-xs text-gray-400 tracking-wide">
          6 hotels · Bratislava, Poprad, Piešťany, Košice and more
        </p>
      </div>
    </section>

    <!-- ── Value props ───────────────────────────────────── -->
    <!-- Three text columns inside a single card.            -->
    <!-- No icon bubbles — text hierarchy carries the weight. -->
    <section class="max-w-4xl mx-auto px-6 pb-28">
      <div class="glass-card rounded-3xl px-10 py-12 md:px-14 md:py-14">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0">

          <div class="md:pr-10">
            <p class="text-2xl font-bold text-gray-900 mb-2 leading-tight">Verified listings</p>
            <p class="text-gray-500 text-sm leading-relaxed">
              Every hotel is reviewed by our team before appearing in search results.
            </p>
          </div>

          <div class="md:px-10 md:border-x md:border-gray-100">
            <p class="text-2xl font-bold text-gray-900 mb-2 leading-tight">Transparent pricing</p>
            <p class="text-gray-500 text-sm leading-relaxed">
              No hidden fees. Room prices are set by owners and shown upfront.
            </p>
          </div>

          <div class="md:pl-10">
            <p class="text-2xl font-bold text-gray-900 mb-2 leading-tight">Book in minutes</p>
            <p class="text-gray-500 text-sm leading-relaxed">
              Pick a room, confirm, done. Cancel any booking at any time.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- ── CTA ──────────────────────────────────────────── -->
    <section class="max-w-3xl mx-auto px-6 pb-32 text-center">
      <h2
        class="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
        style="text-wrap: balance"
      >
        Ready to explore?
      </h2>
      <p class="text-gray-500 mb-8 text-base">Create a free account and start booking.</p>
      <div class="flex gap-3 justify-center flex-wrap">
        <router-link
          to="/register"
          class="px-7 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Create account
        </router-link>
        <router-link
          to="/search"
          class="px-7 py-3 bg-white/80 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-white transition-colors"
        >
          Browse hotels
        </router-link>
      </div>
    </section>

  </AppShell>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppShell from '../components/AppShell.vue'
import AppNavbar from '../components/AppNavbar.vue'

const router = useRouter()
const destination = ref('')

function goSearch() {
  const city = destination.value.trim()
  router.push(city ? { path: '/search', query: { city } } : '/search')
}
</script>
