<template>
  <Badge
    :class="[backgroundClass, textClass]"
    class="capitalize"
  >
    {{ status }}
  </Badge>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { ProgramState } from '/~/composables/programs'

export default defineComponent({
  props: {
    light: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: '',
    },
  },

  setup(props) {
    const textClass = computed(() => {
      if (!props.light)
        return 'text-white'

      switch (props.status) {
        case ProgramState.STARTING:
        case ProgramState.STOPPING:
          return 'text-blue-800'
        case ProgramState.RUNNING:
          return 'text-green-800'
        case ProgramState.BACKOFF:
          return 'text-yellow-800'
        case ProgramState.EXITED:
          return 'text-gray-800'
        case ProgramState.FATAL:
          return 'text-red-800'
        case ProgramState.STOPPED:
        default:
          return 'text-gray-800'
      }
    })
    const backgroundClass = computed(() => {
      switch (props.status) {
        case ProgramState.STARTING:
        case ProgramState.STOPPING:
          return props.light ? 'bg-blue-100' : 'bg-blue-400'
        case ProgramState.RUNNING:
          return props.light ? 'bg-green-100' : 'bg-green-500'
        case ProgramState.BACKOFF:
          return props.light ? 'bg-yellow-100' : 'bg-yellow-500'
        case ProgramState.EXITED:
          return props.light ? 'bg-gray-200' : 'bg-gray-500'
        case ProgramState.FATAL:
          return props.light ? 'bg-red-100' : 'bg-red-500'
        case ProgramState.STOPPED:
        default:
          return props.light ? 'bg-gray-100' : 'bg-gray-500'
      }
    })

    return {
      backgroundClass,
      textClass,
    }
  },
})
</script>
