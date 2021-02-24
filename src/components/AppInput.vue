<template>
  <AppInputBase
    :title="title"
    :placeholder="placeholder"
    :model-value="modelValue"
    type="text"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },

    placeholder: {
      type: String,
      default: '',
    },

    modelValue: {
      type: String,
      default: undefined,
    },
  },

  emits: ['update:modelValue'],
})
</script>
