<template>
  <AppShell>
    <AppNavbar />
    <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <p class="text-8xl font-bold text-gray-200 mb-4">404</p>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Page not found</h1>
      <p class="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
      <router-link to="/" class="px-6 py-3 bg-gradient-primary text-white font-medium rounded-xl hover:opacity-90 transition-opacity">
        Back to home
      </router-link>
    </div>
  </AppShell>
</template>

<script setup>
import AppShell from '../components/AppShell.vue'
import AppNavbar from '../components/AppNavbar.vue'
</script>
