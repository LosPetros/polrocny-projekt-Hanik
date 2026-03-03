<template>
  <AppShell>
    <AppNavbar />
    
    <div class="max-w-6xl mx-auto px-6 py-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <!-- Admin Info Alert -->
      <div class="glass-card rounded-2xl p-4 mb-8 bg-purple-50/50 border-purple-200">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p class="font-semibold text-purple-900">Admin Access</p>
            <p class="text-sm text-purple-700">You have admin privileges</p>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="glass-card rounded-2xl p-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium text-gray-600">Total Hotels</h3>
            <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-gray-900">326</p>
          <p class="text-sm text-green-600 mt-1">↑ 12% from last month</p>
        </div>

        <div class="glass-card rounded-2xl p-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium text-gray-600">Total Bookings</h3>
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-gray-900">1,284</p>
          <p class="text-sm text-green-600 mt-1">↑ 8% from last month</p>
        </div>

        <div class="glass-card rounded-2xl p-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium text-gray-600">Total Users</h3>
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-gray-900">892</p>
          <p class="text-sm text-green-600 mt-1">↑ 24% from last month</p>
        </div>

        <div class="glass-card rounded-2xl p-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium text-gray-600">Revenue</h3>
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-gray-900">$284K</p>
          <p class="text-sm text-green-600 mt-1">↑ 18% from last month</p>
        </div>
      </div>

      <!-- Management Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Hotels Management -->
        <div class="glass-card rounded-2xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900">Hotels Management</h2>
            <button class="px-4 py-2 bg-gradient-primary text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
              Add Hotel
            </button>
          </div>

          <div class="space-y-3">
            <div class="p-4 bg-white/50 rounded-xl border border-gray-100">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold text-gray-900">Grand Central Hotel</h3>
                  <p class="text-sm text-gray-600">New York, NY</p>
                </div>
                <div class="flex gap-2">
                  <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="p-4 bg-white/50 rounded-xl border border-gray-100">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold text-gray-900">Skyline Luxury Suites</h3>
                  <p class="text-sm text-gray-600">New York, NY</p>
                </div>
                <div class="flex gap-2">
                  <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Bookings -->
        <div class="glass-card rounded-2xl p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Recent Bookings</h2>

          <div class="space-y-3">
            <div class="p-4 bg-white/50 rounded-xl border border-gray-100">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-semibold text-gray-900">John Doe</h3>
                <span class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                  Confirmed
                </span>
              </div>
              <p class="text-sm text-gray-600">Grand Central Hotel • Apr 20-22</p>
              <p class="text-sm font-semibold text-gray-900 mt-1">$498</p>
            </div>

            <div class="p-4 bg-white/50 rounded-xl border border-gray-100">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-semibold text-gray-900">Jane Smith</h3>
                <span class="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full font-medium">
                  Pending
                </span>
              </div>
              <p class="text-sm text-gray-600">Skyline Luxury Suites • May 15-18</p>
              <p class="text-sm font-semibold text-gray-900 mt-1">$1,125</p>
            </div>

            <div class="p-4 bg-white/50 rounded-xl border border-gray-100">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-semibold text-gray-900">Mike Johnson</h3>
                <span class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                  Confirmed
                </span>
              </div>
              <p class="text-sm text-gray-600">Metropolitan Plaza • Jun 1-5</p>
              <p class="text-sm font-semibold text-gray-900 mt-1">$760</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import AppShell from '../components/AppShell.vue'
import AppNavbar from '../components/AppNavbar.vue'
</script>
