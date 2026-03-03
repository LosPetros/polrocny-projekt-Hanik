<template>
  <nav class="sticky top-4 z-50 px-6 mx-auto max-w-6xl">
    <!-- Glass navbar with rounded corners -->
    <div class="bg-white/55 backdrop-blur-md border border-white/50 shadow-sm rounded-full px-6 py-3">
      <div class="flex items-center justify-between">
        <!-- Left: Logo -->
        <router-link to="/" class="flex items-center gap-3 group">
          <img src="/img/logo.png" alt="Hotelex" class="h-10 w-15 transition-transform group-hover:scale-110" />
        </router-link>

        <!-- Center: Navigation Links -->
        <div class="hidden md:flex items-center gap-6">
          <router-link 
            to="/search" 
            class="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            active-class="text-gray-900"
          >
            Browse Hotels
          </router-link>
          
          <router-link 
            v-if="authStore.user"
            to="/my-bookings" 
            class="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            active-class="text-gray-900"
          >
            My Bookings
          </router-link>
          
          <router-link 
            v-if="authStore.user?.role === 'admin'"
            to="/admin" 
            class="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            active-class="text-gray-900"
          >
            Admin
          </router-link>
        </div>

        <!-- Right: Auth Actions -->
        <div class="flex items-center gap-3">
          <!-- Search icon button (decorative for now) -->
          <button class="p-2 hover:bg-white/50 rounded-full transition-colors">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- Auth buttons -->
          <div v-if="!authStore.user">
            <router-link 
              to="/login"
              class="px-6 py-2 rounded-full bg-gradient-primary text-white font-medium hover:opacity-90 transition-opacity inline-block"
            >
              Log In
            </router-link>
          </div>

          <div v-else class="flex items-center gap-3">
            <span class="text-sm text-gray-700 hidden lg:inline">
              {{ authStore.user.name }}
            </span>
            <button 
              @click="handleLogout"
              class="px-5 py-2 rounded-full bg-white/70 border border-gray-200 text-gray-700 font-medium hover:bg-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>
