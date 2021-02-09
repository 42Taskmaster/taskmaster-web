<template>
  <div v-if="loading">
    <Loading />
  </div>
  <AppLayout>
    <template #title>
      Configuration
    </template>
    <template #actions>
      <AppButton v-if="!editing" @click="startEditing()">
        <heroicons-outline-pencil class="mr-2" />
        Modifier
      </AppButton>
      <div
        v-else
      >
        <AppButton color="green" outlined="false" class="mr-2" @click="saveEditing()">
          <heroicons-outline-save class="mr-2" />
          Enregistrer
        </AppButton>
        <AppButton color="red" @click="cancelEditing()">
          <heroicons-outline-x class="mr-2" />
          Annuler
        </AppButton>
      </div>
    </template>
    <AppAlert v-if="alert.show" :type="alert.type" :close-callback="closeAlertCallback">
      {{ alert.message }}
    </AppAlert>
    <div id="root" ref="root" class="h-full py-2 bg-white border shadow-sm" :class="{ 'disabled': !editing }" />
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref, onUnmounted } from 'vue'
import { useConfiguration, putConfiguration } from '/~/composables/configuration'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    return new EditorWorker()
  },
}

export default defineComponent({

  setup() {
    const { configuration, reload } = useConfiguration()
    const root = ref<HTMLElement>()
    let editor: monaco.editor.IStandaloneCodeEditor
    const editing = ref(false)
    const loading = ref(true)
    const alert = ref({
      show: false,
      type: 'primary',
      message: '',
    })

    onMounted(() => {
      monaco.editor.defineTheme('disabled', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#eee',
          'editor.foreground': '#ddd',
        },
      })
      monaco.editor.setTheme('disabled')
      editor = monaco.editor.create(root.value as HTMLElement, {
        language: 'yaml',
        minimap: {
          enabled: false,
        },
        readOnly: true,
        scrollBeyondLastLine: false,
        automaticLayout: true,
      })
    })
    onUnmounted(() => {
      editor.dispose()
    })

    watch(configuration, (configuration) => {
      editor.setValue(configuration as string)
      loading.value = false
    })

    function enableEditing() {
      editor.updateOptions({ readOnly: false })
      monaco.editor.setTheme('vs')
    }

    function disableEditing() {
      editor.updateOptions({ readOnly: true })
      monaco.editor.setTheme('disabled')
    }

    function startEditing() {
      enableEditing()
      editing.value = true
    }

    function cancelEditing() {
      disableEditing()
      editing.value = false
      editor.setValue(configuration.value as string)
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
      if (await putConfiguration(editor.getValue())) {
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
      root,
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
