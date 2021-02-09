<template>
  <div
    class="p-4 mb-5 "
    :class=" [
      'bg-' + alertType.color + '-50 border-' + alertType.color + '-200 ',
      { 'rounded-md': rounded },
      { 'border': bordered },
      { 'border-l-8': fatBorder },
    ] "
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <!-- Heroicon name: solid/check-circle -->
        <component :is="alertType.icon" class="w-5 h-5 " :class="'text-' + alertType.color + '-400'" />
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium" :class="'text-' + alertType.color + '-800'">
          <slot />
        </p>
      </div>
      <div class="pl-3 ml-auto">
        <div class="-mx-1.5 -my-1.5">
          <button :class="'text-' + alertType.color + '-500 bg-' + alertType.color + '-50 hover:bg-' + alertType.color + '-100 focus:ring-offset-' + alertType.color + '-50 focus:ring-' + alertType.color + '-600'" class="inline-flex  rounded-md p-1.5  focus:outline-none focus:ring-2 focus:ring-offset-2" @click="closeCallback()">
            <span class="sr-only">Dismiss</span>
            <heroicons-solid-x class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref, onUnmounted } from 'vue'
import CheckCircleIcon from '/@vite-icons/heroicons-solid/check-circle.vue'
import InformationCircleIcon from '/@vite-icons/heroicons-solid/information-circle.vue'
import ExclamationIcon from '/@vite-icons/heroicons-solid/exclamation.vue'
import XCircleIcon from '/@vite-icons/heroicons-solid/x-circle.vue'

const types = [
  {
    type: 'primary',
    color: 'blue',
    icon: InformationCircleIcon,
  },
  {
    type: 'success',
    color: 'green',
    icon: CheckCircleIcon,
  },
  {
    type: 'warning',
    color: 'yellow',
    icon: ExclamationIcon,
  },
  {
    type: 'danger',
    color: 'red',
    icon: XCircleIcon,
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
    const alertType = types.find(type => type.type === props.type) || types[0]
    return {
      alertType,
    }
  },
})
</script>
