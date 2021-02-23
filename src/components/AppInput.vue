<template>
  <h2 v-if="title != ''" class="mb-1 font-medium leading-6 text-gray-800 text-md">
    {{ title }} :
  </h2>
  <input
    type="text"
    :value="modelValue"
    :placeholder="placeholder"
    class="w-full px-3 py-2 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm outline-none text-md text-grey-800 focus:ring-indigo-500 focus:border-indigo-500"
    @input="onChanged"
  >
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
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    function onChanged(e) {
      emit('update:modelValue', e.currentTarget.value)
    }

    return {
      onChanged,
    }
  },
})
</script>
