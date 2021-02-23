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
import { i18n } from './modules/i18n'

import { useFetcherProvider } from '/~/composables/fetcher'

export default defineComponent({
  setup() {
    const { fetcher, setFetcher } = useFetcherProvider()

    const apiUrl = localStorage.getItem('apiUrl')
    if (apiUrl) {
      try {
        (async function() {
          await setFetcher(apiUrl)
        })()
      }
      catch (err) {
      }
    }

    const locale = localStorage.getItem('locale')
    if (locale)
      i18n.global.locale.value = locale

    const router = useRouter()

    const isHomepage = computed(() => {
      return router.currentRoute.value.path === '/'
    })

    const isConnected = computed(() => {
      return fetcher.value !== null
    })

    return {
      isHomepage,
      isConnected,
    }
  },
})
</script>
