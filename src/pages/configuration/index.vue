<template>
  <div class="w-full h-full p-7">
    <div class="flex flex-col flex-grow h-full p-6 space-y-3">
      <div class="flex items-center justify-between border-b">
        <div class="flex items-center">
          <h1 class="mb-2 text-3xl">
            Configuration
          </h1>
        </div>
        <button value="Modifier" />
      </div>
      <div id="root" ref="root" class="h-full py-1 bg-white border shadow-sm" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref, onUnmounted } from 'vue'
import { useConfiguration } from '/~/composables/configuration'
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
    })
    return {
      root,
    }
  },
})

</script>
