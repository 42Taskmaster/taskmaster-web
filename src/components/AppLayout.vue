<template>
  <div class="flex flex-col w-full h-full min-h-screen">
    <header class="flex items-stretch bg-white shadow">
      <button class="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden" @click="toggleIsOpen">
        <span class="sr-only">
          {{ t('button.open-sidebar') }}
        </span>
        <!-- Heroicon name: outline/menu-alt-2 -->
        <svg
          class="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>

      <div class="flex items-center justify-between flex-grow px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold">
          <slot name="title" />
        </h1>

        <div v-if="$slots['actions']" class="flex space-x-2">
          <slot name="actions" />
        </div>
      </div>
    </header>

    <div
      :class="[
        'flex-grow w-full h-full',
        {
          'px-4 mx-auto my-8 max-w-7xl sm:px-6 lg:px-8': constraintWidth
        }
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import { useSidebar } from '/~/composables/sidebar'

export default defineComponent({
  props: {
    constraintWidth: {
      type: Boolean,
      default: true,
    },
  },

  setup() {
    const { t } = useI18n()

    const { toggleIsOpen } = useSidebar()

    return {
      t,

      toggleIsOpen,
    }
  },
})
</script>
