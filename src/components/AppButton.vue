<template>
  <button :class="[buttonClasses, sizeClasses, 'inline-flex items-center border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2']" :disabled="disabled">
    <span v-if="$slots['prepend-icon']" :class="iconClasses">
      <slot name="prepend-icon" />
    </span>

    <slot />

    <span v-if="$slots['append-icon']" :class="iconClasses">
      <slot name="append-icon" />
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { AppButtonColors, AppButtonSize, AppButtonStyle } from '/~/types/index'

type ColorClasses = Record<AppButtonColors, string>

export default defineComponent({
  props: {
    primary: {
      type: Boolean,
      default: false,
    },

    secondary: {
      type: Boolean,
      default: false,
    },

    outlined: {
      type: Boolean,
      default: true,
    },

    color: {
      type: String as PropType<AppButtonColors>,
      default: AppButtonColors.white,
      validator: (color: string): color is AppButtonColors => Reflect.has(AppButtonColors, color),
    },

    size: {
      type: String as PropType<AppButtonSize>,
      default: 'base',
      validator: (size: string): size is AppButtonSize => Reflect.has(AppButtonSize, size),
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const buttonStyle = computed<AppButtonStyle>(() => {
      switch (true) {
        case props.primary:
          return 'primary'
        case props.secondary:
          return 'secondary'
        default:
          return 'outlined'
      }
    })

    const buttonStyleClasses = computed<ColorClasses>(() => {
      const classes = new Map<AppButtonStyle, ColorClasses>([
        [
          'primary',
          {
            white: 'text-white bg-white hover:bg-gray-50 focus:ring-gray-500',
            red: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
            green: 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 border-green-700',
          },
        ],
        [
          'secondary',
          {
            white: 'text-white bg-gray-50 hover:bg-gray-100 focus:ring-gray-500',
            red: 'text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500',
            green: 'text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500 border-green-300',
          },
        ],
        [
          'outlined',
          {
            white: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500',
            red: 'border-red-300 text-red-700 bg-white hover:bg-red-50 focus:ring-red-500',
            green: 'border-green-300 text-green-700 bg-white hover:bg-green-50 focus:ring-green-500',
          },
        ],
      ])

      const classesForButtonStyle = classes.get(buttonStyle.value)
      if (classesForButtonStyle === undefined)
        throw new Error('Classes for this button style do not exist')

      return classesForButtonStyle
    })

    const sizeClasses = computed<string>(() => {
      const classes = new Map<AppButtonSize, string>([
        [
          AppButtonSize['x-small'],
          'px-2.5 py-1.5 text-xs font-medium',
        ],
        [
          AppButtonSize.small,
          'px-3 py-2 text-sm leading-4 font-medium',
        ],
        [
          AppButtonSize.base,
          'px-4 py-2 text-sm font-medium',
        ],
        [
          AppButtonSize.large,
          'px-4 py-2 text-base font-medium',
        ],
        [
          AppButtonSize['x-large'],
          'px-6 py-3 text-base font-medium',
        ],
      ])

      const classesForButtonSize = classes.get(props.size)
      if (classesForButtonSize === undefined)
        throw new Error('Classes for this button size do not exist')

      return classesForButtonSize
    })

    const buttonClasses = computed<string>(() => {
      const styleClasses = buttonStyleClasses.value

      return styleClasses[props.color]
    })

    const iconClasses = computed(() => {
      const classes = new Map<AppButtonSize, string>([
        [
          AppButtonSize['x-small'],
          '-ml-0.5 mr-2 h-4 w-4',
        ],
        [
          AppButtonSize.small,
          '-ml-1 mr-2 h-5 w-5',
        ],
        [
          AppButtonSize.base,
          '-ml-1 mr-2 h-5 w-5',
        ],
        [
          AppButtonSize.large,
          '-ml-1 mr-3 h-5 w-5',
        ],
        [
          AppButtonSize['x-large'],
          '-ml-1 mr-3 h-5 w-5',
        ],
      ])

      const classesForButtonSize = classes.get(props.size)
      if (classesForButtonSize === undefined)
        throw new Error('Classes for this size do not exist')

      return classesForButtonSize
    })

    return {
      buttonClasses,
      sizeClasses,
      iconClasses,
    }
  },
})
</script>
