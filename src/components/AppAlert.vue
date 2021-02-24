<template>
  <div
    class="p-4 mb-5 "
    :class=" [
      alertType.alertClasses,
      { 'rounded-md': rounded, 'border': bordered, 'border-l-8': fatBorder },
    ] "
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <component :is="alertType.icon" class="w-5 h-5 " :class="alertType.iconClasses" />
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium" :class="alertType.textClasses">
          <slot />
        </p>
      </div>
      <div class="pl-3 ml-auto">
        <div class="-mx-1.5 -my-1.5">
          <button :class="alertType.buttonClasses" class="inline-flex  rounded-md p-1.5  focus:outline-none focus:ring-2 focus:ring-offset-2" @click="closeCallback">
            <span class="sr-only">Dismiss</span>
            <heroicons-solid-x class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import CheckCircleIcon from '/@vite-icons/heroicons-solid/check-circle.vue'
import InformationCircleIcon from '/@vite-icons/heroicons-solid/information-circle.vue'
import ExclamationIcon from '/@vite-icons/heroicons-solid/exclamation.vue'
import XCircleIcon from '/@vite-icons/heroicons-solid/x-circle.vue'
import { AlertType } from '../types/index'

const types = [
  {
    type: AlertType.PRIMARY,
    color: 'blue',
    icon: InformationCircleIcon,
    alertClasses: 'bg-blue-50 border-blue-200',
    iconClasses: 'text-blue-400',
    textClasses: 'text-blue-800',
    buttonClasses: 'text-blue-500 bg-blue-50 hover:bg-blue-100 focus:ring-offset-blue-50 focus:ring-blue-600',
  },
  {
    type: AlertType.SUCCESS,
    color: 'green',
    icon: CheckCircleIcon,
    alertClasses: 'bg-green-50 border-green-200',
    iconClasses: 'text-green-400',
    textClasses: 'text-green-800',
    buttonClasses: 'text-green-500 bg-green-50 hover:bg-green-100 focus:ring-offset-green-50 focus:ring-green-600',
  },
  {
    type: AlertType.WARNING,
    color: 'yellow',
    icon: ExclamationIcon,
    alertClasses: 'bg-yellow-50 border-yellow-200',
    iconClasses: 'text-yellow-400',
    textClasses: 'text-yellow-800',
    buttonClasses: 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100 focus:ring-offset-yellow-50 focus:ring-yellow-600',
  },
  {
    type: AlertType.DANGER,
    color: 'red',
    icon: XCircleIcon,
    alertClasses: 'bg-red-50 border-red-200',
    iconClasses: 'text-red-400',
    textClasses: 'text-red-800',
    buttonClasses: 'text-red-500 bg-red-50 hover:bg-red-100 focus:ring-offset-red-50 focus:ring-red-600',
  },
]

export default defineComponent({
  props: {
    closeCallback: {
      type: Function,
      default: undefined,
    },
    type: {
      type: String,
      default: 'primary',
    },
    rounded: {
      type: Boolean,
      default: true,
    },
    bordered: {
      type: Boolean,
      default: true,
    },
    fatBorder: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const alertType = computed(() => {
      return types.find(type => type.type === props.type) || types[0]
    })
    return {
      alertType,
    }
  },
})
</script>
