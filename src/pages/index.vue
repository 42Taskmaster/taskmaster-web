<template>
  <div class="flex flex-col items-center justify-center h-full bg-white">
    <span class="px-5 py-2 mb-10 text-2xl border-b">
      {{ t("welcome") }}
    </span>
    <span class="mb-10">Status :
      <i :class="[statusClass]">
        {{ statusLabel }}
      </i>
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
        return `${t('connected_to')} ${fetcher.value?.url}`
      else if (tryingToConnectTo.value !== '')
        return `${t('connecting_to')} ${tryingToConnectTo.value}`
      else if (failedToConnectTo.value !== '')
        return `${t('could_not_connect_to')} ${failedToConnectTo.value}`

      return t('not_connected')
    })

    const statusClass = computed(() => {
      if (tryingToConnectTo.value !== '')
        return 'text-blue-500'
      else if (connected.value)
        return 'text-green-500'

      return 'text-red-500'
    })

    async function connect() {
      const connectionURL = apiUrl.value
      tryingToConnectTo.value = connectionURL

      try {
        await setFetcher(connectionURL)
      }
      catch (err) {
        console.error('could not set the fetcher:', err)
        failedToConnectTo.value = connectionURL
      }

      tryingToConnectTo.value = ''
    }

    async function disconnect() {
      await resetFetcher()
    }

    function shutdown() {

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
    "welcome": "Welcome to our Taskmaster's Web UI",
    "not_connected": "currently not connected",
    "connecting_to": "connecting to",
    "connected_to": "connected to",
    "could_not_connect_to": "could not connect to",
    "taskmaster_url": "http://localhost:8080",
    "connect": "Connect",
    "disconnect": "Disconnect",
    "shutdown": "Shutdown",
  },

  "fr": {
    "welcome": "Bienvenue sur l'interface Web de notre Taskmaster",
    "not_connected": "non connecté",
    "connecting_to": "connexion à",
    "connected_to": "connecté à",
    "could_not_connect_to": "erreur de connexion à",
    "taskmaster_url": "http://localhost:8080",
    "connect": "Se connecter",
    "disconnect": "Se déconnecter",
    "shutdown": "Arrêter le service",
  }
}
</i18n>
