<template>
  <router-link
    :class="[
      {
        'sm:shadow sm:rounded-lg': !tiled,
        'shadow rounded-lg': tiled
      },
      'flex p-4 bg-white cursor-pointer sm:p-6 hover:bg-gray-50'
    ]"
    :to="programUrl"
  >
    <div
      class="flex items-center w-full"
      :class="{
        'flex-col gap-6': tiled
      }"
    >
      <div
        :class="[
          {
            'flex items-center justify-between flex-col text-center space-y-4': tiled,
            'flex flex-col items-start space-y-4 sm:items-center sm:space-y-0 sm:flex-row sm:justify-between': !tiled
          },
          'w-full flex-grow'
        ]"
      >
        <div class="flex flex-col text-gray-900">
          <div class="font-medium">
            {{ id }}
          </div>
          <div class="text-sm text-gray-500">
            {{ runningProcesses }}/{{ processes.length }} {{ t('process', processes.length) }}
          </div>
        </div>
        <AppStatusBadge :status="state" class="text-sm" />
      </div>

      <div v-if="!tiled" class="flex-shrink-0 ml-5">
        <heroicons-outline-chevron-right
          class="w-5 h-5 text-gray-400"
          :style="{
            'transform': 'unset'
          }"
        />
      </div>
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
    tiled: {
      type: Boolean,
      default: false,
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
    "process": "process | processes",
  },

  "fr": {
    "process": "processus",
  }
}
</i18n>
