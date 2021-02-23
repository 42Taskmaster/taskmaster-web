<template>
  <div v-if="isLoading">
    <AppLoadingOverlay />
  </div>

  <AppLayout>
    <template #title>
      Logs
    </template>

    <template #actions>
      <AppButton color="red" @click="clearLogs">
        <heroicons-outline-trash class="mr-2" />
        {{ t('clear') }}
      </AppButton>
    </template>

    <div class="flex flex-col h-full">
      <AppAlert v-if="alert.show" :type="alert.type" :close-callback="closeAlertCallback">
        {{ alert.message }}
      </AppAlert>

      <div class="flex-grow">
        <div class="h-full p-4 bg-white border rounded-lg shadow-sm">
          <div class="relative h-full">
            <pre ref="logsPre" class="absolute inset-0 h-full p-3 overflow-y-auto text-sm text-gray-600 whitespace-pre-wrap bg-gray-100 border">{{ logsText }}</pre>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent, watch, ref, nextTick } from 'vue'

import { useLogs } from '/~/composables/logs'
import { useI18n } from 'vue-i18n'
import { deleteLogs } from '../api/logs'
import { Alert, AlertType, Fetcher } from '../types/index'
import { useFetcher } from '../composables/fetcher'

export default defineComponent({
  setup() {
    const { t } = useI18n()

    const fetcher = useFetcher()

    const { logs, isLoading } = useLogs()

    const logsPre = ref<HTMLPreElement>()
    const logsText = ref<string>('')
    const loading = ref(false)
    const alert = ref<Alert>({
      show: false,
      type: AlertType.PRIMARY,
      message: '',
    })

    watch(logs, async(logs) => {
      if (logs === undefined)
        return

      let wasAtBottomScroll = false
      if (logsPre.value)
        wasAtBottomScroll = logsPre.value.scrollTop >= logsPre.value.scrollHeight - logsPre.value.offsetHeight

      logsText.value = logs

      await nextTick()

      if (logsPre.value && wasAtBottomScroll)
        logsPre.value.scrollTop = logsPre.value.scrollHeight
    })

    function closeAlertCallback() {
      alert.value.show = false
    }

    function showAlert(type: AlertType, message: string) {
      alert.value.type = type
      alert.value.show = true
      alert.value.message = message
    }

    async function clearLogs() {
      if (!confirm(t('confirm_clear')))
        return
      loading.value = true

      try {
        if (fetcher.value !== undefined && fetcher.value !== null)
          await deleteLogs(fetcher.value.fetcher)
        else
          throw new Error('Fetcher is undefined or null')

        showAlert(AlertType.SUCCESS, t('logs_cleared'))
      }
      catch (err) {
        showAlert(AlertType.DANGER, t('logs_clear_error'))
      }
      finally {
        loading.value = false
      }
    }

    return {
      t,
      isLoading,
      logsPre,
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
  "en": {
    "clear": "Clear",
    "confirm_clear": "Are you sure you want to clear the logs ?",
    "logs_cleared": "Logs have been successfully cleared.",
    "logs_clear_error": "An error occured while trying to clear logs."
  },

  "fr": {
    "clear": "Effacer",
    "confirm_clear": "Êtes-vous sûr de vouloir effacer les logs ?",
    "logs_cleared": "Les logs ont été effacés avec succès.",
    "logs_clear_error": "Une erreur est survenue lors de la suppression des logs.",
  }
}
</i18n>
