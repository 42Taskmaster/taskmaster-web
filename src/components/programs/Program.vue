<template>
  <router-link class="flex p-10 bg-white border border-solid shadow-sm cursor-pointer hover:bg-gray-50" :to="programUrl">
    <div class="flex items-center w-full">
      <div class="flex items-center justify-between w-full">
        <div class="flex flex-col">
          <div class="text-xl">
            {{ programId }}
          </div>
          <div class="text-gray-500">
            3/3 processes
          </div>
        </div>
        <Badge class="text-sm" :class="stateBadgeBg">
          {{ programState }}
        </Badge>
      </div>
      <heroicons-outline-arrow-right class="ml-16 text-2xl text-gray-500" />
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    programId: {
      type: String,
      required: true,
    },

    programState: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const programUrl = computed(() => `/programs/${props.programId}`)
    const stateBadgeBg = computed(() => {
      switch (props.programState) {
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
      programUrl,
      stateBadgeBg,
    }
  },
})
</script>
