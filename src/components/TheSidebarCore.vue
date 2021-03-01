<template>
  <div class="h-full bg-white border-r border-solid">
    <div class="flex flex-col justify-between h-full">
      <div class="flex flex-col">
        <div class="p-4 mt-5 text-2xl font-bold text-center">
          <span class="text-3xl"><span class="inline-block text-gray-600">></span>T</span>ASKMASTER
        </div>
        <div class="p-3">
          <div v-for="link in links" :key="link.title">
            <router-link
              :to="link.url"
              v-bind="link.url === '/' ? { exactActiveClass: 'bg-gray-100' } : { activeClass: 'bg-gray-100' }"
              class="block py-2.5 pl-5 my-1 rounded-lg sidebar-link hover:bg-gray-100 text-gray-700 font-semibold"
            >
              <div class="flex items-center e">
                <component :is="link.icon" class="text-lg" />
                <div class="ml-4">
                  {{ link.title }}
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div class="flex mb-5 text-2xl justify-evenly">
        <button class="mx-2 icon-btn focus:outline-none" :title="t('button.toggle_lang')" @click="toggleLocales">
          <carbon-language />
        </button>

        <a class="mx-2 icon-btn" rel="noreferrer" href="https://github.com/42Taskmaster" target="_blank" title="GitHub">
          <carbon-logo-github />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { i18n } from '../modules/i18n'

import ViewListIcon from '/@vite-icons/heroicons-outline/view-list.vue'
import CogIcon from '/@vite-icons/heroicons-outline/cog.vue'
import HomeIcon from '/@vite-icons/heroicons-outline/home.vue'
import ClipboardListIcon from '/@vite-icons/heroicons-outline/clipboard-list.vue'
import { useSidebar } from '../composables/sidebar'

export default defineComponent({
  setup() {
    const { t } = useI18n()

    const toggleLocales = () => {
      i18n.global.locale.value = i18n.global.locale.value === 'en' ? 'fr' : 'en'
      localStorage.setItem('locale', i18n.global.locale.value)
    }

    const { isOpen } = useSidebar()

    const links = computed(() => {
      return [
        {
          icon: HomeIcon,
          title: t('home'),
          url: '/',
        },
        {
          icon: ViewListIcon,
          title: t('programs'),
          url: '/programs',
        },
        {
          icon: CogIcon,
          title: t('configuration'),
          url: '/configuration',
        },
        {
          icon: ClipboardListIcon,
          title: t('logs'),
          url: '/logs',
        },
      ]
    })

    return {
      t,
      toggleLocales,

      isOpen,
      links,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "programs": "Programs",
    "configuration": "Configuration",
    "logs": "Logs",

    "button": {
      "toggle_lang": "Toggle language",
    },
  },

  "fr": {
    "programs": "Programmes",
    "configuration": "Configuration",
    "logs": "Logs",

    "button": {
      "toggle_lang": "Changer de langue",
    },
  }
}
</i18n>
