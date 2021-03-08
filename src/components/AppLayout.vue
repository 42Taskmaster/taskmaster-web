<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

import { useSidebar } from '/~/composables/sidebar'
import { ActionOptions, isActionOptions } from '/~/types/index'

export default defineComponent({
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
  },

  props: {
    constraintWidth: {
      type: Boolean,
      default: true,
    },

    actions: {
      type: Array as PropType<ActionOptions[]>,
      default: (): ActionOptions[] => [],
      validator: (actions: unknown[]): actions is ActionOptions[] => {
        return actions.every(isActionOptions)
      },
    },
  },

  setup() {
    const { t } = useI18n()

    const { toggleIsOpen } = useSidebar()

    return {
      t,

      toggleIsOpen,
    }
  },
})
</script>

<template>
  <div class="flex flex-col w-full h-full min-h-screen">
    <header class="flex items-stretch bg-white shadow">
      <button class="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden" @click="toggleIsOpen">
        <span class="sr-only">
          {{ t('open-sidebar') }}
        </span>
        <!-- Heroicon name: outline/menu-alt-2 -->
        <svg
          class="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>

      <div class="flex items-center justify-between flex-grow px-4 py-3 mx-auto sm:py-6 max-w-7xl sm:px-6 lg:px-8">
        <h1 class="text-lg font-bold sm:text-2xl">
          <slot name="title" />
        </h1>

        <div v-if="actions.length > 0" class="ml-2">
          <div class="hidden space-x-2 sm:flex">
            <AppButton
              v-for="{text, icon, size, color, disabled, onClick} in actions"
              :key="text"
              :size="size"
              :color="color"
              :disabled="disabled"
              @click="onClick"
            >
              <component :is="icon" v-if="icon !== undefined" class="mr-2" />

              {{ text }}
            </AppButton>
          </div>

          <div class="relative inline-block text-left sm:hidden">
            <Menu>
              <span class="rounded-md shadow-sm">
                <MenuButton
                  class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                >
                  <span>
                    {{ t('options') }}
                  </span>

                  <svg
                    class="w-5 h-5 ml-2 -mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </MenuButton>
              </span>

              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-out"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems
                  class="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                >
                  <div class="py-1">
                    <MenuItem
                      v-for="{text, icon, disabled, onClick} in actions"
                      :key="text"
                      v-slot="{ active }"
                      :disabled="disabled"
                    >
                      <button
                        type="button"
                        :class="[
                          active ? 'text-gray-900 bg-gray-100' : 'text-gray-700',
                          'flex items-center px-4 py-2 text-sm group w-full'
                        ]"
                        role="menuitem"
                        @click="onClick"
                      >
                        <component
                          :is="icon"
                          v-if="icon !== undefined"
                          :class="[
                            active ? 'text-gray-500' : 'text-gray-400',
                            'w-5 h-5 mr-3'
                          ]"
                        />

                        {{ text }}
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>

    <div
      :class="[
        'flex-grow w-full h-full',
        {
          'px-4 mx-auto my-8 max-w-7xl sm:px-6 lg:px-8': constraintWidth
        }
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<i18n>
{
  "en": {
    "open-sidebar": "Open sidebar",
    "options": "Options",
  },

  "fr": {
    "open-sidebar": "Ouvrir le menu",
    "options": "Options",
  }
}
</i18n>
