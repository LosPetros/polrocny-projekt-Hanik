<template>
  <div class="bg-white/72 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/60 shadow-sm card-lift group cursor-pointer">
    <!-- Image with price overlay -->
    <div class="relative h-52 overflow-hidden bg-gray-100">
      <img
        :src="image"
        :alt="hotel.name + ' — ' + hotel.city"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        loading="lazy"
      />

      <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none"></div>

      <span class="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold rounded-full">
        {{ hotel.city }}
      </span>

      <div v-if="hotel.min_price" class="absolute bottom-3 right-3 text-right leading-none">
        <span class="text-white/70 text-[10px] font-medium block mb-0.5">from</span>
        <span class="text-white text-2xl font-extrabold tracking-tight">€{{ hotel.min_price }}</span>
        <span class="text-white/70 text-[10px] font-medium">/night</span>
      </div>
      <div v-else class="absolute bottom-3 right-3 text-white/60 text-sm">—</div>
    </div>

    <!-- Info section -->
    <div class="p-5">
      <h3 class="text-[1.05rem] font-bold text-gray-900 leading-snug mb-3">
        {{ hotel.name }}
      </h3>

      <div v-if="hotel.amenities" class="flex flex-wrap gap-1.5 mb-4">
        <span
          v-for="amenity in hotel.amenities.split(',').slice(0, 3)"
          :key="amenity"
          class="px-2.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full font-medium"
        >
          {{ amenity.trim() }}
        </span>
        <span v-if="hotel.amenities.split(',').length > 3"
          class="px-2.5 py-0.5 text-xs text-gray-400 rounded-full">
          +{{ hotel.amenities.split(',').length - 3 }} more
        </span>
      </div>

      <router-link
        :to="'/hotel/' + hotel.id"
        class="block w-full py-2.5 bg-gradient-primary text-white font-semibold rounded-xl text-sm text-center hover:opacity-90 transition-opacity"
      >
        View hotel
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  hotel: { type: Object, required: true }
})

const hotelImages = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600',
]

const image = computed(() => hotelImages[(props.hotel.id - 1) % hotelImages.length])
</script>
