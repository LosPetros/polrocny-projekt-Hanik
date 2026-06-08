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
            v-if="authStore.user?.role === 'owner'"
            to="/owner"
            class="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            active-class="text-gray-900"
          >
            My Hotels
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

          <div v-else class="relative flex items-center gap-3">
            <!-- User menu toggle -->
            <button @click="menuOpen = !menuOpen"
              class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-gray-200 text-gray-700 font-medium hover:bg-white transition-colors">
              <UserAvatar :name="authStore.user.name" size="sm" />
              <span class="text-sm hidden lg:inline">{{ authStore.user.name }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown -->
            <div v-if="menuOpen"
              class="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-2xl shadow-lg py-2 z-50">
              <button @click="handleLogout"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Logout
              </button>
              <hr class="my-1 border-gray-100" />
              <button @click="handleDeleteAccount"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                Delete account
              </button>
            </div>

            <!-- Click outside to close -->
            <div v-if="menuOpen" class="fixed inset-0 z-40" @click="menuOpen = false"></div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import UserAvatar from './UserAvatar.vue'

const router = useRouter()
const authStore = useAuthStore()
const menuOpen = ref(false)

async function handleLogout() {
  menuOpen.value = false
  await authStore.logout()
  router.push('/login')
}

async function handleDeleteAccount() {
  menuOpen.value = false
  if (!confirm('Permanently delete your account? This cannot be undone.')) return
  await fetch('http://localhost:3000/auth/me', {
    method: 'DELETE',
    credentials: 'include'
  })
  authStore.user = null
  router.push('/')
}
</script>
