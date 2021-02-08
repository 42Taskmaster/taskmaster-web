<template>
  <button :class="[buttonClasses, sizeClasses, 'inline-flex items-center border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2']">
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

type Style = 'primary' | 'secondary' | 'outlined'

enum Colors {
  white = 'white',
  red = 'red',
}

type ColorClasses = Record<Colors, string>

enum Size {
  'x-small' = 'x-small',
  'small' = 'small',
  'base' = 'base',
  'large' = 'large',
  'x-large' = 'x-large',
}

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
      type: String as PropType<Colors>,
      default: Colors.white,
      validator: (color: string): color is Colors => Reflect.has(Colors, color),
    },

    size: {
      type: String as PropType<Size>,
      default: 'base',
      validator: (size: string): size is Size => Reflect.has(Size, size),
    },
  },

  setup(props) {
    const buttonStyle = computed<Style>(() => {
      switch (true) {
        case props.primary:
          return 'primary'
        case props.secondary:
          return 'primary'
        default:
          return 'outlined'
      }
    })

    const buttonStyleClasses = computed<ColorClasses>(() => {
      const classes = new Map<Style, ColorClasses>([
        [
          'primary',
          {
            white: 'text-white bg-white hover:bg-gray-50 focus:ring-gray-500',
            red: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
          },
        ],
        [
          'secondary',
          {
            white: 'text-white bg-gray-50 hover:bg-gray-100 focus:ring-gray-500',
            red: 'text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500',
          },
        ],
        [
          'outlined',
          {
            white: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500',
            red: 'border-red-300 text-red-700 bg-white hover:bg-red-50 focus:ring-red-500',
          },
        ],
      ])

      const classesForButtonStyle = classes.get(buttonStyle.value)
      if (classesForButtonStyle === undefined)
        throw new Error('Classes for this button style do not exist')

      return classesForButtonStyle
    })

    const sizeClasses = computed<string>(() => {
      const classes = new Map<Size, string>([
        [
          Size['x-small'],
          'px-2.5 py-1.5 text-xs font-medium',
        ],
        [
          Size.small,
          'px-3 py-2 text-sm leading-4 font-medium',
        ],
        [
          Size.base,
          'px-4 py-2 text-sm font-medium',
        ],
        [
          Size.large,
          'px-4 py-2 text-base font-medium',
        ],
        [
          Size['x-large'],
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
      const classes = new Map<Size, string>([
        [
          Size['x-small'],
          '-ml-0.5 mr-2 h-4 w-4',
        ],
        [
          Size.small,
          '-ml-1 mr-2 h-5 w-5',
        ],
        [
          Size.base,
          '-ml-1 mr-2 h-5 w-5',
        ],
        [
          Size.large,
          '-ml-1 mr-3 h-5 w-5',
        ],
        [
          Size['x-large'],
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
