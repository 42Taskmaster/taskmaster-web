<template>
  <div v-if="loading">
    <Loading />
  </div>

  <AppLayout>
    <template #title>
      Programs
    </template>

    <template #actions>
      <AppButton :color="allProgramsAreStopped ? 'green' : ''" @click="startPrograms">
        <heroicons-outline-arrow-circle-up class="mr-1" />
        {{ allProgramsAreStopped ? "Start all" : "Restart all" }}
      </AppButton>
      <AppButton color="red" disabled="allProgramsAreStopped" @click="stopPrograms">
        <heroicons-outline-x-circle class="mr-1" />
        Stop all
      </AppButton>
    </template>

    <AppAlert v-if="alert.show" :type="alert.type" :close-callback="closeAlertCallback">
      {{ alert.message }}
    </AppAlert>

    <div class="flex">
      <div class="flex w-full mb-5 border-b border-solid">
        <heroicons-outline-search class="mt-1 ml-1 mr-4 text-xl text-gray-500" />
        <input
          v-model="searchQuery"
          class="w-full mb-2 text-lg bg-white bg-opacity-0 outline-none"
          placeholder="Rechercher"
        >
      </div>
      <ViewGridIcon v-if="gridMode" class="w-10 h-10 p-2 mb-5 ml-3 text-4xl text-gray-500 bg-white rounded-md shadow cursor-pointer hover:text-gray-600 hover:bg-opacity-50" @click="toggleLayout" />
      <MenuIcon v-else class="w-10 h-10 p-2 mb-5 ml-3 text-4xl text-gray-500 bg-white rounded-md shadow cursor-pointer hover:text-gray-600 hover:bg-opacity-50" @click="toggleLayout" />
      <heroicons-solid-plus class="w-10 h-10 p-2 mb-5 ml-3 text-4xl text-white bg-white bg-green-500 rounded-full shadow cursor-pointer hover:bg-opacity-80" />
    </div>

    <div
      v-if="filteredPrograms.length > 0"
      class="relative"
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
        <Program v-for="program in filteredPrograms" :key="program.id" v-bind="program" class="w-full" />
      </transition-group>
    </div>

    <div v-else class="flex items-center justify-center flex-grow">
      <p class="px-2 py-4 text-lg text-center text-gray-500">
        <template v-if="searchQuery !== ''">
          No program matches the query "{{ searchQuery }}".
        </template>
        <template v-else>
          There is no program to show. Create one by clicking the '+' button !
        </template>
      </p>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import { usePrograms } from '/~/composables/programs'
import ViewGridIcon from '/@vite-icons/heroicons-outline/view-grid.vue'
import MenuIcon from '/@vite-icons/heroicons-outline/menu.vue'

export default defineComponent({
  components: {
    ViewGridIcon,
    MenuIcon,
  },
  setup() {
    const searchQuery = ref('')
    const loading = ref(true)
    const { programs, isLoading } = usePrograms()
    const alert = ref({
      show: false,
      type: 'primary',
      message: '',
    })
    const gridMode = ref(false)
    const allProgramsAreStopped = computed(() => {
      const found = programs.value.find(program => program.state !== 'STOPPED' && program.state !== 'EXITED' && program.state !== 'FATAL')
      if (found)
        return false
      return true
    })

    watch(isLoading, (isLoading) => {
      loading.value = isLoading
    }, {
      immediate: true,
    })

    const filteredPrograms = computed(() => {
      if (searchQuery.value === '')
        return programs.value

      return programs.value.filter(({ id }) => id.startsWith(searchQuery.value))
    })
    function toggleLayout() {
      gridMode.value = !gridMode.value
    }

    return {
      searchQuery,
      loading,

      filteredPrograms,

      alert,
      allProgramsAreStopped,
      gridMode,
      toggleLayout,
    }
  },
})
</script>
