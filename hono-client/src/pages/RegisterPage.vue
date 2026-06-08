<template>
  <AppShell>
    <AppNavbar />
    
    <div class="flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-md">
        <!-- Glass Card -->
        <div class="glass-card rounded-3xl p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Create account</h1>
          <p class="text-gray-600 mb-8">Join Hotelex today</p>

            <!-- Error Message -->
            <div v-if="errorMessage" 
                 class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {{ errorMessage }}
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" 
                 class="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
              {{ successMessage }}
            </div>

            <!-- Register Form -->
            <form @submit.prevent="handleRegister">
              <!-- Name Input -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <!-- User Icon -->
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input 
                    v-model="name"
                    type="text" 
                    required
                    class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
                           focus:ring-2 focus:ring-primary focus:border-transparent bg-white/70"
                    placeholder="John Doe"
                  />
                </div>
              </div>

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
                    minlength="6"
                    class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
                           focus:ring-2 focus:ring-primary focus:border-transparent bg-white/70"
                    placeholder="••••••••"
                  />
                </div>
                <p class="mt-1 text-xs text-gray-500">At least 6 characters</p>
              </div>

              <!-- Account Type Selector -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Account type</label>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    @click="role = 'user'"
                    class="px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left"
                    :class="role === 'user' ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 bg-white/70 text-gray-600'"
                  >
                    <div class="font-semibold">Guest</div>
                    <div class="text-xs opacity-75 mt-0.5">Browse and book hotels</div>
                  </button>
                  <button
                    type="button"
                    @click="role = 'owner'"
                    class="px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left"
                    :class="role === 'owner' ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 bg-white/70 text-gray-600'"
                  >
                    <div class="font-semibold">Hotel owner</div>
                    <div class="text-xs opacity-75 mt-0.5">List your property</div>
                  </button>
                </div>
              </div>

              <!-- Confirm Password Input -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <!-- Lock Icon -->
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    v-model="confirmPassword"
                    type="password" 
                    required
                    class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
                           focus:ring-2 focus:ring-primary focus:border-transparent bg-white/70"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <!-- Create Account Button -->
              <button 
                type="submit"
                :disabled="loading"
                class="w-full py-3 px-4 bg-gradient-primary text-white font-semibold rounded-xl 
                       hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary 
                       focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? 'Creating account...' : 'Create account' }}
              </button>
            </form>

            <!-- Divider -->
            <div class="my-6 text-center text-sm text-gray-500">
              Already have an account?
            </div>

            <!-- Sign In Button -->
            <router-link 
              to="/login"
              class="block w-full py-3 px-4 bg-white/70 text-gray-800 font-semibold rounded-xl 
                     text-center hover:bg-white border border-gray-200"
            >
              Sign in instead
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

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('user')
const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''

  // Validate passwords match
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  // Validate password length
  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    return
  }

  loading.value = true

  try {
    await authStore.register(name.value, email.value, password.value, role.value)
    successMessage.value = 'Account created successfully! Redirecting to login...'
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    errorMessage.value = error.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
