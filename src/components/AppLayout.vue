<template>
  <div class="flex flex-col w-full h-full">
    <header class="py-6 bg-white shadow">
      <div class="flex items-center justify-between px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
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
        'flex-grow w-full',
        {
          'px-4 mx-auto mt-8 max-w-7xl sm:px-6 lg:px-8': constraintWidth
        }
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    constraintWidth: {
      type: Boolean,
      default: true,
    },
  },
})
</script>
