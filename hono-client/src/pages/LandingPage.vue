<template>
  <AppShell>
    <AppNavbar />
    
    <div class="max-w-6xl mx-auto px-6">
      <!-- Hero Section -->
      <div class="py-20 text-center">
        <h1 class="text-6xl font-bold text-gray-900 mb-6">
          Find Your Perfect Stay
        </h1>
        <p class="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover and book the best hotels around the world. 
          Simple, elegant, and built for modern travelers.
        </p>

        <router-link 
          to="/search"
          class="inline-block px-8 py-4 bg-gradient-primary text-white text-lg font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Start Browsing Hotels
        </router-link>
      </div>

      <!-- Features -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
        <div class="glass-card rounded-2xl p-8 text-center">
          <div class="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Secure Booking</h3>
          <p class="text-gray-600">
            Book with confidence using our secure payment system and verified hotels.
          </p>
        </div>

        <div class="glass-card rounded-2xl p-8 text-center">
          <div class="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Best Prices</h3>
          <p class="text-gray-600">
            Get the best deals on hotels with our price match guarantee.
          </p>
        </div>

        <div class="glass-card rounded-2xl p-8 text-center">
          <div class="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Easy Cancellation</h3>
          <p class="text-gray-600">
            Flexible cancellation policies for peace of mind when plans change.
          </p>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="glass-card rounded-3xl p-12 text-center my-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Ready to explore?</h2>
        <p class="text-gray-600 mb-8">Join thousands of travelers finding their perfect stay.</p>
        <div class="flex gap-4 justify-center">
          <router-link 
            to="/register"
            class="px-6 py-3 bg-gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Create Account
          </router-link>
          <router-link 
            to="/search"
            class="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Browse Hotels
          </router-link>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import AppShell from '../components/AppShell.vue'
import AppNavbar from '../components/AppNavbar.vue'
</script>
