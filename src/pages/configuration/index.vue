<template>
  <div v-if="loading">
    <Loading />
  </div>
  <AppLayout class="h-full">
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
    <div id="root" ref="root" class="h-full py-1 bg-white border shadow-sm" />
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
    const { configuration } = useConfiguration()
    const root = ref<HTMLElement>()
    let editor: monaco.editor.IStandaloneCodeEditor
    const editing = ref(false)
    const loading = ref(true)

    onMounted(() => {
      editor = monaco.editor.create(root.value as HTMLElement, {
        language: 'yaml',
        minimap: {
          enabled: false,
        },
        readOnly: false,
        scrollBeyondLastLine: false,
      })
    })
    onUnmounted(() => {
      editor.dispose()
    })

    watch(configuration, (configuration) => {
      editor.setValue(configuration as string)
      loading.value = false
    })

    function startEditing() {
      editor.updateOptions({ readOnly: false })
      editing.value = true
    }
    function cancelEditing() {
      editor.updateOptions({ readOnly: true })
      editing.value = false
    }
    async function saveEditing() {
      loading.value = true
      editor.updateOptions({ readOnly: true })
      if (await putConfiguration(editor.getValue()))
        editing.value = false
      else
        editor.updateOptions({ readOnly: false })
      loading.value = true
    }

    return {
      root,
      loading,

      editing,
      startEditing,
      cancelEditing,
      saveEditing,
    }
  },
})

</script>
