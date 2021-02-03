<template>
  <div class="h-full bg-white border-r border-solid w-80">
    <div class="flex flex-col justify-between h-full">
      <div class="flex flex-col">
        <div class="p-4 mt-5 text-2xl font-bold text-center">
          TASKMASTER
        </div>
        <div class="p-3">
          <div v-for="link in links" :key="link.title">
            <router-link :to="link.url" active-class="bg-gray-100" class="block py-2.5 pl-5 my-1 rounded-lg sidebar-link hover:bg-gray-100 text-gray-700 font-semibold">
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
      <div class="flex mb-3 text-2xl justify-evenly">
        <a class="mx-2 icon-btn" :title="t('button.toggle_dark')" @click="isDark = !isDark">
          <carbon-moon v-if="isDark" />
          <carbon-sun v-else />
        </a>

        <a class="mx-2 icon-btn" :title="t('button.toggle_langs')" @click="toggleLocales">
          <carbon-language />
        </a>

        <a class="mx-2 icon-btn" rel="noreferrer" href="https://github.com/42Taskmaster" target="_blank" title="GitHub">
          <carbon-logo-github />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ViewListIcon from '/@vite-icons/heroicons-outline/view-list.vue'
import CogIcon from '/@vite-icons/heroicons-outline/cog.vue'

import { useI18n } from 'vue-i18n'
import { isDark } from '/~/logics'

const { t, availableLocales, locale } = useI18n()

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}

const links = [
  {
    icon: ViewListIcon,
    title: 'Programs',
    url: '/programs',
  },
  {
    icon: CogIcon,
    title: 'Configuration',
    url: '/configuration',
  },
]
</script>

<style>
.sidebar-link:after {

}
</style>
