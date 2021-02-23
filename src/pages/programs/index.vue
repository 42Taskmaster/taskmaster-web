<template>
  <div v-if="isLoading">
    <AppLoadingOverlay />
  </div>

  <AppLayout>
    <template #title>
      {{ t('programs') }}
    </template>

    <template #actions>
      <AppButton :color="allProgramsAreStopped ? 'green' : ''" @click="startPrograms">
        <heroicons-outline-arrow-circle-up class="mr-1" />
        {{ allProgramsAreStopped ? t('start_all') : t('restart_all') }}
      </AppButton>
      <AppButton color="red" :disabled="allProgramsAreStopped" @click="stopPrograms">
        <heroicons-outline-x-circle class="mr-1" />
        {{ t('stop_all') }}
      </AppButton>
    </template>

    <AppAlert v-if="alert.show" :type="alert.type" :close-callback="closeAlert">
      {{ alert.message }}
    </AppAlert>

    <div class="flex">
      <div class="flex w-full mb-5 border-b border-solid">
        <heroicons-outline-search class="mt-1 ml-1 mr-4 text-xl text-gray-500" />
        <input
          v-model="searchQuery"
          class="w-full mb-2 text-lg bg-white bg-opacity-0 outline-none"
          :placeholder="t('search_program')"
        >
      </div>

      <button class="flex items-center justify-center p-2 mb-5 ml-3 text-4xl text-gray-500 bg-white rounded-md shadow cursor-pointer hover:text-gray-600 hover:bg-opacity-50" @click="toggleLayout">
        <ViewGridIcon v-if="gridMode" class="w-6 h-6 transform-none" />
        <MenuIcon v-else class="w-6 h-6 transform-none" />
      </button>

      <router-link class="flex items-center justify-center p-2 mb-5 ml-3 text-4xl text-white bg-white bg-green-500 rounded-full shadow cursor-pointer hover:bg-opacity-80" to="/new" :title="t('add_a_program')">
        <heroicons-solid-plus class="w-6 h-6 transform-none" />
      </router-link>
    </div>

    <div
      v-if="filteredPrograms.length > 0"
      class="relative mb-8"
    >
      <transition-group
        tag="div"
        :class="[
          'grid gap-4',
          {
            'grid-cols-1': !gridMode,
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4': gridMode,
          }
        ]"
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-6 opacity-25"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="absolute transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform translate-y-6 opacity-0"
        move-class="transition duration-300 ease"
      >
        <Program v-for="program in filteredPrograms" :key="program.id" v-bind="program" :tiled="gridMode" class="w-full" />
      </transition-group>
    </div>

    <div v-else class="flex items-center justify-center flex-grow mb-8">
      <p class="px-2 py-4 mt-10 text-lg text-center text-gray-500">
        <template v-if="searchQuery !== ''">
          {{ t('search_no_program') }} "{{ searchQuery }}".
        </template>
        <template v-else>
          {{ t('no_program') }}
        </template>
      </p>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import { usePrograms } from '/~/composables/programs'
import { useI18n } from 'vue-i18n'
import ViewGridIcon from '/@vite-icons/heroicons-outline/view-grid.vue'
import MenuIcon from '/@vite-icons/heroicons-outline/menu.vue'
import { Alert, AlertType } from '/~/types/index'

import { useRouter } from 'vue-router'
export default defineComponent({
  components: {
    ViewGridIcon,
    MenuIcon,
  },
  setup() {
    const { t } = useI18n()

    const alert = ref<Alert>({
      show: false,
      type: AlertType.PRIMARY,
      message: '',
    })
    function showAlert(type: AlertType, message: string) {
      alert.value.type = type
      alert.value.show = true
      alert.value.message = message
    }
    function closeAlert() {
      alert.value.show = false
    }

    const { programs, isLoading } = usePrograms()
    const allProgramsAreStopped = computed(() => {
      const found = programs.value.find(program => program.state !== 'STOPPED' && program.state !== 'EXITED' && program.state !== 'FATAL')
      if (found)
        return false
      return true
    })

    const searchQuery = ref('')
    const filteredPrograms = computed(() => {
      if (searchQuery.value === '')
        return programs.value

      return programs.value.filter(({ id }) => id.startsWith(searchQuery.value))
    })

    const gridMode = ref(false)
    function toggleLayout() {
      gridMode.value = !gridMode.value
    }

    const router = useRouter()
    if (router.currentRoute.value.query.new !== undefined)
      showAlert(AlertType.SUCCESS, t('program_created'))

    return {
      t,

      isLoading,

      alert,
      closeAlert,

      programs,
      allProgramsAreStopped,

      searchQuery,
      filteredPrograms,

      gridMode,
      toggleLayout,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "programs": "Programs",
    "start_all": "Start all",
    "stop_all": "Stop all",
    "restart_all": "Restart all",
    "no_program": "There is no program to show. Create one by clicking the '+' button !",
    "search_program": "Search for a program",
    "search_no_program" : "No program matches the query",
    "add_a_program" : "Add a new program",
    "program_created": "New program successfully created.",
  },

  "fr": {
    "programs": "Programmes",
    "start_all": "Tout démarrer",
    "stop_all": "Tout arrêter",
    "restart_all": "Tout redémarrer",
    "no_program": "Aucun programme pour le moment. Créez-en un en cliquant sur le bouton '+' !",
    "search_program": "Rechercher un programme",
    "search_no_program" : "Aucun programme trouvé pour la requête",
    "add_a_program" : "Ajouter un nouveau programme",
    "program_created": "Le nouveau programme a été créé avec succès.",
  }
}
</i18n>
