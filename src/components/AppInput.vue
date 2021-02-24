<template>
  <AppInputBase v-bind="$props" type="text" />
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
