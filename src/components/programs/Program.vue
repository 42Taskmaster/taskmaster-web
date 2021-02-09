<template>
  <router-link class="flex p-10 bg-white border border-solid shadow-sm cursor-pointer hover:bg-gray-50" :to="programUrl">
    <div class="flex items-center w-full">
      <div class="flex items-center justify-between w-full">
        <div class="flex flex-col">
          <div class="text-xl">
            {{ id }}
          </div>
          <div class="text-gray-500">
            3/3 processes
          </div>
        </div>
        <Badge class="text-sm" :class="stateBadgeBg">
          {{ state }}
        </Badge>
      </div>
      <heroicons-outline-arrow-right class="ml-16 text-2xl text-gray-500" />
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'

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
  },

  setup(props) {
    const { t } = useI18n()

    const programUrl = computed(() => `/programs/${props.id}`)
    const stateBadgeBg = computed(() => {
      switch (props.state) {
        case 'STARTING':
          return 'bg-blue-500'
        case 'STOPPING':
          return 'bg-blue-500'
        case 'RUNNING':
          return 'bg-green-500'
        case 'UNKNOWN':
        case 'FATAL':
          return 'bg-red-500'
        case 'BACKOFF':
        case 'EXITED':
          return 'bg-yellow-500'
        default:
          return 'bg-gray-500'
      }
    })

    return {
      t,
      programUrl,
      stateBadgeBg,
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
}
</i18n>
