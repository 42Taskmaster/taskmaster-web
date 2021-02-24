<template>
  <AppInputBase
    :title="title"
    :placeholder="placeholder"
    :model-value="modelValue"
    :min="min"
    :max="max"
    type="number"
    @update:model-value="$emit('update:modelValue', Number($event))"
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
      type: Number,
      default: undefined,
    },

    min: {
      type: Number,
      default: 1,
    },

    max: {
      type: Number,
      default: 100,
    },
  },

  emits: {
    'update:modelValue': (value: number) => {
      return !Number.isNaN(value)
    },
  },
})
</script>
