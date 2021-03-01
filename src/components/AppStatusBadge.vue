<template>
  <AppBadge
    :class="[backgroundClass, textClass]"
    class="capitalize"
  >
    {{ statusLocale }}
  </AppBadge>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { ProgramState } from '/~/types/index'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  props: {
    light: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String as PropType<ProgramState>,
      default: ProgramState.UNKNOWN,
      validator: (status: ProgramState): status is ProgramState => Reflect.has(ProgramState, status),
    },
  },

  setup(props) {
    const { t } = useI18n()

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
          return props.light ? 'bg-blue-100' : 'bg-blue-500'
        case ProgramState.RUNNING:
          return props.light ? 'bg-green-100' : 'bg-green-500'
        case ProgramState.BACKOFF:
          return props.light ? 'bg-yellow-100' : 'bg-yellow-500'
        case ProgramState.STOPPED:
        case ProgramState.EXITED:
          return props.light ? 'bg-gray-200' : 'bg-gray-400'
        case ProgramState.FATAL:
          return props.light ? 'bg-red-100' : 'bg-red-500'
        default:
          return props.light ? 'bg-gray-100' : 'bg-gray-500'
      }
    })
    const statusLocale = computed(() => {
      return t(props.status).toUpperCase()
    })

    return {
      backgroundClass,
      textClass,
      statusLocale,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "STARTING": "Starting",
    "BACKOFF": "Transitioning",
    "RUNNING": "Running",
    "STOPPING": "Stopping",
    "STOPPED": "Stopped",
    "EXITED": "Exited",
    "FATAL": "Fatal",
    "UNKNOWN": "Unknown",
  },

  "fr": {
    "STARTING": "Démarrage en cours",
    "BACKOFF": "En transition",
    "RUNNING": "En cours d'exécution",
    "STOPPING": "En cours d'arrêt",
    "STOPPED": "Arrêté",
    "EXITED": "Quitté",
    "FATAL": "État critique",
    "UNKNOWN": "État non-défini",
  }
}
</i18n>
