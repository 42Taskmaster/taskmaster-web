<template>
  <div v-if="loading">
    <Loading />
  </div>

  <AppLayout>
    <template #title>
      Logs
    </template>

    <template #actions>
      <AppButton @click="clearLogs">
        <heroicons-outline-trash class="mr-2" />
        {{ t('clear') }}
      </AppButton>
    </template>

    <AppAlert v-if="alert.show" :type="alert.type" :close-callback="closeAlertCallback">
      {{ alert.message }}
    </AppAlert>

    <div class="h-full p-4 bg-white border rounded-lg shadow-sm">
      <pre id="logs" class="h-full p-3 overflow-y-auto text-gray-600 whitespace-pre-wrap bg-gray-100 border">{{ logsText }}</pre>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'

import { useLogs } from '/~/composables/logs'
import { useI18n } from 'vue-i18n'
import { deleteLogs } from '../api/logs'

export default defineComponent({
  setup() {
    const { t } = useI18n()

    const { logs } = useLogs()

    const logsText = ref<string>('')
    const loading = ref(false)
    const alert = ref({
      show: false,
      type: 'primary',
      message: '',
    })

    watch(logs, (logs) => {
      if (logs === undefined)
        return

      logsText.value = logs
      loading.value = false

      const logsPre = document.getElementById('logs') as HTMLElement
      setTimeout(() => {
        logsPre.scrollTop = logsPre.scrollHeight
      }, 100)
    })

    function closeAlertCallback() {
      alert.value.show = false
    }

    function showAlert(type: string, message: string) {
      alert.value.type = type
      alert.value.show = true
      alert.value.message = message
    }

    async function clearLogs() {
      loading.value = true

      try {
        await deleteLogs()

        showAlert('success', t('logs_cleared'))
      }
      catch (err) {
        showAlert('warning', t('logs_clear_error'))
      }
      finally {
        loading.value = false
      }
    }

    return {
      t,

      logsText,
      clearLogs,
      alert,
      closeAlertCallback,
    }
  },
})
</script>

<i18n>
{
  "fr": {
    "clear": "Clear",
    "logs_cleared": "Logs have been successfully cleared.",
    "logs_clear_error": "An error occured while trying to clear logs."
  },

  "en": {
    "clear": "Effacer",
    "logs_cleared": "Les logs ont été effacés avec succès.",
    "logs_clear_error": "Une erreur est survenue lors de la suppression des logs.",
  }
}
</i18n>
