<template>
  <div class="min-h-screen relative">
    <!-- Background layers -->
    <div class="fixed inset-0 z-0">
      <!-- Sky background image -->
      <div 
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style="background-image: url('/img/Background.png')"
      ></div>
          </div>

    <!-- Content -->
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>

<script setup>
</script>
