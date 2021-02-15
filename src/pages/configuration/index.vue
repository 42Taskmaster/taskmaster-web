<template>
  <div v-if="loading">
    <Loading />
  </div>

  <AppLayout>
    <template #title>
      Configuration
    </template>

    <template #actions>
      <AppButton v-if="!editing" @click="startEditing">
        <heroicons-outline-pencil class="mr-2" />
        Modifier
      </AppButton>
      <template
        v-else
      >
        <AppButton color="green" outlined="false" class="mr-2" @click="saveEditing">
          <heroicons-outline-save class="mr-2" />
          Enregistrer
        </AppButton>
        <AppButton color="red" @click="cancelEditing">
          <heroicons-outline-x class="mr-2" />
          Annuler
        </AppButton>
      </template>
    </template>

    <AppAlert v-if="alert.show" :type="alert.type" :close-callback="closeAlertCallback">
      {{ alert.message }}
    </AppAlert>

    <div class="relative h-full pb-10 ">
      <VAceEditor
        v-model:value="configurationText"
        lang="yaml"
        :readonly="editorReadonly"
        class="h-full shadow"
      />

      <div class="absolute top-0 right-0 flex items-center p-2 mt-5 mr-8 text-gray-500 bg-gray-100 rounded shadow">
        <template v-if="editorReadonly">
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
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import { VAceEditor } from 'vue3-ace-editor'
import 'ace-builds/src-noconflict/mode-yaml'
import 'ace-builds/src-noconflict/theme-chrome'

import { putConfiguration } from '/~/api/configuration'
import { useConfiguration } from '/~/composables/configuration'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: {
    VAceEditor,
  },
  setup() {
    const { t } = useI18n()

    const { configuration, reload } = useConfiguration()

    const configurationText = ref<string>('')
    const editorReadonly = ref<boolean>(true)

    const editing = ref(false)
    const loading = ref(false)
    const alert = ref({
      show: false,
      type: 'primary',
      message: '',
    })

    watch(configuration, (configuration) => {
      if (configuration === undefined)
        return

      configurationText.value = configuration
      loading.value = false
    })

    function enableEditing() {
      editorReadonly.value = false
    }

    function disableEditing() {
      editorReadonly.value = true
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

    function closeAlertCallback() {
      alert.value.show = false
    }

    function showAlert(type: string, message: string) {
      alert.value.type = type
      alert.value.show = true
      alert.value.message = message
    }

    async function saveEditing() {
      loading.value = true

      try {
        disableEditing()

        await putConfiguration(configurationText.value)

        editing.value = false
        showAlert('success', 'La configuration a été mise à jour avec succès.')
      }
      catch (err) {
        enableEditing()
        showAlert('warning', 'Une erreur est survenue lors de la mise à jour de la configuration')
      }
      finally {
        loading.value = false
      }
    }

    return {
      t,

      configurationText,
      editorReadonly,
      loading,

      editing,
      startEditing,
      cancelEditing,
      saveEditing,

      alert,
      closeAlertCallback,
    }
  },
})
</script>

<i18n>
{
  "fr": {
    "read-only": "Mode lecture",
    "read-write": "Mode édition"
  },

  "en": {
    "read-only": "Read only",
    "read-write": "Edit mode"
  }
}
</i18n>
