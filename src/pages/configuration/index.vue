<template>
  <div v-if="isLoading">
    <AppLoadingOverlay />
  </div>

  <AppLayout :actions="layoutActions">
    <template #title>
      Configuration
    </template>

    <div class="flex flex-col h-full">
      <AppAlert v-if="alert.show" :type="alert.type" :close-callback="closeAlert">
        {{ alert.message }}
      </AppAlert>

      <div class="relative flex-grow">
        <VAceEditor
          v-model:value="configurationText"
          lang="yaml"
          :readonly="editorReadOnly"
          :options="{
            tabSize: 2,
          }"
          class="h-full shadow"
        />

        <div class="absolute top-0 right-0 flex items-center p-2 mt-5 mr-8 text-gray-500 bg-gray-100 rounded shadow">
          <template v-if="editorReadOnly">
            <heroicons-outline-lock-closed aria-label="The configuration can not be modified" class="text-xl" />

            <span class="ml-1 text-sm font-medium">
              {{ t('read-only') }}
            </span>
          </template>
          <template v-else>
            <heroicons-outline-lock-open aria-label="The configuration can be modified" class="text-xl" />

            <span class="ml-1 text-sm font-medium">
              {{ t('read-write') }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { VAceEditor } from 'vue3-ace-editor'
import 'ace-builds/src-noconflict/mode-yaml'
import 'ace-builds/src-noconflict/theme-chrome'
import SaveIcon from '/@vite-icons/heroicons-outline/save.vue'
import XIcon from '/@vite-icons/heroicons-outline/x.vue'
import PencilIcon from '/@vite-icons/heroicons-outline/pencil.vue'

import { putConfiguration } from '/~/api/configuration'
import { useConfiguration } from '/~/composables/configuration'
import { Alert, AlertType, ActionOptions, AppButtonColors } from '/~/types/index'
import { useFetcher } from '/~/composables/fetcher'

export default defineComponent({
  components: {
    VAceEditor,
  },
  setup() {
    const { t } = useI18n()

    const fetcher = useFetcher()
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

    const { configuration, reload, isLoading } = useConfiguration()
    const configurationText = ref<string>('')
    watch(configuration, (configuration) => {
      if (configuration === undefined)
        return
      configurationText.value = configuration
    }, {
      immediate: true,
    })

    const editorReadOnly = ref<boolean>(true)
    const editing = ref(false)
    function enableEditing() {
      editorReadOnly.value = false
    }
    function disableEditing() {
      editorReadOnly.value = true
    }
    function startEditing() {
      enableEditing()
      editing.value = true
    }
    function cancelEditing() {
      disableEditing()
      editing.value = false
      configurationText.value = configuration.value as string
      reload()
    }
    async function saveEditing() {
      showAlert(AlertType.PRIMARY, t('updating_configuration'))

      try {
        disableEditing()

        if (fetcher.value !== undefined && fetcher.value !== null)
          await putConfiguration(configurationText.value, fetcher.value.fetcher)
        else
          throw new Error('Fetcher is undefined or null')

        editing.value = false
        showAlert(AlertType.SUCCESS, t('configuration-update-succeed'))
      }
      catch (err) {
        enableEditing()
        showAlert(AlertType.DANGER, t('configuration-update-failed'))
      }
    }

    const layoutActions = computed<ActionOptions[]>(() => editing.value === true ? [
      {
        color: AppButtonColors.green,
        icon: SaveIcon,
        text: t('button.save'),
        onClick: saveEditing,
      },
      {
        color: AppButtonColors.red,
        icon: XIcon,
        text: t('button.cancel'),
        onClick: cancelEditing,
      },
    ] : [
      {
        icon: PencilIcon,
        text: t('button.edit'),
        onClick: startEditing,
      },
    ])

    return {
      t,

      isLoading,

      alert,
      closeAlert,

      configuration,
      configurationText,

      editing,
      editorReadOnly,
      startEditing,
      cancelEditing,
      saveEditing,

      layoutActions,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "read-only": "Read only",
    "read-write": "Edit mode",
    "configuration-update-succeed": "Configuration updated with success.",
    "configuration-update-failed": "An error occured while trying to update the configuration.",
    "updating_configuration": "Updating configuration..."
  },

  "fr": {
    "read-only": "Mode lecture",
    "read-write": "Mode édition",
    "configuration-update-succeed": "La configuration a été mise à jour avec succès.",
    "configuration-update-failed": "Une erreur est survenue lors de la mise à jour de la configuration.",
    "updating_configuration": "Mise à jour de la configuration..."
  }
}
</i18n>
