<template>
  <AppShell>
    <AppNavbar />
    
    <div class="flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-md">
        <!-- Glass Card -->
        <div class="glass-card rounded-3xl p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p class="text-gray-600 mb-8">Sign in to your account</p>

            <!-- Error Message -->
            <div v-if="errorMessage" 
                 class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {{ errorMessage }}
            </div>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin">
              <!-- Email Input -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <!-- Email Icon -->
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input 
                    v-model="email"
                    type="email" 
                    required
                    class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
                           focus:ring-2 focus:ring-primary focus:border-transparent bg-white/70"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <!-- Password Input -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <!-- Lock Icon -->
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    v-model="password"
                    type="password" 
                    required
                    class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
                           focus:ring-2 focus:ring-primary focus:border-transparent bg-white/70"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="flex items-center justify-between mb-6">
                <label class="flex items-center">
                  <input type="checkbox" class="rounded border-gray-300 text-primary focus:ring-primary" />
                  <span class="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" class="text-sm text-primary hover:text-primary-light font-medium">
                  Forgot password?
                </a>
              </div>

              <!-- Sign In Button -->
              <button 
                type="submit"
                :disabled="loading"
                class="w-full py-3 px-4 bg-gradient-primary text-white font-semibold rounded-xl 
                       hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary 
                       focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? 'Signing in...' : 'Sign In' }}
              </button>
            </form>

            <!-- Divider -->
            <div class="my-6 text-center text-sm text-gray-500">
              or
            </div>

            <!-- Create Account Button -->
            <router-link 
              to="/register"
              class="block w-full py-3 px-4 bg-white/70 text-gray-800 font-semibold rounded-xl 
                     text-center hover:bg-white border border-gray-200"
            >
              Create an account
            </router-link>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppShell from '../components/AppShell.vue'
import AppNavbar from '../components/AppNavbar.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function handleLogin() {
  errorMessage.value = ''
  loading.value = true

  try {
    await authStore.login(email.value, password.value)
    // Redirect to search page after successful login
    router.push('/search')
  } catch (error) {
    errorMessage.value = error.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
