<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { AppSelectOption, isAppSelectOption } from '/~/types/index'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: undefined,
    },

    options: {
      type: Array as PropType<AppSelectOption[]>,
      required: true,
      validator: (value: unknown[]) => value.every(isAppSelectOption),
    },

    modelValue: {
      type: String,
      default: '',
    },
  },

  emits: {
    'update:modelValue': (value: string) => {
      return value.length >= 0
    },
  },

  setup(props, { emit }) {
    function handleChange(event: Event) {
      const { target } = (event as InputEvent)

      if (target === null)
        return

      const selectElement = (target as HTMLSelectElement)

      emit('update:modelValue', selectElement.value)
    }

    return {
      handleChange,
    }
  },
})
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700">
      <span v-if="title !== undefined" class="inline-block mb-1">{{ title }}</span>

      <select
        :value="modelValue"
        class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm outline-none sm:text-sm text-grey-800 focus:ring-indigo-500 focus:border-indigo-500"
        @change="handleChange"
      >
        <option v-for="{ title: optionTitle, value: optionValue } in options" :key="optionValue" :value="optionValue">
          {{ optionTitle }}
        </option>
      </select>
    </label>
  </div>
</template>
