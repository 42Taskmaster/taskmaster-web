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
    <div class="flex mb-10 border-b border-solid w-96">
      <heroicons-outline-link class="mt-0.5 ml-1 mr-2 text-xl text-gray-500" />
      <input
        ref="inputRef"
        class="w-full mb-2 bg-white bg-opacity-0 outline-none"
        :placeholder="t('taskmaster_url')"
        :value="apiUrl"
        required
      >
    </div>

    <AppButton ref="btnRef" @click="connect">
      <heroicons-outline-arrow-circle-right class="mr-1" />
      {{ t('connect') }}
    </AppButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useFetcherProvider, useFetcherSetValid } from '/~/composables/fetcher'
import { getConfiguration } from '/~/api/configuration'

export default defineComponent({
  setup() {
    const { t } = useI18n()

    const { setFetcher } = useFetcherProvider()

    const inputRef = ref<HTMLInputElement>()
    const btnRef = ref<HTMLElement>()
    const statusLabel = ref(t('not_connected'))
    const statusClass = ref('text-red-500')
    const apiUrl = ref(inputRef.value?.value as string)

    const connect = function() {
      inputRef.value?.setAttribute('disabled', 'true')
      apiUrl.value = inputRef.value?.value as string
      statusClass.value = 'text-blue-500'
      statusLabel.value = `${t('connecting_to')} ${apiUrl.value}`

      // const fetcher = useFetcherProvider(apiUrl.value)

      const fetcher = setFetcher(apiUrl.value)

      try {
        getConfiguration(fetcher)
        useFetcherSetValid(true)
      }
      catch (e) {
        useFetcherSetValid(false)
      }
    }

    return {
      t,
      inputRef,
      btnRef,
      connect,
      apiUrl,
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
    "taskmaster_url": "http://localhost:8080",
    "connect": "Connect",
  },

  "fr": {
    "welcome": "Bienvenue sur l'interface Web de notre Taskmaster",
    "not_connected": "non connecté",
    "connecting_to": "connexion à",
    "taskmaster_url": "http://localhost:8080",
    "connect": "Se connecter",
  }
}
</i18n>
