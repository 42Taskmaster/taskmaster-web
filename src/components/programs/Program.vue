<template>
  <router-link class="flex rounded-lg p-10 bg-white border border-solid shadow-sm cursor-pointer hover:bg-gray-50" :to="programUrl">
    <div class="flex items-center w-full">
      <div class="flex items-center justify-between w-full">
        <div class="flex flex-col">
          <div class="text-xl">
            {{ id }}
          </div>
          <div class="text-gray-500">
            {{ runningProcesses }}/{{ processes.length }} process{{ processes.length > 1 ? "es" : "" }}
          </div>
        </div>
        <StatusBadge :status="state" />
      </div>
      <heroicons-outline-arrow-right class="ml-16 text-2xl text-gray-500" />
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { Process, ProgramState } from '/~/types/index'

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    processes: {
      type: Array as PropType<Process[]>,
      required: true,
    },
  },

  setup(props) {
    const { t } = useI18n()

    const programUrl = computed(() => `/programs/${props.id}`)

    const runningProcesses = computed(() => {
      return props.processes.filter(process => process.state === ProgramState.RUNNING).length
    })

    return {
      t,
      programUrl,
      runningProcesses,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "process": "process",
    "processes": "processes"
  },

  "fr": {
    "process": "processus",
    "processes": "processus"
  }
}
</i18n>
