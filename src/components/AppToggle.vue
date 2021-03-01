<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },
  },

  emits: {
    'update:modelValue': (value: boolean) => {
      return typeof value === 'boolean'
    },
  },

  setup(props, { emit }) {
    function toggle() {
      emit('update:modelValue', !props.modelValue)
    }

    return {
      toggle,
    }
  },
})
</script>

<template>
  <button
    type="button"
    :class="[
      {
        'bg-gray-200': modelValue === false,
        'bg-green-500': modelValue === true,
      },
      'relative inline-flex flex-shrink-0 h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600'
    ]"
    aria-pressed="false"
    @click="toggle"
  >
    <span class="sr-only">
      {{ label }}
    </span>
    <span
      aria-hidden="true"
      :class="[
        {
          'translate-x-0': modelValue === false,
          'translate-x-5': modelValue === true,
        },
        'inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full shadow pointer-events-none ring-0'
      ]"
    />
  </button>
</template>
