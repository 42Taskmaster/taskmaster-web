<template>
  <AppLayout class="w-full">
    <template #title>
      {{ t('home') }}
    </template>

    <h2 class="text-xl font-medium leading-6 text-gray-900">
      {{ t('heading') }}
    </h2>

    <div class="flex flex-col items-center justify-center p-10 mt-2 text-center bg-white rounded-lg shadow">
      <span class="mb-10">
        <span class="text-lg font-semibold">
          {{ t('status') }}
        </span>

        <AppBadge
          :class="statusClass"
          class="text-white text-md"
        >
          {{ statusLabel }}
        </AppBadge>
      </span>

      <template v-if="!connected">
        <div class="flex mb-10 border-b border-solid w-96">
          <heroicons-outline-link class="mt-0.5 ml-1 mr-2 text-xl text-gray-500" />
          <input
            v-model="apiUrl"
            class="w-full mb-2 bg-white bg-opacity-0 outline-none"
            :placeholder="t('taskmaster_url')"
            required
            :disabled="tryingToConnectTo !== '' || connected"
          >
        </div>
        <AppButton :disabled="tryingToConnectTo !== '' || connected" @click="connect">
          <heroicons-outline-arrow-circle-right class="mr-1" />
          {{ t('connect') }}
        </AppButton>
      </template>

      <div v-else class="flex gap-4">
        <AppButton @click="disconnect">
          <heroicons-outline-arrow-circle-left class="mr-1" />
          {{ t('disconnect') }}
        </AppButton>
        <AppButton color="red" @click="shutdown">
          <heroicons-outline-x-circle class="mr-1" />
          {{ t('shutdown') }}
        </AppButton>
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useFetcher, useFetcherSetter, useFetcherResetter } from '/~/composables/fetcher'

export default defineComponent({
  setup() {
    const { t } = useI18n()

    const setFetcher = useFetcherSetter()
    const resetFetcher = useFetcherResetter()
    const fetcher = useFetcher()

    const connected = computed(() => {
      return fetcher.value !== null
    })
    const tryingToConnectTo = ref('')
    const failedToConnectTo = ref('')

    const apiUrl = ref('')

    const statusLabel = computed(() => {
      if (connected.value)
        return `${t('connected_to')} '${fetcher.value?.url}'`
      else if (tryingToConnectTo.value !== '')
        return `${t('connecting_to')} '${tryingToConnectTo.value}'`
      else if (failedToConnectTo.value !== '')
        return `${t('could_not_connect_to')} '${failedToConnectTo.value}'`

      return t('not_connected')
    })

    const statusClass = computed(() => {
      if (tryingToConnectTo.value !== '')
        return 'bg-blue-500'
      else if (connected.value)
        return 'bg-green-500'

      return 'bg-red-500'
    })

    async function connect() {
      const connectionURL = apiUrl.value
      tryingToConnectTo.value = connectionURL

      try {
        await setFetcher(connectionURL)
        localStorage.setItem('apiUrl', connectionURL)
      }
      catch (err) {
        console.error('could not set the fetcher:', err)
        failedToConnectTo.value = connectionURL
      }

      tryingToConnectTo.value = ''
    }

    async function disconnect() {
      await resetFetcher()
      localStorage.removeItem('apiUrl')
    }

    async function shutdown() {
      await fetcher.value?.fetcher.delete('/shutdown')
    }

    return {
      t,
      apiUrl,
      connect,
      disconnect,
      shutdown,
      connected,
      tryingToConnectTo,
      statusLabel,
      statusClass,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "heading": "Taskmaster's API connection",
    "status": "Status:",
    "not_connected": "Currently not connected",
    "connecting_to": "Connecting to",
    "connected_to": "Connected to",
    "could_not_connect_to": "Could not connect to",
    "taskmaster_url": "http://localhost:8080",
    "connect": "Connect",
    "disconnect": "Disconnect",
    "shutdown": "Shutdown",
  },

  "fr": {
    "heading": "Connexion à l'API du Taskmaster",
    "status": "Statut :",
    "not_connected": "Non connecté",
    "connecting_to": "Connexion à",
    "connected_to": "Connecté à",
    "could_not_connect_to": "Erreur de connexion à",
    "taskmaster_url": "http://localhost:8080",
    "connect": "Se connecter",
    "disconnect": "Se déconnecter",
    "shutdown": "Arrêter le service",
  }
}
</i18n>
