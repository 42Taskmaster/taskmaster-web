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
      <div
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
      </div>
    </template>

    <AppAlert v-if="alert.show" :type="alert.type" :close-callback="closeAlertCallback">
      {{ alert.message }}
    </AppAlert>

    <div class="relative h-full">
      <VAceEditor
        v-model:value="configurationText"
        lang="yaml"
        :readonly="editorReadonly"
        class="h-full"
      />

      <div class="absolute top-0 right-0 p-1 mt-4 mr-4 text-xl text-gray-500 bg-gray-100 rounded shadow">
        <heroicons-outline-lock-closed v-if="editorReadonly" aria-label="The configuration can not be modified" />
        <heroicons-outline-lock-open v-else aria-label="The configuration can be modified" />
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import { VAceEditor } from 'vue3-ace-editor'
import 'ace-builds/src-noconflict/mode-yaml'
import 'ace-builds/src-noconflict/theme-chrome'

import { useConfiguration, putConfiguration } from '/~/composables/configuration'

export default defineComponent({
  components: {
    VAceEditor,
  },

  setup() {
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
      disableEditing()
      if (await putConfiguration(configurationText.value)) {
        editing.value = false
        showAlert('success', 'La configuration a été mise à jour avec succès.')
      }
      else {
        enableEditing()
        showAlert('warning', 'Une erreur est survenue lors de la mise à jour de la configuration.')
      }

      loading.value = false
    }

    return {
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

<style scoped>
.disabled {
  background: #eee!important;
  pointer-events: none;
  cursor: inherit!important;
}
</style>
