<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
  },

  emits: {
    'update:modelValue': (value: boolean) => {
      return typeof value === 'boolean'
    },
  },
})
</script>

<template>
  <div>
    <label class="flex flex-col text-sm font-medium text-gray-700">
      <span class="inline-block mb-1">{{ title }}</span>

      <AppToggle :label="title" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" />
    </label>
  </div>
</template>
