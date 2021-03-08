<template>
  <div v-if="isLoading">
    <AppLoadingOverlay />
  </div>

  <AppLayout :actions="layoutActions">
    <template #title>
      Logs
    </template>

    <div class="flex flex-col h-full">
      <AppAlert v-if="alert.show" :type="alert.type" :close-callback="closeAlert">
        {{ alert.message }}
      </AppAlert>

      <div class="flex-grow">
        <div class="h-full p-4 bg-white border rounded-lg shadow-sm">
          <div class="relative h-full">
            <pre ref="logsPre" class="absolute inset-0 h-full p-3 overflow-y-auto text-sm text-gray-600 whitespace-pre-wrap bg-gray-100 border"><template v-if="logsText.length === 0">{{ t('logs_empty') }}</template><template v-else>{{ logsText }}</template></pre>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent, watch, ref, nextTick, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TrashIcon from '/@vite-icons/heroicons-outline/trash.vue'

import { useLogs } from '/~/composables/logs'
import { deleteLogs } from '/~/api/logs'
import { Alert, AlertType, ActionOptions, AppButtonColors } from '/~/types/index'
import { useFetcher } from '/~/composables/fetcher'

export default defineComponent({
  setup() {
    const { t } = useI18n()

    const alert = ref<Alert>({
      show: false,
      type: AlertType.PRIMARY,
      message: '',
    })
    function showAlert(type: AlertType, message: string) {
      alert.value.type = type
      alert.value.show = true
      alert.value.message = message
    }
    function closeAlert() {
      alert.value.show = false
    }

    const fetcher = useFetcher()

    const { logs, isLoading } = useLogs()
    const logsPre = ref<HTMLPreElement>()
    const logsText = ref<string>('')
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
    }, {
      immediate: true,
    })
    async function clearLogs() {
      if (!confirm(t('confirm_clear')))
        return

      showAlert(AlertType.PRIMARY, t('clearing_logs'))

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
    }

    const layoutActions = computed<ActionOptions[]>(() => [
      {
        color: AppButtonColors.red,
        icon: TrashIcon,
        text: t('clear'),
        onClick: clearLogs,
      },
    ])

    return {
      t,

      isLoading,

      alert,
      closeAlert,

      logsPre,
      logsText,
      clearLogs,

      layoutActions,
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
    "logs_clear_error": "An error occured while trying to clear logs.",
    "clearing_logs": "Clearing logs...",
    "logs_empty": "Logs are empty for now.",
  },

  "fr": {
    "clear": "Effacer",
    "confirm_clear": "Êtes-vous sûr de vouloir effacer les logs ?",
    "logs_cleared": "Les logs ont été effacés avec succès.",
    "logs_clear_error": "Une erreur est survenue lors de la suppression des logs.",
    "clearing_logs": "Suppression des logs...",
    "logs_empty": "Les logs sont vides pour le moment."
  }
}
</i18n>
