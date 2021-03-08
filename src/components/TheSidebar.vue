<template>
  <transition :duration="300">
    <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
    <div v-show="isOpen" class="md:hidden">
      <div class="fixed inset-0 z-40 flex">
        <!--
          Off-canvas menu overlay, show/hide based on off-canvas menu state.

          Entering: "transition-opacity ease-linear duration-300"
            From: "opacity-0"
            To: "opacity-100"
          Leaving: "transition-opacity ease-linear duration-300"
            From: "opacity-100"
            To: "opacity-0"
        -->
        <transition
          enter-active-class="transition-opacity duration-300 ease-linear"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-300 ease-linear"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-show="isOpen" class="fixed inset-0" aria-hidden="true" @click="closeSidebar">
            <div class="absolute inset-0 bg-gray-600 opacity-75" />
          </div>
        </transition>

        <!--
          Off-canvas menu, show/hide based on off-canvas menu state.

          Entering: "transition ease-in-out duration-300 transform"
            From: "-translate-x-full"
            To: "translate-x-0"
          Leaving: "transition ease-in-out duration-300 transform"
            From: "translate-x-0"
            To: "-translate-x-full"
        -->
        <transition
          enter-active-class="transition duration-300 ease-in-out transform"
          enter-from-class="-translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition duration-300 ease-in-out transform"
          leave-from-class="translate-x-0"
          leave-to-class="-translate-x-full"
        >
          <div v-show="isOpen" class="relative flex flex-col flex-1 w-full max-w-xs">
            <div class="absolute top-0 right-0 pt-2 -mr-12">
              <button v-show="isOpen" class="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" @click="closeSidebar">
                <span class="sr-only">
                  {{ t('close-sidebar') }}
                </span>
                <!-- Heroicon name: outline/x -->
                <svg
                  class="w-6 h-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <TheSidebarCore />
          </div>
        </transition>

        <div class="flex-shrink-0 w-14" aria-hidden="true">
          <!-- Dummy element to force sidebar to shrink to fit close icon -->
        </div>
      </div>
    </div>
  </transition>

  <TheSidebarCore class="flex-shrink-0 hidden w-64 md:block" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEventListener } from '@vueuse/core'

import { useSidebar } from '/~/composables/sidebar'

export default defineComponent({
  setup() {
    const { t } = useI18n()

    const { isOpen, setIsOpen } = useSidebar()

    function closeSidebar() {
      setIsOpen(false)
    }

    useEventListener(window, 'keydown', ({ key }) => {
      if (key === 'Escape')
        closeSidebar()
    })

    return {
      t,
      isOpen,
      closeSidebar,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "close-sidebar": "Close sidebar"
  },

  "fr": {
    "close-sidebar": "Fermer le menu"
  }
}
</i18n>
