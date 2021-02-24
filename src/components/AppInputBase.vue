<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

type InputType = 'text' | 'number'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: undefined,
    },

    placeholder: {
      type: String,
      default: '',
    },

    modelValue: {
      type: [String, Number],
      default: '',
    },

    type: {
      type: String as PropType<InputType>,
      default: 'text',
      validator: (value: string): value is InputType => {
        return ['text', 'number'].includes(value)
      },
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

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const inputNumberProps = computed(() => {
      if (props.type !== 'number')
        return undefined

      return {
        min: props.min,
        max: props.max,
      }
    })

    function handleInput(event: Event) {
      const { target } = (event as InputEvent)

      if (target === null)
        return

      const inputElement = (target as HTMLInputElement)

      emit('update:modelValue', inputElement.value)
    }

    return {
      inputNumberProps,

      handleInput,
    }
  },
})
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700">
      <span v-if="title !== undefined" class="inline-block mb-1">{{ title }}</span>

      <input
        v-bind="inputNumberProps"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm outline-none sm:text-sm text-grey-800 focus:ring-indigo-500 focus:border-indigo-500"
        @input="handleInput"
      >
    </label>
  </div>
</template>
