<template>
  <main class="flex flex-row h-full font-sans col">
    <Sidebar />
    <div class="relative w-full h-full bg-gray-100">
      <NotConnected v-if="!isHomepage && !isConnected" />
      <router-view />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'

import { useFetcherAvailable } from '/~/composables/fetcher'

export default defineComponent({
  setup() {
    const router = useRouter()

    const isHomepage = computed(() => {
      return router.currentRoute.value.path === '/'
    })

    const isConnected = computed(() => {
      return useFetcherAvailable()
    })

    return {
      isHomepage,
      isConnected,
    }
  },
})
</script>
