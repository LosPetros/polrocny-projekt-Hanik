<template>
  <div class="bg-white/72 backdrop-blur-sm rounded-2xl border border-white/60 overflow-hidden">
    <div class="h-36 overflow-hidden bg-gray-100">
      <img :src="roomImg" :alt="room.name" class="w-full h-full object-cover" loading="lazy" />
    </div>
    <div class="p-5 flex flex-col sm:flex-row sm:items-start gap-4">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1 flex-wrap">
          <h3 class="text-lg font-bold text-gray-900">{{ room.name }}</h3>
          <span class="text-xs px-2 py-0.5 bg-violet-50 text-violet-700 rounded-full font-medium">
            {{ room.type_name }}
          </span>
        </div>
        <p v-if="room.description" class="text-sm text-gray-500 mb-2 leading-relaxed">{{ room.description }}</p>
        <div class="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            {{ room.capacity }} guests
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            {{ room.beds }} bed{{ room.beds > 1 ? 's' : '' }}
          </span>
        </div>
        <div v-if="room.amenities" class="flex flex-wrap gap-1.5">
          <span v-for="a in room.amenities.split(', ')" :key="a"
            class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">{{ a }}</span>
        </div>
      </div>
      <div class="flex-shrink-0 flex flex-col items-end gap-2">
        <div class="text-right">
          <p class="text-2xl font-extrabold text-gray-900 leading-none">€{{ room.price_per_night }}</p>
          <p class="text-xs text-gray-400">per night</p>
        </div>
        <button @click="$emit('book', room)"
          class="px-5 py-2.5 bg-gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm whitespace-nowrap">
          Book this room
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  room: { type: Object, required: true },
})

defineEmits(['book'])

const ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=800&q=80',
]

const roomImg = computed(() => ROOM_IMAGES[(props.room.id - 1) % ROOM_IMAGES.length])
</script>
