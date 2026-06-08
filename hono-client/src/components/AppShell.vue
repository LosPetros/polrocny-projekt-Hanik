<template>
  <div class="min-h-screen relative">

    <!-- Fixed background: sky photo + gradient overlay that fades sky → near-white -->
    <div class="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <div
        class="absolute inset-0 bg-cover bg-top bg-no-repeat"
        style="background-image: url('/img/Background.png')"
      ></div>
      <!-- Gradient: transparent at top (sky shows), nearly opaque at bottom -->
      <div
        class="absolute inset-0"
        style="background: linear-gradient(
          180deg,
          rgba(235, 245, 255, 0.05) 0%,
          rgba(241, 248, 255, 0.30) 25%,
          rgba(245, 251, 255, 0.70) 55%,
          rgba(248, 252, 255, 0.94) 80%,
          #f8fcff 100%
        )"
      ></div>
    </div>

    <!-- Page content -->
    <div class="relative z-10">
      <slot />
    </div>

  </div>
</template>

<script setup>
</script>
